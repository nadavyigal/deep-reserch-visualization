'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDeepgram } from '../contexts/DeepgramContext';

// Create a throttle utility function
const throttle = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => ReturnType<F> | undefined) => {
  let lastCall = 0;
  let lastResult: ReturnType<F>;
  
  return (...args: Parameters<F>): ReturnType<F> | undefined => {
    const now = Date.now();
    if (now - lastCall < wait) {
      return lastResult;
    }
    lastCall = now;
    lastResult = func(...args);
    return lastResult;
  };
};

interface TranscriptionOptions {
  language?: string;
  model?: string;
  encoding?: string;
  sampleRate?: number;
}

interface DeepgramTranscriptionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

// Set default options outside the hook to prevent recreation on each render
const DEFAULT_OPTIONS: TranscriptionOptions = {};

export function useDeepgramTranscription() {
  const { apiKey, isLoading, error: contextError } = useDeepgram();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(contextError);
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  
  // Refs to manage the connection and media
  const socketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const transcriptRef = useRef(transcript); // To access latest transcript in closures

  // Update ref when state changes
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Memoize the URL generation function
  const generateDeepgramUrl = useMemo(() => {
    return (options: TranscriptionOptions): string => {
      let url = `wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true`;
      
      if (options.language) url += `&language=${options.language}`;
      if (options.model) url += `&model=${options.model}`;
      
      return url;
    };
  }, []);

  // Throttle the storage updates to reduce writes
  const updateLocalStorage = useMemo(() => throttle((final: string, interim: string) => {
    try {
      localStorage.setItem('deepgram_transcript', 
        JSON.stringify({
          final,
          interim
        })
      );
    } catch (e) {
      // Ignore storage errors
    }
  }, 500), []); // Throttle to once per 500ms

  // Improved cleanup function with error handling
  const cleanup = useCallback(() => {
    try {
      // Close WebSocket connection
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN || 
            socketRef.current.readyState === WebSocket.CONNECTING) {
          socketRef.current.close();
        }
        socketRef.current = null;
      }
    } catch (err) {
      console.error('Error closing WebSocket:', err);
    }

    try {
      // Stop media recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping media recorder:', err);
    }

    try {
      // Stop media stream tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.error('Error stopping track:', err);
          }
        });
        mediaStreamRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping media stream:', err);
    }

    setConnectionState('disconnected');
    setIsRecording(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Memoized WebSocket message handler
  const handleSocketMessage = useCallback((message: MessageEvent) => {
    try {
      const data = JSON.parse(message.data);
      
      // Handle transcript data
      if (data.type === 'Results') {
        const result = data.channel.alternatives[0];
        
        if (result) {
          const newTranscript = result.transcript;
          
          if (data.is_final) {
            setTranscript((prev) => {
              const updated = prev + ' ' + newTranscript.trim();
              // Use the updated value for localStorage
              updateLocalStorage(updated, '');
              return updated;
            });
            setInterimTranscript('');
          } else {
            setInterimTranscript(newTranscript);
            updateLocalStorage(transcriptRef.current, newTranscript);
          }
        }
      }
    } catch (e) {
      console.error('Error processing WebSocket message:', e);
    }
  }, [updateLocalStorage]);

  // Method to start recording and transcription
  const startRecording = useCallback(async (options: TranscriptionOptions = DEFAULT_OPTIONS) => {
    if (!apiKey) {
      setError('Deepgram API key is not available');
      return;
    }

    // Don't start a new recording if already recording
    if (isRecording) {
      console.warn('Already recording, please stop current recording first');
      return;
    }

    try {
      // Reset state
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Set up WebSocket connection to Deepgram
      const deepgramUrl = generateDeepgramUrl(options);
      
      const socket = new WebSocket(deepgramUrl);
      socketRef.current = socket;
      
      // WebSocket event handlers
      socket.onopen = () => {
        console.log('Deepgram WebSocket connection established');
        setConnectionState('connected');
        
        // Send API key for authentication
        socket.send(JSON.stringify({ 
          type: 'Authorization',
          authorization: apiKey 
        }));
        
        // Configure media recorder
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        
        // Send audio data when available
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };
        
        // Start recording
        recorder.start(250); // Collect data every 250ms
        setIsRecording(true);
      };
      
      socket.onmessage = handleSocketMessage;
      
      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setConnectionState('error');
        cleanup();
        
        // Save error in localStorage for debugging
        try {
          localStorage.setItem('deepgram_error', JSON.stringify({ 
            timestamp: new Date().toISOString(),
            error: 'WebSocket error'
          }));
        } catch (e) {
          // Ignore storage errors
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setConnectionState('disconnected');
        if (isRecording) {
          cleanup();
        }
      };
      
    } catch (err: any) {
      console.error('Error starting Deepgram transcription:', err);
      setError(err.message || 'Failed to start recording');
      cleanup();
    }
  }, [apiKey, cleanup, isRecording, generateDeepgramUrl, handleSocketMessage]);

  // Method to stop recording
  const stopRecording = useCallback(() => {
    cleanup();
    
    // Save connection state in localStorage for debugging
    try {
      localStorage.setItem('deepgram_connection_state', 'disconnected');
    } catch (e) {
      // Ignore storage errors
    }

    return transcript;
  }, [cleanup, transcript]);

  // Memoize the return value to prevent unnecessary renders
  return useMemo(() => ({
    // State
    isLoading,
    isRecording,
    transcript,
    interimTranscript,
    error,
    connectionState,

    // Methods
    startRecording,
    stopRecording
  }), [
    isLoading,
    isRecording,
    transcript,
    interimTranscript,
    error,
    connectionState,
    startRecording,
    stopRecording
  ]);
} 
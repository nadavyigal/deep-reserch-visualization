'use client';

import { useState, useCallback, useRef } from 'react';
import logger from '../utils/logger';

export function useDeepgramTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsLoading(true);
        try {
          const res = await fetch('/api/deepgram/proxy', { method: 'POST', body: blob });
          const data = await res.json();
          const text = data.results?.channels[0]?.alternatives[0]?.transcript || '';
          setTranscript(text);
          setError(null);
        } catch (err: any) {
          logger.error('Transcription error:', err);
          setError(err.message || 'Failed to transcribe');
        } finally {
          setIsLoading(false);
        }
      };
      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      logger.error('Failed to start recording:', err);
      setError(err.message || 'Failed to start recording');
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isLoading,
    isRecording,
    transcript,
    interimTranscript: '',
    error,
    startRecording,
    stopRecording
  };
}

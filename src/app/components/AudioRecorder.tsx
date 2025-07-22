'use client'

import React from 'react'
import { useDeepgramTranscription } from '@/lib/hooks/useDeepgramTranscription'

export default function AudioRecorder() {
  const {
    isRecording,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    error,
    connectionState,
  } = useDeepgramTranscription()

  const handleToggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleToggle}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      <div className="p-2 border rounded-md min-h-[4rem]">
        <p className="text-sm text-gray-500">{connectionState}</p>
        <p>{transcript}</p>
        {interimTranscript && (
          <p className="italic text-gray-400">{interimTranscript}</p>
        )}
      </div>
    </div>
  )
}

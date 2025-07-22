'use client'

import React from 'react'
import AppLayout from '../components/AppLayout'
import AudioRecorder from '../components/AudioRecorder'

export const metadata = {
  title: 'Voice Notes | Deep Research Visualization',
  description: 'Record voice notes with real-time transcription',
}

export default function VoiceNotesPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Voice Notes</h1>
        <AudioRecorder />
      </div>
    </AppLayout>
  )
}

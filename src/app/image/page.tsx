'use client'

import React from 'react'
import AppLayout from '../components/AppLayout'
import ImageGenerator from '../components/ImageGenerator'

export const metadata = {
  title: 'AI Image Generator | Deep Research Visualization',
  description: 'Generate images using AI models',
}

export default function ImageGeneratorPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>
        <ImageGenerator />
      </div>
    </AppLayout>
  )
}

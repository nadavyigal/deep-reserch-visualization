'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDownTrayIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const generateImage = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Sending request with prompt:', prompt);

      // Try FAL.ai API first
      try {
        console.log('Trying FAL.ai API...');
        const response = await fetch('/api/fal/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        // Log the raw response for debugging
        console.log('FAL Response status:', response.status);
        
        const responseText = await response.text();
        console.log('FAL Raw response text:', responseText.substring(0, 200) + '...');
        
        // Try to parse the response as JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('FAL Parsed response data:', data);
          
          if (!response.ok || data.error) {
            throw new Error(data.error || `API error (${response.status}): ${data.details || 'Unknown error'}`);
          }
          
          if (!data.images?.[0]) {
            throw new Error('No image generated in response');
          }

          setImageUrl(data.images[0]);
          return; // Success, exit the function
          
        } catch (parseError) {
          console.error('Failed to parse FAL response as JSON:', parseError);
          throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
        }
      } catch (falError) {
        // FAL.ai API failed, try Replicate as fallback
        console.error('FAL.ai API failed:', falError);
        console.log('Trying Replicate API as fallback...');
        
        const replicateResponse = await fetch('/api/replicate/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
        
        console.log('Replicate Response status:', replicateResponse.status);
        
        const replicateResponseText = await replicateResponse.text();
        console.log('Replicate Raw response text:', replicateResponseText.substring(0, 200) + '...');
        
        // Try to parse the response as JSON
        let replicateData;
        try {
          replicateData = JSON.parse(replicateResponseText);
          console.log('Replicate Parsed response data:', replicateData);
          
          if (!replicateResponse.ok || replicateData.error) {
            throw new Error(replicateData.error || `API error (${replicateResponse.status}): ${replicateData.details || 'Unknown error'}`);
          }
          
          if (!replicateData.images?.[0]) {
            throw new Error('No image generated in Replicate response');
          }

          setImageUrl(replicateData.images[0]);
          
        } catch (parseError) {
          console.error('Failed to parse Replicate response as JSON:', parseError);
          throw new Error(`Both image generation APIs failed. FAL error: ${falError instanceof Error ? falError.message : String(falError)}, Replicate error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        }
      }
      
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image with all available services');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image');
    }
  };

  const handleSave = () => {
    try {
      const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
      if (!isSaved) {
        savedImages.push({
          url: imageUrl,
          prompt,
          date: new Date().toISOString(),
        });
        localStorage.setItem('savedImages', JSON.stringify(savedImages));
        setIsSaved(true);
      } else {
        const filteredImages = savedImages.filter((img: { url: string }) => img.url !== imageUrl);
        localStorage.setItem('savedImages', JSON.stringify(filteredImages));
        setIsSaved(false);
      }
    } catch (err) {
      console.error('Error saving image:', err);
      setError('Failed to save image');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <textarea
          className="w-full p-2 border rounded-md"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt..."
          rows={4}
        />
        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          Error: {error}
        </div>
      )}

      {imageUrl && (
        <div className="relative group">
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl}
              alt="Generated image"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          
          {/* Icons overlay */}
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Download image"
            >
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title={isSaved ? "Remove from saved" : "Save image"}
            >
              {isSaved ? (
                <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Debug information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-mono text-sm">Debug Info:</p>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ prompt, imageUrl, error, isSaved }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 
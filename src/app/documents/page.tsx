'use client'

import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import LoginButton from '../components/LoginButton';
import { db, storage } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Trash2, Calendar, User } from 'lucide-react';
import Link from 'next/link';

// Define interface for document data
interface DocumentData {
  id: string;
  title?: string;
  contentPreview?: string;
  createdAt: Timestamp | Date | number | null;
  userId: string;
  fileName?: string;
  fileUrl?: string;
  [key: string]: any; // For any additional fields
}

export default function DocumentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch user's documents from Firestore
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (!db) {
          throw new Error('Database is not initialized');
        }
        const documentsRef = collection(db, 'documents');
        
        // Modified query to avoid needing composite index
        const q = query(
          documentsRef, 
          where('userId', '==', user.uid)
          // Removed orderBy to avoid needing composite index
        );
        
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DocumentData[];
        
        // Sort the documents in JavaScript instead
        const sortedDocs = docs.sort((a, b) => {
          // Convert Firestore Timestamp to Date or use existing Date or fallback to timestamp number
          const getDateValue = (timestamp: any): Date => {
            if (timestamp?.toDate) {
              return timestamp.toDate(); // Firestore Timestamp
            } else if (timestamp instanceof Date) {
              return timestamp; // Already a Date
            } else {
              return new Date(timestamp || 0); // Number or string timestamp, or fallback to epoch
            }
          };
          
          const dateA = getDateValue(a.createdAt);
          const dateB = getDateValue(b.createdAt);
          return dateB.getTime() - dateA.getTime(); // descending order (newest first)
        });
        
        setDocuments(sortedDocs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  // Delete document from Firestore and Storage
  const handleDeleteDocument = async (documentId: string, fileName: string | undefined) => {
    if (!user || !window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(documentId);
      
      // Delete from Firestore
      if (!db) {
        throw new Error('Database is not initialized');
      }
      await deleteDoc(doc(db, 'documents', documentId));
      
      // Delete from Storage if fileName exists
      if (fileName && storage) {
        const fileRef = ref(storage, `documents/${user.uid}/${fileName}`);
        await deleteObject(fileRef);
      }
      
      // Update UI
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
      
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document. Please try again later.');
    } finally {
      setDeleting(null);
    }
  };

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    // Convert Firestore Timestamp to Date or use existing Date
    const getDateValue = (timestamp: any): Date => {
      if (timestamp?.toDate) {
        return timestamp.toDate(); // Firestore Timestamp
      } else if (timestamp instanceof Date) {
        return timestamp; // Already a Date
      } else {
        return new Date(timestamp || 0); // Number or string timestamp, or fallback to epoch
      }
    };
    
    const date = getDateValue(timestamp);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // If loading auth, show loading state
  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </AppLayout>
    );
  }

  // If not logged in, show login prompt
  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to access your documents.
            </p>
            <LoginButton />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Documents</h1>
          <Link 
            href="/research" 
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            Create New Document
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't created any documents yet. Go to the Research page to create your first document.
            </p>
            <Link 
              href="/research" 
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
            >
              Create Document
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg truncate">{doc.title || 'Untitled Document'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>
                    
                    {doc.contentPreview && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {doc.contentPreview}
                      </p>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                        disabled={deleting === doc.id}
                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === doc.id ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
} 
'use client';

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  StorageReference
} from 'firebase/storage';
import { db, storage } from './firebase';

// Firestore utilities
export const createDocument = async <T extends DocumentData>(
  collectionName: string, 
  docId: string, 
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId) as DocumentReference<T>;
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const getDocument = async <T extends DocumentData>(
  collectionName: string, 
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId) as DocumentReference<T>;
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string, 
  docId: string, 
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId) as DocumentReference<T>;
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string, 
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName) as CollectionReference<T>;
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

// Storage utilities
export const uploadFile = async (
  path: string, 
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Helper functions
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const createQueryConstraints = (
  filters: { field: string; operator: string; value: any }[] = [],
  sortBy?: { field: string; direction: 'asc' | 'desc' },
  limitTo?: number
): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [];
  
  // Add filters
  filters.forEach(filter => {
    constraints.push(where(filter.field, filter.operator as any, filter.value));
  });
  
  // Add sorting
  if (sortBy) {
    constraints.push(orderBy(sortBy.field, sortBy.direction));
  }
  
  // Add limit
  if (limitTo) {
    constraints.push(limit(limitTo));
  }
  
  return constraints;
};
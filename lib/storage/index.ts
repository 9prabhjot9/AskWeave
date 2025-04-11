import { initLocalStorage, getLocalStorage } from './local-storage';
import { Collections } from '../arweave/weavedb';

// Re-export Collections enum
export { Collections };

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Storage instance
let db: any = null;
let initialized = false;

/**
 * Initialize storage
 * @returns A promise that resolves to the storage instance
 */
export async function initStorage(): Promise<any> {
  if (!isBrowser) {
    console.log('Not initializing storage in server-side context');
    initialized = true;
    return null;
  }

  try {
    if (db) return db;
    
    // Initialize localStorage database
    db = await initLocalStorage();
    initialized = true;
    return db;
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

/**
 * Get the storage instance
 * @returns The initialized storage instance
 */
export function getDB(): any {
  if (!initialized) {
    throw new Error('Storage not initialized. Call initStorage first.');
  }
  
  if (!isBrowser) {
    console.log('Attempted to use storage in server-side context');
    return {
      get: async () => null,
      set: async () => null,
      add: async () => null,
      update: async () => null,
      delete: async () => null,
      cget: async () => [],
    };
  }
  
  if (!db) {
    throw new Error('Storage not available. Browser storage may be disabled.');
  }
  
  return db;
}

/**
 * Add a document to a collection
 * @param collection The collection name
 * @param data The document data
 * @param id Optional document ID
 * @returns A promise that resolves to the transaction result
 */
export async function addDocument(
  collection: Collections,
  data: any,
  id?: string
): Promise<any> {
  try {
    const database = getDB();
    if (id) {
      return await database.set(data, collection, id);
    }
    return await database.add(data, collection);
  } catch (error) {
    console.error(`Error adding document to ${collection}:`, error);
    throw error;
  }
}

/**
 * Get a document by ID
 * @param collection The collection name
 * @param id The document ID
 * @returns A promise that resolves to the document data
 */
export async function getDocument(collection: Collections, id: string): Promise<any> {
  try {
    const database = getDB();
    return await database.get(collection, id);
  } catch (error) {
    console.error(`Error getting document from ${collection}:`, error);
    throw error;
  }
}

/**
 * Query documents from a collection
 * @param collection The collection name
 * @param queries Array of query specifications
 * @returns A promise that resolves to the query results
 */
export async function queryDocuments(
  collection: Collections,
  queries: any[] = []
): Promise<any[]> {
  try {
    const database = getDB();
    return await database.cget(collection, ...queries);
  } catch (error) {
    console.error(`Error querying documents from ${collection}:`, error);
    throw error;
  }
}

/**
 * Update a document
 * @param collection The collection name
 * @param id The document ID
 * @param data The updated document data
 * @returns A promise that resolves to the transaction result
 */
export async function updateDocument(
  collection: Collections,
  id: string,
  data: any
): Promise<any> {
  try {
    const database = getDB();
    return await database.update(data, collection, id);
  } catch (error) {
    console.error(`Error updating document in ${collection}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 * @param collection The collection name
 * @param id The document ID
 * @returns A promise that resolves to the transaction result
 */
export async function deleteDocument(collection: Collections, id: string): Promise<any> {
  try {
    const database = getDB();
    return await database.delete(collection, id);
  } catch (error) {
    console.error(`Error deleting document from ${collection}:`, error);
    throw error;
  }
}

// Create a storage service object
const StorageService = {
  initStorage,
  getDB,
  addDocument,
  getDocument,
  queryDocuments,
  updateDocument,
  deleteDocument,
  Collections,
};

export default StorageService; 
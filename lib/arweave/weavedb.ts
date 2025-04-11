// Use our mock WeaveDB for browser-compatible implementation
import { MockWeaveDB } from './mock-weavedb';

// Database collections for the Q&A platform
export enum Collections {
  QUESTIONS = 'questions',
  ANSWERS = 'answers',
  COMMENTS = 'comments',
  VOTES = 'votes',
  USERS = 'users',
  TAGS = 'tags',
  BOUNTIES = 'bounties',
}

// WeaveDB instance
let db: any = null;

/**
 * Initialize WeaveDB instance
 * @param contractTxId The WeaveDB contract transaction ID
 * @returns A promise that resolves to the WeaveDB instance
 */
export async function initWeaveDB(contractTxId?: string): Promise<any> {
  try {
    if (db) return db;

    // For browser compatibility, always use our mock implementation
    console.log(`Initializing MockWeaveDB with contract ID: ${contractTxId || 'none'}`);
    
    db = new MockWeaveDB({ contractTxId });
    await db.initialize();
    
    // Set up collections
    for (const collection of Object.values(Collections)) {
      try {
        await db.addCollection(collection);
        console.log(`Collection initialized: ${collection}`);
      } catch (e) {
        // Collection might already exist
        console.log(`Collection may already exist: ${collection}`);
      }
    }
    
    console.log('WeaveDB initialized successfully with browser-compatible mock');
    
    // Display storage type information
    if (typeof window !== 'undefined') {
      console.log('DATA IS STORED IN LOCAL STORAGE - Not on the blockchain');
      console.log('This is a development implementation only');
    }
    
    return db;
  } catch (error) {
    console.error('Error initializing WeaveDB:', error);
    throw error;
  }
}

/**
 * Get the WeaveDB instance
 * @returns The initialized WeaveDB instance
 */
export function getDB(): any {
  if (!db) {
    throw new Error('WeaveDB not initialized. Call initWeaveDB first.');
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
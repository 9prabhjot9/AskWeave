/**
 * LocalStorage based data storage
 * A simple storage implementation that uses localStorage for development/testing
 */

import { Collections } from '../arweave/weavedb';

// Generate a unique ID
function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// LocalStorage implementation
class LocalStorageDB {
  private collections: Record<string, boolean> = {};

  constructor() {
    console.log('Initializing LocalStorage database for development');
  }

  async initialize(): Promise<void> {
    // Initialize collections if they don't exist
    for (const collection of Object.values(Collections)) {
      this.addCollection(collection);
    }
  }

  async addCollection(collectionName: string): Promise<void> {
    if (!isBrowser) return;
    
    if (!localStorage.getItem(collectionName)) {
      localStorage.setItem(collectionName, JSON.stringify({}));
      this.collections[collectionName] = true;
      console.log(`Created collection: ${collectionName}`);
    } else {
      this.collections[collectionName] = true;
      console.log(`Collection ${collectionName} already exists`);
    }
  }

  async set(data: any, collectionName: string, id: string): Promise<string> {
    if (!isBrowser) return id;
    
    // Get the collection
    const collection = JSON.parse(localStorage.getItem(collectionName) || '{}');
    
    // Add timestamps
    const timestamp = Date.now();
    data = {
      ...data,
      id,
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp
    };
    
    // Update the item
    collection[id] = data;
    
    // Save back to localStorage
    localStorage.setItem(collectionName, JSON.stringify(collection));
    
    return id;
  }

  async add(data: any, collectionName: string): Promise<string> {
    if (!isBrowser) return '';
    
    // Generate a new ID
    const id = generateId();
    
    // Add the item with the generated ID
    await this.set(data, collectionName, id);
    
    return id;
  }

  async get(collectionName: string, id: string): Promise<any> {
    if (!isBrowser) return null;
    
    // Get the collection
    const collection = JSON.parse(localStorage.getItem(collectionName) || '{}');
    
    // Return the item
    return collection[id] || null;
  }

  async cget(collectionName: string, ...queries: any[]): Promise<any[]> {
    if (!isBrowser) return [];
    
    // Get the collection
    const collection = JSON.parse(localStorage.getItem(collectionName) || '{}');
    
    // Convert object to array
    let results = Object.values(collection);
    
    // Apply filtering based on queries
    if (queries && queries.length > 0) {
      // Simple filter implementation (very basic)
      for (const query of queries) {
        if (Array.isArray(query) && query.length >= 3) {
          const [field, operator, value] = query;
          
          results = results.filter((item: any) => {
            if (operator === '==') return item[field] === value;
            if (operator === '>') return item[field] > value;
            if (operator === '<') return item[field] < value;
            if (operator === '>=') return item[field] >= value;
            if (operator === '<=') return item[field] <= value;
            if (operator === '!=') return item[field] !== value;
            return true;
          });
        }
      }
    }
    
    // Sort by createdAt desc by default
    results.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
    
    return results;
  }

  async update(data: any, collectionName: string, id: string): Promise<string> {
    if (!isBrowser) return id;
    
    // Get the current item
    const item = await this.get(collectionName, id);
    
    if (!item) {
      throw new Error(`Item with ID ${id} not found in collection ${collectionName}`);
    }
    
    // Merge existing data with new data
    const updatedData = { ...item, ...data, updatedAt: Date.now() };
    
    // Update the item
    await this.set(updatedData, collectionName, id);
    
    return id;
  }

  async delete(collectionName: string, id: string): Promise<string> {
    if (!isBrowser) return id;
    
    // Get the collection
    const collection = JSON.parse(localStorage.getItem(collectionName) || '{}');
    
    // Delete the item
    delete collection[id];
    
    // Save back to localStorage
    localStorage.setItem(collectionName, JSON.stringify(collection));
    
    return id;
  }
}

// Create a singleton instance
let localStorageDB: LocalStorageDB | null = null;

/**
 * Initialize LocalStorage database
 * @returns A promise that resolves to the LocalStorage database instance
 */
export async function initLocalStorage(): Promise<any> {
  if (localStorageDB) return localStorageDB;
  
  localStorageDB = new LocalStorageDB();
  await localStorageDB.initialize();
  
  return localStorageDB;
}

/**
 * Get the LocalStorage database instance
 * @returns The initialized LocalStorage database instance
 */
export function getLocalStorage(): any {
  if (!localStorageDB) {
    throw new Error('LocalStorage not initialized. Call initLocalStorage first.');
  }
  return localStorageDB;
}

export default {
  initLocalStorage,
  getLocalStorage
}; 
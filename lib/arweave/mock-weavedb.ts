/**
 * Mock WeaveDB for browser-compatible implementation
 * This is a simplified mock that uses localStorage instead of blockchain storage
 */

import { Collections } from './weavedb';

// Define a type for stored documents
interface StoredDocument {
  id: string;
  data: any;
  collection: string;
  createdAt: number;
  updatedAt: number;
}

// Mock WeaveDB class
export class MockWeaveDB {
  private contractTxId: string;
  private localStorageKey: string;
  private isInitialized: boolean = false;

  constructor(config?: { contractTxId?: string }) {
    this.contractTxId = config?.contractTxId || 'mock-contract-id';
    this.localStorageKey = `askweave-db-${this.contractTxId}`;
  }

  /**
   * Initialize the mock database
   */
  async initialize(): Promise<void> {
    console.log('Initializing MockWeaveDB with localStorage storage');
    
    // Ensure the database collections exist in localStorage
    if (typeof window !== 'undefined') {
      const existingData = localStorage.getItem(this.localStorageKey);
      if (!existingData) {
        // Initialize with empty collections
        const initialData: Record<string, StoredDocument[]> = {};
        Object.values(Collections).forEach(collection => {
          initialData[collection] = [];
        });
        localStorage.setItem(this.localStorageKey, JSON.stringify(initialData));
      }
    }
    
    this.isInitialized = true;
    return Promise.resolve();
  }

  /**
   * Get all documents from a collection
   */
  async get(collection: string, id?: string): Promise<any> {
    this.ensureInitialized();
    
    const data = this.getDataFromStorage();
    
    if (!id) {
      return data[collection] || [];
    }
    
    const document = data[collection]?.find((doc: StoredDocument) => doc.id === id);
    if (!document) {
      throw new Error(`Document with ID ${id} not found in collection ${collection}`);
    }
    
    return document.data;
  }

  /**
   * Add a document to a collection
   */
  async add(data: any, collection: string): Promise<{ id: string }> {
    this.ensureInitialized();
    
    const id = this.generateId();
    await this.set(data, collection, id);
    
    return { id };
  }

  /**
   * Set a document with a specific ID
   */
  async set(data: any, collection: string, id: string): Promise<{ id: string }> {
    this.ensureInitialized();
    
    const storageData = this.getDataFromStorage();
    
    if (!storageData[collection]) {
      storageData[collection] = [];
    }
    
    const timestamp = Date.now();
    const existingIndex = storageData[collection].findIndex((doc: StoredDocument) => doc.id === id);
    
    const document: StoredDocument = {
      id,
      data,
      collection,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    if (existingIndex >= 0) {
      // Update existing document
      document.createdAt = storageData[collection][existingIndex].createdAt;
      storageData[collection][existingIndex] = document;
    } else {
      // Add new document
      storageData[collection].push(document);
    }
    
    this.saveDataToStorage(storageData);
    
    return { id };
  }

  /**
   * Update a document
   */
  async update(data: any, collection: string, id: string): Promise<{ id: string }> {
    this.ensureInitialized();
    
    const storageData = this.getDataFromStorage();
    
    if (!storageData[collection]) {
      throw new Error(`Collection ${collection} not found`);
    }
    
    const existingIndex = storageData[collection].findIndex((doc: StoredDocument) => doc.id === id);
    
    if (existingIndex < 0) {
      throw new Error(`Document with ID ${id} not found in collection ${collection}`);
    }
    
    // Merge the existing data with the new data
    const existingData = storageData[collection][existingIndex].data;
    const mergedData = { ...existingData, ...data };
    
    const document: StoredDocument = {
      id,
      data: mergedData,
      collection,
      createdAt: storageData[collection][existingIndex].createdAt,
      updatedAt: Date.now()
    };
    
    storageData[collection][existingIndex] = document;
    this.saveDataToStorage(storageData);
    
    return { id };
  }

  /**
   * Delete a document
   */
  async delete(collection: string, id: string): Promise<{ id: string }> {
    this.ensureInitialized();
    
    const storageData = this.getDataFromStorage();
    
    if (!storageData[collection]) {
      throw new Error(`Collection ${collection} not found`);
    }
    
    const existingIndex = storageData[collection].findIndex((doc: StoredDocument) => doc.id === id);
    
    if (existingIndex < 0) {
      throw new Error(`Document with ID ${id} not found in collection ${collection}`);
    }
    
    storageData[collection].splice(existingIndex, 1);
    this.saveDataToStorage(storageData);
    
    return { id };
  }

  /**
   * Custom get with query support (simplified)
   */
  async cget(collection: string, ...queries: any[]): Promise<any[]> {
    this.ensureInitialized();
    
    const data = this.getDataFromStorage();
    const documents = data[collection] || [];
    
    if (!queries || queries.length === 0) {
      return documents.map((doc: StoredDocument) => ({ ...doc.data, id: doc.id }));
    }
    
    // Very simple query filtering - this is a minimal implementation
    // In a real app, implement proper query parsing
    return documents
      .filter((doc: StoredDocument) => {
        // If we have queries, do basic filtering
        // This is a simplified version - only supports where queries
        for (const query of queries) {
          if (query[0] === 'where') {
            const [_, field, operator, value] = query;
            
            // Basic operators
            switch (operator) {
              case '==':
                if (doc.data[field] !== value) return false;
                break;
              case '>':
                if (doc.data[field] <= value) return false;
                break;
              case '<':
                if (doc.data[field] >= value) return false;
                break;
              case '>=':
                if (doc.data[field] < value) return false;
                break;
              case '<=':
                if (doc.data[field] > value) return false;
                break;
            }
          }
          // Add support for other query types as needed
        }
        return true;
      })
      .map((doc: StoredDocument) => ({ ...doc.data, id: doc.id }));
  }

  /**
   * Add a collection (used for initialization)
   */
  async addCollection(collection: string): Promise<void> {
    this.ensureInitialized();
    
    const storageData = this.getDataFromStorage();
    
    if (!storageData[collection]) {
      storageData[collection] = [];
      this.saveDataToStorage(storageData);
    }
    
    return Promise.resolve();
  }

  // Helper methods
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('MockWeaveDB not initialized. Call initialize() first.');
    }
  }

  private getDataFromStorage(): Record<string, StoredDocument[]> {
    if (typeof window === 'undefined') {
      return {};
    }
    
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : {};
  }

  private saveDataToStorage(data: Record<string, StoredDocument[]>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
} 
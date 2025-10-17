// Storage interface - not used in this application
// This app uses localStorage for auth and webhook proxy for submissions
// No server-side data persistence is needed

export interface IStorage {
  // Placeholder for future use
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for this application
  }
}

export const storage = new MemStorage();

import { Client, Account, Databases, Storage } from 'appwrite';

// Appwrite configuration
const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const COLLECTION_IDS = {
    USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    DISHES: import.meta.env.VITE_APPWRITE_DISHES_COLLECTION_ID,
    MENUS: import.meta.env.VITE_APPWRITE_MENUS_COLLECTION_ID,
    ORDERS: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
    CARTS: import.meta.env.VITE_APPWRITE_CARTS_COLLECTION_ID,
    REVIEWS: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID,
};

// Storage bucket ID
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

export default client;

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

console.log("MongoDB URI configured:", uri ? "✓" : "✗");

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch(err => {
      console.error("MongoDB connection failed:", err.message);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(err => {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  });
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("soulware");
    return { client, db };
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default clientPromise;

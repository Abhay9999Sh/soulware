import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 15000, // 15 seconds
  connectTimeoutMS: 15000, // 15 seconds
  socketTimeoutMS: 15000, // 15 seconds
  maxPoolSize: 10,
  minPoolSize: 1,
  family: 4 // Use IPv4, skip trying IPv6
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    console.log("Creating new MongoDB connection...");
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then((client) => {
      console.log("MongoDB connected successfully");
      return client;
    }).catch((error) => {
      console.error("MongoDB connection error:", error);
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then((client) => {
    console.log("MongoDB connected successfully (production)");
    return client;
  }).catch((error) => {
    console.error("MongoDB connection error (production):", error);
    throw error;
  });
}

export default clientPromise;

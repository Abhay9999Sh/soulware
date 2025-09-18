import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  try {
    console.log("Testing MongoDB connection...");
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ 
        success: false, 
        error: "MONGODB_URI not found in environment variables" 
      }, { status: 500 });
    }

    console.log("URI found, attempting connection...");

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
    };

    const client = new MongoClient(uri, options);
    
    // Test connection
    await client.connect();
    console.log("Connected to MongoDB");
    
    // Test database access
    const db = client.db("soulware");
    const collections = await db.listCollections().toArray();
    
    // Close connection
    await client.close();
    
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connection successful",
      collections: collections.map(c => c.name),
      connectionString: uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') // Hide credentials
    });

  } catch (error) {
    console.error("MongoDB connection test failed:", error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      errorType: error.constructor.name,
      details: {
        code: error.code,
        cause: error.cause?.message,
        hostname: error.cause?.hostname
      }
    }, { status: 500 });
  }
}

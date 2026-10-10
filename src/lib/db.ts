import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const db = mongoClient.db(
  process.env.MONGODB_DB_NAME || "bazar-dor"
);
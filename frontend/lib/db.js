import { MongoClient } from 'mongodb';

const uri =
  process.env.MONGO_URI ||
  process.env.DATABASE_URI ||
  'mongodb+srv://graham:aGUi9njxs%40b6F5v@cluster0.ccjkejl.mongodb.net/ba_mc_erp?appName=Cluster0';

let cachedClient = null;

export async function getClient() {
  if (cachedClient) {
    try {
      await cachedClient.db('ba_mc_erp').command({ ping: 1 });
      return cachedClient;
    } catch {
      cachedClient = null;
    }
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });

  await client.connect();
  cachedClient = client;
  return cachedClient;
}

export async function getDb(dbName = 'ba_mc_erp') {
  const client = await getClient();
  return client.db(dbName);
}

export async function getCollection(collectionName) {
  const db = await getDb();
  const name = collectionName.startsWith('vaani_')
    ? collectionName
    : `vaani_${collectionName}`;
  return db.collection(name);
}

export default getClient;


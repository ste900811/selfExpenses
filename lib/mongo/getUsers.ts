import clientPromise from './index'

let client :any;
let db :any;
let users :any;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db('selfExpenses');
    users = await db.collection('users');
  } catch (error) {
    throw new Error('Error connecting to database');
  }
}

;(async () => {
  await init();
})();

export async function getUsers() {
  console.log("Testing1")
  try {
    if(!users) await init();
    const result = await users.find({}).toArray();
    console.log("Result:", result)
    return { result };
  } catch (error) {
    return { error: 'Failed to fetch users' };
  }
}

// import { MongoClient } from 'mongodb';

// export const getUsers = async () => {
//   const uri: any = process.env.MONGODB_URI;
//   const mongoClient = new MongoClient(uri);

//   const data = await mongoClient.db('selfExpenses').collection('users').find().toArray();
//   console.log("Data:", data)
// }

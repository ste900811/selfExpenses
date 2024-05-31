import clientPromise from './index'

let client :any;
let db :any;
let details :any;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db('selfExpenses');
    details = await db.collection('details');
  } catch (error) {
    throw new Error('Error connecting to database');
  }
}
 
;(async () => {
  await init();
})();

export async function getDetails() {
  try {
    if(!details) { await init(); }
    const result = await details.find({}).toArray();
    return { result };
  } catch (error) {
    return { error: 'Failed to fetch details' };
  }
}
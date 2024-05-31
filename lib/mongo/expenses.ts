import clientPromise from './index'

let client :any;
let db :any;
let expenses :any;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db('selfExpenses');
    expenses = await db.collection('expenses');
  } catch (error) {
    throw new Error('Error connecting to database');
  }
}
 
;(async () => {
  await init();
})();

export async function postExpenses(data: any) {
  try {
    if(!expenses) { await init(); }
    await expenses.insertOne(data);
    return "Details posted successfully";
  } catch (error) {
    return { error: 'Failed to post details' };
  }
}
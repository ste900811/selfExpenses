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

export async function getExpenses(year: number, month: number) {
  try {
    if(!expenses) { await init(); }
    const result = await expenses.find({"year": year, "month": month}).toArray();
    return { result };
  } catch (error) {
    return { error: 'Failed to fetch expenses' };
  }
}

export async function postExpenses(data: any) {
  try {
    if(!expenses) { await init(); }
    await expenses.insertOne(data);
    return "Expense posted successfully";
  } catch (error) {
    return { error: 'Failed to post expense' };
  }
}
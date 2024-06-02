import { ObjectId } from 'mongodb';
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

export async function putExpenses(data: any) {
  try {
    if(!expenses) { await init(); }

    // fetch the current expense
    const objectID = new ObjectId(data.collectionID.toString());
    const currentExpense = await expenses.find( {"_id": objectID}).toArray();
    const dailyExpenses = currentExpense[0].day;

    if (data.action === "insertDay") {
      // add the new expense to the dailyExpenses array
      dailyExpenses.push({
        "day" : data.day,
        "category" : data.category, 
        "detail": data.detail, 
        "amount" : data.amount
      })

      // update the expense with the new dailyExpenses array
      expenses.updateOne(
        { "_id": objectID },
        { $set: { "day": dailyExpenses } }
      )

      return "Expense added successfully";
    }
  } catch (error) {
    return { error: 'Failed to fetch expenses' };
  }
}

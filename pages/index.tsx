import { useState, useEffect } from 'react';
import indexStyles from '../styles/index.module.css';
import category from "../datas/category";
import axios from 'axios';

export default function Home() {
  
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [day, setDay] = useState(currentDate.getDate());
  const [collectionID, setCollectionID] = useState<String>("");
  const [categories, setCategories] = useState(category());
  const [details, setDetails] = useState<String []>([]) ;
  const [value, setValue] = useState<any>("");
  const [dailyExpenses, setDailyExpenses] = useState<any>([]);

  // fetch the initial data function
  const fetchInitialData = async (year: Number, month: Number) => {
    try {
      // fetch details and store it in the array, it helps when user enters detail will filtered by this array
      const details = await axios.get('/api/mongoDB/details');
      let detailsArray: String[] = [];
      details.data.details.result.forEach((detail: any) => detailsArray.push(detail.detail.toString()));
      setDetails(detailsArray);

      fetchingDailyExpenses(year, month);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch expenses basaed on year and month
  const fetchingDailyExpenses = async (year: Number, month: Number) => {
    // fetch expenses basaed on year and month
    const expenses = await axios.get('/api/mongoDB/expenses', {params: {year: year, month: month}});
    if (expenses.data.expenses.result.length === 0) {
      setDailyExpenses([]);
      alert("There is no expense for this month"); return;
    }

    const dailyExpenses = expenses.data.expenses.result[0].day;
    setCollectionID(expenses.data.expenses.result[0]._id);
    
    // hash the daily expenses based on day
    let hashDay = new Map();
    dailyExpenses.forEach((expense: any) => {
      if (hashDay.has(expense.day)) {
        hashDay.get(expense.day).push(expense);
      } else {
        hashDay.set(expense.day, [expense]);
      }
    });

    // sorting the daily expenses based on the day, so when listed out will auto generate by date
    // Also extract which day exists in the month, so when user enters the day, we will know need to add
    //   the day to the database, or create the new day in the database
    let dailyExpensesArray = []
    let validDayArray = [];
    for (let i = 1; i <= 31; i++) {
      if (hashDay.has(i)) {
        validDayArray.push(i);
        for (let j = 0; j < hashDay.get(i).length; j++) {
          dailyExpensesArray.push(hashDay.get(i)[j]);
        }
      }
    }
    setDailyExpenses(dailyExpensesArray);
  }

  // This is fetching the initial data
  useEffect(() => {
    fetchInitialData(year, month);
  }, []);

  useEffect(() => {
    fetchingDailyExpenses(year, month);
  }, [year, month]);

  const updateYearAndDate = () => {
    console.log("Update Year and Date");
    let year = Number((document.getElementById("yearID") as HTMLInputElement).value);
    let month = Number((document.getElementById("monthID") as HTMLInputElement).value);
    if (month < 1 || month > 12) { alert("Please enter a valid month"); return; }
    setYear(year);
    setMonth(month);
  }

  const insertExpense = async () => {
    console.log("Insert Expense");
    let year = Number((document.getElementById("yearID") as HTMLInputElement).value);
    let month = Number((document.getElementById("monthID") as HTMLInputElement).value);
    let day = Number((document.getElementById("dayID") as HTMLInputElement).value);
    let category = (document.getElementById("categoryID") as HTMLSelectElement).value;
    let detail = (document.getElementById("detailID") as HTMLInputElement).value;
    let amount = (document.getElementById("amountID") as HTMLInputElement).value;

    if (category === "" || detail === "" || amount === "") {
      alert("Please enter all the fields"); return;
    }

    // if the category is not in the list, we will send an alert to user to enter a valid category
    if (!categories.includes(category)) { alert("Please enter a valid category"); return; }

    // if the detail is new detail, we will add the detail to the array and insert the detail into the database
    if (!details.includes(detail)) {
      // add the detail to the array
      setDetails([...details, detail]);

      // insert the new detail into the database with API call
      await axios.post('/api/mongoDB/details', { detail: detail })
      .then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      })
    }
    
    // if      : dailyExpenses is empty, we will create first data(collection)
    // else if : dailyExpenses is not empty, which mean we need to insert new data into the existing collection
    if (dailyExpenses.length === 0) {
      // insert the expense into the database
      await axios.post('/api/mongoDB/expenses', 
        { year: year, month: month, day: day, category: category, detail: detail, amount: amount })
      .then((response) => { console.log(response.data); })
      .catch((error) => { console.log(error); })
    } else if (dailyExpenses.length !== 0) {
      await axios.put('/api/mongoDB/expenses',
        { collectionID: collectionID, day: day, category: category, detail: detail, amount: amount, action: "insertDay"})
      .then((response) => { console.log(response.data); })
      .catch((error) => { console.log(error); })
    }

    // after insert the expense, we will update the daily expenses
    fetchingDailyExpenses(year, month);
  }


  return (
    <div className = {indexStyles.container}>
      <title>Home Page</title>

      <div className= {indexStyles.title}>
        <h1>This is {year}/{ month < 10 ? 0+month.toString() : month } page</h1>
      </div>

      <div className = {indexStyles.input}>
        Year:  <input type="number" id="yearID" defaultValue={year.toString()}></input>
        Month: <input type="number" id="monthID" min="1" max="12" defaultValue={month.toString() }></input>
        <input type="button" value="Update" onClick={updateYearAndDate}></input>
      </div><p></p>

      <div>
        Day: <input type="number" id="dayID" defaultValue={day.toString()}></input>
        Category: <select name="category" id="categoryID">
                    {categories.map((category: any) => <option key={category} value={category}>{category}</option>)}
                  </select>
        Details: <input type="text" id="detailID" value={value} onChange={(e)=>{setValue(e.target.value);}} />
                 <div>
                  {details.filter(detail => {
                            const searchTerm = value.toLowerCase();
                            const name = detail.toLowerCase();
                            return searchTerm && name.includes(searchTerm) && name !== searchTerm;})
                          .map((item: any) => <div className="dropDown" onClick={()=>{setValue(item);}} key={item}>{item}</div>)
                  }
                </div>
        Amount: <input type="text" id="amountID" value="1.99"/>
        <input type="button" value="Insert" onClick={() => {insertExpense();}}></input>
      </div>
      
      <div>
        {dailyExpenses.map((expense: any) => 
        <p key={expense._id+expense.category+expense.detail+expense.amount}> {expense.day} {expense.category} {expense.detail} {expense.amount}</p>)}
      </div>
      
    </div>
  );
}

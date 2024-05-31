import { useState, useEffect } from 'react';
import indexStyles from '../styles/index.module.css';
import category from "../datas/category";
import axios from 'axios';

export default function Home() {
  
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [day, setDay] = useState(currentDate.getDate());
  const [categories, setCategories] = useState(category());
  const [details, setDetails] = useState<String []>([]) ;
  const [value, setValue] = useState<any>("");
  const [dailyExpenses, setDailyExpenses] = useState<any>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try{
        
        // fetch details and store it in the array
        const details = await axios.get('/api/mongoDB/details');
        let detailsArray: String[] = [];
        details.data.details.result.forEach((detail: any) => detailsArray.push(detail.detail.toString()));
        setDetails(detailsArray);

        // fetch expenses basaed on year and month
        const expenses = await axios.get('/api/mongoDB/expenses', {params: {year: year, month: month}});
        const dailyExpenses = expenses.data.expenses.result[0].day;

        let hashDay = new Map();
        dailyExpenses.forEach((expense: any) => {
          if (hashDay.has(expense.day)) {
            hashDay.get(expense.day).push(expense);
          } else {
            hashDay.set(expense.day, [expense]);
          }
        });

        let dailyExpensesArray = []
        for (let i = 1; i <= 31; i++) {
          if (hashDay.has(i)) {
            for (let j = 0; j < hashDay.get(i).length; j++) {
              dailyExpensesArray.push(hashDay.get(i)[j]);
            }
          }
        }
        setDailyExpenses(dailyExpensesArray);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInitialData();
  }, [year, month]);

  const updateYearAndDate = () => {
    console.log("Update Year and Date");
    let year = Number((document.getElementById("yearID") as HTMLInputElement).value);
    let month = Number((document.getElementById("monthID") as HTMLInputElement).value);
    if (month < 1 || month > 12) { alert("Please enter a valid month"); return; }
    setYear(year);
    setMonth(month);
  }

  const insertExpense = () => {
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

    // if the category is not in the list
    if (!categories.includes(category)) { alert("Please enter a valid category"); return; }

    // if the detail is new detail
    if (!details.includes(detail)) {
      // add the detail to the array
      setDetails([...details, detail]);

      // insert the new detail into the database
      axios.post('/api/mongoDB/details', { detail: detail })
      .then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      })
    }

    // insert the expense into the database
    axios.post('/api/mongoDB/expenses', 
              { year: year, month: month, day: day, category: category, detail: detail, amount: amount })
    .then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })

  }


  return (
    <div className = {indexStyles.container}>
      <title>Home Page</title>
      
      <h1>This is {year}/{ month < 10 ? 0+month.toString() : month } page</h1>

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
        {dailyExpenses.map((expense: any) => <p key={expense._id}>{expense.day} {expense.category} {expense.detail} {expense.amount}</p>)}
      </div>
      
    </div>
  );
}

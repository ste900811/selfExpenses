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

  useEffect(() => {
    const fetchInitialData = async () => {
      try{
        // fetch details and store it in the array
        let detailsArray: String[] = [];
        const details = await axios.get('/api/mongoDB/getDetails');
        details.data.details.result.forEach((detail: any) => detailsArray.push(detail.detail.toString()));
        setDetails(detailsArray);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInitialData();
}, []);


  const updateYearAndDate = () => {
    console.log("Update Year and Date");
    let year = Number((document.getElementById("year") as HTMLInputElement).value);
    let month = Number((document.getElementById("month") as HTMLInputElement).value);
    if (month < 1 || month > 12) { alert("Please enter a valid month"); return; }
    setYear(year);
    setMonth(month);
  }

  return (
    <div className = {indexStyles.container}>
      <title>Home Page</title>
      
      <h1>This is {year}/{ month < 10 ? 0+month.toString() : month } page</h1>

      <div className = {indexStyles.input}>
        Year:  <input type="number" id="year" defaultValue={year.toString()}></input>
        Month: <input type="number" id="month" min="1" max="12" defaultValue={month.toString() }></input>
        <input type="button" value="Update" onClick={updateYearAndDate}></input>
      </div><p></p>

      <div>
        Day: <input type="number" id="day" defaultValue={day.toString()}></input>
        Category: <select name="category" id="category">
                    {categories.map((category: any) => <option value={category}>{category}</option>)}
                  </select>
        Details: <input type="text" id="Details" value={value} onChange={(e)=>{setValue(e.target.value);}} />
                 <div>
                  {details.filter(detail => {
                            const searchTerm = value.toLowerCase();
                            const name = detail.toLowerCase();
                            return searchTerm && name.includes(searchTerm) && name !== searchTerm;})
                          .map((item: any) => <div className="dropDown" onClick={()=>{setValue(item);}} key={item}>{item}</div>)
                  }
                </div>
      </div>

    </div>
  );
}

import Head from "next/head";
import { useState } from "react";

export default function insertExpense() {

  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  console.log("Current Year:", year);
  console.log("Current Month:", month);

  return (
    <div>
      <Head>
        <title>Insert</title>
      </Head>
      
      <h1>Insert Expense</h1>


    </div>
  );
}

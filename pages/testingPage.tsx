import Head from "next/head";
import category from "../datas/category";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function testingPage() {

  // Have to use useState to store the data
  const [users, setUsers] = useState([]);

  // This is for fetching data from MongoDB database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mongoDB/getTestUsers');

        setUsers(response.data.users.result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // This is for fetching data from local file
  const categories: any = category();

  return (
    <div>
      <Head>
        <title>Testing Page</title>
      </Head>
      
      {categories.map((category: any) => <p key={category}>{category}</p>)}

      {users.map((user: any) => <p key={user._id}>{user.name}</p>)}
    </div>
  );
}

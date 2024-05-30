import Head from "next/head";
import category from "../datas/category";
import { getUsers } from '../lib/mongo/getUsers';

// This is for fetching data from MongoDB database
async function fetchUsers() {
  const { users }: any = await getUsers();
  if (!users) throw new Error('Failed to fetch users')
  return users;
}

export default async function testingPage() {

  // This is for fetching data from local file
  const categories: any = category();

  // This is fetching data from function above
  const users = await fetchUsers();

  return (
    <div>
      <Head>
        <title>About Page</title>
      </Head>
      
      {categories.map((category: String) => <p>{category}</p>)}

      <h1>Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user._id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

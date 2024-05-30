import Head from "next/head";
import category from "../datas/category";

export default function About() {
  const categories: any = category();

  return (
    <div>
      <Head>
        <title>About Page</title>
      </Head>
      
      {categories.map((category: String) => <p>{category}</p>)}
    </div>
  );
}
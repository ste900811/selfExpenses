import Head from "next/head";
import activityTypes from "../datas/activityTypes";

export default function About() {
  const activities: any = activityTypes();

  return (
    <div>
      <Head>
        <title>About Page</title>
      </Head>
      
      {activities.map((activity: String) => <p>{activity}</p>)}
    </div>
  );
}
import Head from 'next/head'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import Featured from '../components/Featured'
import PizzaList from '../components/PizzaList'
import Add from "../components/Add";
import AddButton from "../components/AddButton";
import {useState} from 'react';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Home({pizzaList,admin}) {

  const [close, setClose] = useState(true)

  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza World</title>
        <meta name="description" content="Best pizza in the city" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
      {<AddButton setClose={setClose} />}
      <PizzaList pizzaList={pizzaList} />
      {!close && <Add setClose={setClose} />}
    </div>
  )
}

export const getServerSideProps = async (ctx) => {

  const myCookie = ctx.req?.cookies || "";
  let admin = false;

  if (myCookie.token === process.env.TOKEN) {
    admin = true;
  }

  const res = await axios.get(`${BASE_URL}/api/products`);
  return{
    props:{
      pizzaList:res.data
    }
  }
} 
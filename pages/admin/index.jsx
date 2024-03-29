import React, {useState} from 'react'
import styles from '../../styles/Admin.module.css';
import Image from 'next/image';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Index = ({orders,products}) => {

    const [pizzaList, setPizzList] = useState(products);
    const [ordersList,setOrdersList] = useState(orders);
    const status = ["preparing","on the way","delivered"];

    const handleDelete = async (id) => {
        try{
            const res = await axios.delete(`${BASE_URL}/api/products/` +id);
            setPizzList(pizzaList.filter((pizza) => pizza._id !== id))
        }catch(error){
            console.log(error);
        }
    }

    const handleStatus = async (id) => {

        const item = ordersList.filter((order) => order._id === id)[0];
        const currentStatus = item.status;

        try{
            const res = await axios.put(`${BASE_URL}/api/orders/`+id, {
                status:currentStatus +1,
            });
            setOrdersList([
                res.data,
                ...ordersList.filter((order) => order._id !== id)
            ])
        }
        catch(error){
            console.log(error);
        }
    }

  return (
    <div className={styles.container}>
        <div className={styles.item}>
            <h1 className={styles.title}>Products</h1>
            <table className={styles.table}> 
                <thead>
                    <tr className={styles.trTitle}>
                        <th>Image</th>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {pizzaList.map((product) => (
                    <tbody key={product._id}>
                        <tr className={styles.trTitle}>
                            <td>
                                <Image 
                                    src={product.img}
                                    width={50}
                                    height={50}
                                    objectFit="cover"
                                    alt=""
                                />
                            </td>
                            <td>{product._id.slice(0,5)}...</td>
                            <td>{product.title}</td>
                            <td>${product.prices[0]}</td>
                            <td>
                                <button className={styles.button}>Edit</button>
                                <button 
                                    className={styles.button}
                                    onClick={() =>handleDelete(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
        <div className={styles.item}>
            <h1 className={styles.title}>Orders</h1>
            <table className={styles.table}> 
                <thead>
                    <tr className={styles.trTitle}>
                        <th>Id</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {ordersList.map((order) =>(
                    <tbody key={order._id}>
                        <tr className={styles.trTitle}>
                            <td>
                                {order._id.slice(0,5)}...
                            </td>
                            <td>{order.customer}</td>
                            <td>${order.total}</td>
                            <td>
                                {order.method === 0 ? 
                                    (<span>cash</span>) : 
                                    (<span>paid</span>)}
                            </td>
                            <td>
                                {status[order.status]}
                            </td>
                            <td>
                                <button 
                                    className={styles.button}
                                    onClick={() => handleStatus(order._id)}
                                >
                                    Next stage
                                </button>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {

    const myCookie = ctx.req?.cookies || "";

    if (myCookie.token !== process.env.TOKEN) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    const productRes = await axios.get(`${BASE_URL}/api/products`);
    const orderRes = await axios.get(`${BASE_URL}/api/orders`);

    return {
        props:{
            orders:orderRes.data,
            products:productRes.data
        }
    }
}

export default Index
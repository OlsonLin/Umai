/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import PaymentDetails from './PaymentDetails';
import Shopping_bill from './ShoppingBill';
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from "../../../config/config";
import { useEffect, useState } from 'react';

function ShoppingList(props){
    //會員ID
    const { currentUser } = props;

    const location = useLocation();
    let data = JSON.parse(location.state.data);
    
    const [coursetitle,setcoursetitle]=useState(data.coursetitle)
    //let coursetitle = data.coursetitle;
    let coupon = data.coupon;
    let carddata = data.carddata;
    let OrdererData = data.OrderData;
    let creditCards = data.creditCards;
    let paymenttype = data.paymenttype;
    let receipttype = data.receipttype;

    async function getmembercount(){
        try {
            let result = await axios.get(`http://localhost:8080/api/course/${coursetitle.course_id}`, {
            withCredentials: true,
            });
            setcoursetitle({...coursetitle,membercount:result.data.course_batch[0].member_count})
        } catch (error) {
            console.log(error);
        }
    }

    async function insertorderdata(){
        const orderdata={
            memberid: currentUser.id,
            courseid: coursetitle.course_id,
            batchid: coursetitle.batch_id,
            firstName: OrdererData.firstName,
            lastName: OrdererData.lastName,
            telephone: OrdererData.telephone,
            birthday: OrdererData.birthday,
            email: OrdererData.email,
            paymenttype: paymenttype,
            receipttype: receipttype,
            ordersprice: coursetitle.value*coursetitle.studentnumber-Math.floor(coursetitle.value*coursetitle.studentnumber*(1-coupon.discount_percent/100))
        };
        try{
            let insert_order_data =await axios.post( API_URL + "/order/insertOrderData",orderdata,{ withCredentials: true });
        }catch(error){
            console.log(error.response.data);
        }
    }

    async function insertstudentdata(){
        carddata.map(async (data)=>{
            let studentdata={
                ...data,
                memberid:currentUser.id,
                courseid: coursetitle.course_id,
                batchid: coursetitle.batch_id
            }

            try{
                let inset_student_data =await axios.post( API_URL + "/order/insertStudentData",studentdata,{ withCredentials: true });
            }catch(error){
                console.log(error.response.data);
            }
        })
    } 
    
    async function modifymembercount(){
        let modifydata = {
            studentnumber:coursetitle.studentnumber,
            courseid: coursetitle.course_id,
            batchid: coursetitle.batch_id
        };
        try{
            let modify_membercount =await axios.put( API_URL + "/order/modifyMembercount",modifydata,{ withCredentials: true });
        }catch(error){
            console.log(error.response.data);
        }
    }
    async function modifycart(){
        try {
            let result = await axios.put(`http://localhost:8080/api/order/modifycart`,{ 
                memberid: currentUser.id, 
                courseid:coursetitle.course_id, 
                batchid:coursetitle.batch_id} ,{ withCredentials: true,});
          } catch (error) {
            console.log(error);
          }
    }

    useEffect(()=>{
    getmembercount()
    insertorderdata()
    insertstudentdata()
    modifymembercount()
    modifycart()
    },[])
    

    return(
        <>
        <div className="ShoppingBill-background">
            <div className="ShoppingBill-wrapper">
                <div className="ShoppingBill-title">
                    <h1>完成訂購</h1>
                </div>
                <hr/>
                <h3>消費帳單</h3>
                <Shopping_bill
                    coursetitle={coursetitle}
                    coupon={coupon}
                    carddata={carddata}
                    OrdererData={OrdererData}
                />
                <div className="ShoppingBill-payment-details">
                    <h3>付款明細</h3>
                    <PaymentDetails
                    OrdererData={OrdererData}
                    />
                </div>
            </div>
        </div>
        </>
    )
}
export default ShoppingList;
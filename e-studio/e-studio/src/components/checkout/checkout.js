import React ,{useState, useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, Elements, ElementsConsumer,useStripe, useElements} from '@stripe/react-stripe-js';
import axios from 'axios';
import { withRouter, useHistory } from "react-router-dom";
import { connect , useSelector , useDispatch} from 'react-redux';
import { getBasket , getLogin } from "../actions/getAction";
import { clearBasket } from "../actions/deleteAction";


import BillingDetailsFields from "./BillingDetailsFields";
import { Row } from 'react-bootstrap';
import { PayPalButton } from "react-paypal-button-v2";
// import '../styles/common.css';

const CheckoutForm = (props) => {

  const basketProps = useSelector(state =>
    state.basketState
    )
    const dispatch = useDispatch();
    let history = useHistory();

    // console.log(basketProps);
    
    // console.log(props.value.props); 

    const [promo, setPromo] = useState('');
    const [total,setTotal]= useState(basketProps.cartCost);
    const [goodCpromo,setGoodCpromo] = useState('');
    const [paymentLoading,setPaymentLoading] = useState(false);

    const [isProcessing, setProcessingTo] = useState(false);
    const [checkoutError, setCheckoutError] = useState();
    const [succes, setSucces] = useState(null);
    const [error, setError] = useState(null);

    
    const stripe = useStripe();
    const elements = useElements();

    const handleCardDetailsChange = ev => {
      // ev.error ? setCheckoutError(ev.error.message) : setCheckoutError();

    };

    const handleChange=(e)=>{
      var code = e.target.value;
      
      setPromo(code);
  
      // console.log(this.state.promo);
      
    }
    const checkCode =(e)=>{
  
      e.preventDefault();
      // console.log('kro');
  
      // var cost = this.props.basketProps.changeBasketCost;
      // console.log(cost);
      
      console.log({promo});
  
      var data = {promo:promo};
  
      axios.post('http://localhost:8080/promo/check',data,{headers: {'token':localStorage.getItem('token')}}).then((response)=>{
          if (response.status == 200) {
              var res = response.data ;
              console.log(res);
              if (res != "invalid code") {

                  var codeInfo = res.cpromo[0];
                  // console.log(codeInfo.code);
                  setSucces(codeInfo.code);
                  
                  setGoodCpromo(codeInfo.code);
                  if (codeInfo.pourcentage != null) {
                      var pourcentage = codeInfo.pourcentage;
                      pourcentageDeduct(basketProps.cartCost,pourcentage);
                      
                  }else{
                      var val = codeInfo.value;
                      valDeduct(basketProps.cartCost,val);
                  }
          
              }else{
                  console.log(res);
                  setError(res);
                  // this.alert(res);
              }
              
              
          }
      }).catch((error)=>{
        console.log(error.response.data.res);
        setError(error.response.data.res);
      })
      
  }
  
  const pourcentageDeduct = (cartCost,pourcentage)=>{
      // var cost = this.props.basketProps.cartCost;
      // var myTotal = {total};
      // console.log(cartCost)
      var myTotal = cartCost;

      var deduction = myTotal*pourcentage/100;
  
      var newTotal = Math.round(myTotal-deduction);
  
      console.log(newTotal);
      
      // this.props.changeBasketCost(newTotal);
  
      setTotal(newTotal);
  
  }
  
  const valDeduct = (cartCost,val)=>{
      // var cost = this.props.basketProps.cartCost;
      // var myTotal = {total};
      var myTotal = cartCost;

      var newTotal = myTotal - val;
  
      console.log(newTotal);
      
      // this.props.changeBasketCost(newTotal);
  
      setTotal(newTotal);
  }
  
    const handleSubmit = async (ev) => {
      // Block native form submission.
      if(paymentLoading){
        ev.preventDefault();
        console.log('BLOCKED')
        return;
      }
      
      setPaymentLoading(true);
      ev.preventDefault();

      // console.log(ev.target.name.value);
      
      const billingDetails = {
        name: ev.target.name.value,
        email: ev.target.email.value,
        address: {
          city: ev.target.city.value,
          line1: ev.target.address.value,
          postal_code: ev.target.zip.value
        }
      };

      
  
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.

      const cardElement = elements.getElement(CardElement);
      
  
      // Use your card Element with other Stripe.js APIs
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details :billingDetails
      });
  
      if (error) {
        console.log('[error]', error);
        setPaymentLoading(false);

      } else {
        console.log('[PaymentMethod]', paymentMethod);
        //getting Id from payementMethod Object
        // const data = {billing_details} = paymentMethod;
        // var total= props.value.props;
        // console.log(billingDetails);
        // var id;
        // var billing_details = billingDetails;
        // var card;

        const  {
            id,
            billing_details,
            card,
        } = paymentMethod

        // console.log(data);
        console.log({total});

        // let tt = {total}
        
            
            axios.post('http://localhost:8080/stripe/checkout',{id,billing_details, card , amount: total}).then(async (res)=>{
                console.log(res);

                if (res.status == 200) {
                    console.log('ok');  
                    // console.log(res.data[0].client_secret);
                    var clientSecret = res.data[0].client_secret
                    try {
                        stripe.confirmCardPayment( clientSecret, {
                            payment_method: id,
                          }).then(
                            (result)=>{
                                console.log(result);
                                if (result.error) {
                                    console.log(result.error.code);
                                    setPaymentLoading(false);
                                    
                                }else{
                                  basketProps['vraiTotal']= {total}
                                  basketProps['cpromo']= {goodCpromo}

                                  // let data ={basketProps};
                                    // CheckoutSuccess()
                                    console.log('nice');   
                                  axios.post('http://localhost:8080/reservation/payment/done',basketProps, {headers: {'token':localStorage.getItem('token')}}).then((response)=>{
                                      console.log(response);
                                      dispatch({ type: 'CLEAR_BASKET' });
                                      setPaymentLoading(false);
                                      history.push('/my-bookings');
                                  })

                                }
                            },
                          )
                        //   .catch((er)=>{
                        //       console.log(er);    
                        //   })
                        
                    } catch (error) {
                        console.log(error);
                        setPaymentLoading(false);
                        }
                };
                      
            })
      }
    };

    const cardElementOptions ={
       
        hidePostalCode: true
    }
        
    return ( 
      <div className="container-fluid overflow-hidden">
      <div className="row">
      {/* <p onClick={props.onSubmitClick}>Name: {props.auth.user}</p> */}
      <div className="col-6 left-side-checkout"></div>
      <div className="col-6 right-side" style={{ backgroundColor : 'white', fontSize: 18,padding : '30px',}}>
          <form onSubmit={handleSubmit} style ={{ width:400, margin: "0 auto"}}>
              <BillingDetailsFields/> 
        <h2> {total} €</h2>
        <div className="form-group">
          <label>
              Code Promo <br />
              <input onChange ={handleChange}></input>
              <button type = 'submit' 
              onClick={checkCode}
              className="btn btn-primary hero-banner-button mt-3" >
                Valider
              </button>
          </label>
        </div>
        <PayPalButton
        onClick={console.log({total}.total)}
        amount={ {total}.total }
         onSuccess={(details, data) => {
          // alert("Transaction completed by " + details.payer.name.given_name);
          basketProps['vraiTotal']= {total}
          basketProps['cpromo']= {goodCpromo}
          // let data ={basketProps};
            // CheckoutSuccess()
            console.log('nice');   
          axios.post('http://localhost:8080/reservation/payment/done',basketProps, {headers: {'token':localStorage.getItem('token')}}).then((response)=>{
              console.log(response);
              dispatch({ type: 'CLEAR_BASKET' });
              history.push('/my-bookings');

          })
        }}
        options={{
          currency:"EUR",
          disableFunding:"card",
          // shippingPreference:"NO_SHIPPING",
          clientId: "ATr5qjjQbC-B-E_0MfqdaDcGNUi1HwWXEkTGQp9ktzKfFH8f-JhnbBC6eMBFUwRq_uf0DCukggBQIhIB"
        }}
      />
            <CardElement options = {cardElementOptions}
            />
            { paymentLoading ? null : <button type="submit" disabled={!stripe} className="btn btn-primary hero-banner-button mt-3">
              Payer
            </button>}
          </form>
          { succes ? <div class="alert alert-success mt-3" role="alert">
                {succes}
            </div> : null}
            

            { error ? <div class="alert alert-danger mt-3" role="alert">
            {error}
            </div> : null }
          </div>
    </div>
    </div>
      
    );
  };

const InjectedCheckoutForm = (props) => {
    console.log(props);
  return (
    <ElementsConsumer>
      {({elements, stripe}) => (
        <CheckoutForm elements={elements} stripe={stripe} />
      )}
    </ElementsConsumer>
  );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

//pubic key//

const stripePromise = loadStripe('pk_test_51Gv9aXLbgko1nJUkmcvG1A4kinboDc5zyFJLioO4HqC7vZsyAbF0DfHysoODUQoDX5S9RZagpZ56FP6DeT7gbPLt00hIGfEbnu');

class Checkout extends React.Component {
    // console.log(props.location.state.response);
  constructor(props){
    super(props);

  }
    // componentDidMount(){
    //   getBasket()
    //   getLogin()
  
    //   console.log(this.props);
  
    // };
  render(){
   
    return (

      <Elements stripe={stripePromise} >
        <InjectedCheckoutForm/>
      </Elements>
    );

  }
 
};


// const mapStateToProps = state => ({
//   basketProps : state.basketState,
//   loginProps : state.auth,
//   // user: state.user,
// })

// connect(mapStateToProps, { getBasket, getLogin })(Checkout)

export default Checkout ;
;


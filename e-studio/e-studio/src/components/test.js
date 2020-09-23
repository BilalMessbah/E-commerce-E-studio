// import React from 'react';
// import {loadStripe} from '@stripe/stripe-js';
// import {CardElement, Elements, ElementsConsumer} from '@stripe/react-stripe-js';
// import axios from 'axios';




// class CheckoutForm extends React.Component {
//     handleSubmit = async (event) => {
//       // Block native form submission.    

//       event.preventDefault();
  
//       const {stripe, elements, props} = this.props;
  
//       console.log(this.props);
  
//       if (!stripe || !elements) {
//         // Stripe.js has not loaded yet. Make sure to disable
//         // form submission until Stripe.js has loaded.
//         return;
//       }
  
//       // Get a reference to a mounted CardElement. Elements knows how
//       // to find your CardElement because there can only ever be one of
//       // each type of element.
//       const cardElement = elements.getElement(CardElement);
  
//       const {error, paymentMethod} = await stripe.createPaymentMethod({
//         type: 'card',
//         card: cardElement,
//       });
  
//       if (error) {
//         console.log('[error]', error);
//       } else {
//           console.log('[PaymentMethod]', paymentMethod);
//           //getting Id from payementMethod Object
//           // const data = {billing_details} = paymentMethod;
  
//           var total= this.props.value.props;
//           // var total = 20
//           const  {
//               id ,
//               billing_details,
//               card,
//           } = paymentMethod
  
//           // console.log(data);
              
//               axios.post('http://localhost:8080/stripe/checkout',{id,billing_details, card , amount: total}).then(async (res)=>{
//                   console.log(res);
  
//                   if (res.status == 200) {
//                       console.log('ok');  
//                       // console.log(res.data.client_secret);
//                       var clientSecret = res.data.client_secret
//                       try {
//                           stripe.confirmCardPayment( clientSecret, {
//                               payment_method: id,
//                             }).then(
//                               (result)=>{
//                                   console.log(result);
//                                   if (result.error) {
//                                       console.log(result.error.code);

//                                   }else{  
//                                       // CheckoutSuccess()
//                                       console.log('nice');   
//                                   }
//                               },
//                             )
                          
//                       } catch (error) {
//                           console.log(error);
//                           }
//                   };
                        
//               })
//         }
//     };
  
   
//     render() {
//       const {stripe,props} = this.props;
//       // console.log(this.props.value.props);
  
//       return (
//         <div>
//             <form onSubmit={this.handleSubmit} style={{width:400, margin: "0 auto"}}>
//                 <h1>{this.props.value.props} €</h1>
//                 <CardElement
//                 options={{
//                     style: {
//                     base: {
//                         fontSize: '16px',
//                         color: '#424770',
//                         '::placeholder': {
//                         color: '#aab7c4',
//                         },
//                     },
//                     invalid: {
//                         color: '#9e2146',
//                     },
//                     },
//                     hidePostalCode: true
//                 }}
//                 />
//                 <button type="submit" disabled={!stripe}>
//                 Pay
//                 </button>
//                 <label>
//                     Code Promo
//                     <input onChange ={this.handleChange}></input>
//                     <button type = 'submit' 
//                     onClick={this.checkCode}
//                     className='' >valid
//                     </button>
//                 </label>
//                 <br/>
//             </form>
//         </div>
//       );
//     }
//   }
  
//   const InjectedCheckoutForm = (props) => {
//       // console.log(props);
//     return (
//       <ElementsConsumer>
//         {({elements, stripe}) => (
//           <CheckoutForm elements={elements} stripe={stripe} value={props} />
//         )}
//       </ElementsConsumer>
//     );
//   };

//   const stripePromise = loadStripe('pk_test_51Gv9aXLbgko1nJUkmcvG1A4kinboDc5zyFJLioO4HqC7vZsyAbF0DfHysoODUQoDX5S9RZagpZ56FP6DeT7gbPLt00hIGfEbnu');
//   const Checkout = (props) => {
//       // console.log(props.location.state.response);
//     return (
  
//       <Elements stripe={stripePromise} >
//         <InjectedCheckoutForm props={props.location.state.response}/>
//       </Elements>
//     );
//   };
  
//   export default Checkout;


import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, Elements, ElementsConsumer} from '@stripe/react-stripe-js';
import axios from 'axios';

import BillingDetailsFields from "./BillingDetailsFields";


class CheckoutForm extends React.Component {

  constructor(props){
    super(props)
    this.state = {
        total:this.props.value.props,
        promo:'',
        name:'',
        email:'',
        address:'',
        city:'',
        zip:'',

        // res : null,
    }

    // this.handleChange = this.handleChange.bind(this);

}
    handleSubmit = async (event) => {
      // Block native form submission.    

      event.preventDefault();
  
      const {stripe, elements, props} = this.props;

      console.log(elements);
      

      const billingDetails = {
        name: event.target.name.value,
        email: event.target.email.value,
        address: {
          city: event.target.city.value,
          line1: event.target.address.value,
          state: event.target.state.value,
          postal_code: event.target.zip.value
        }
      };

    //   console.log(billingDetails.name);
      

      
    //   const billing_details ={
    //     name:'',
    //     email:'',
    //     address:'',
        
    // }

      console.log(this.props);
  
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }
  
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      console.log(cardElement);
      
  
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

    
  
      if (error) {
        console.log('[error]', error);
      } else {
          console.log('[PaymentMethod]', paymentMethod);
          //getting Id from payementMethod Object
          // const data = {billing_details} = paymentMethod;
  
          var total= this.state.total;
          // var total = 20
          const  {
              id ,
              billing_details,
              card,
          } = paymentMethod
  
          // console.log(data);
              
              axios.post('http://localhost:8080/stripe/checkout',{id,billing_details, card , amount: total}).then(async (res)=>{
                  console.log(res);
  
                  if (res.status == 200) {
                      console.log('ok');  
                      // console.log(res.data.client_secret);
                      var clientSecret = res.data.client_secret
                      try {
                          stripe.confirmCardPayment( clientSecret, {
                              payment_method: id,
                            //   billing_dedails:'daniel',
                            }).then(
                              (result)=>{
                                  console.log(result);
                                  if (result.error) {
                                      console.log(result.error.code);

                                  }else{  
                                      // CheckoutSuccess()
                                      console.log('nice');   
                                  }
                              },
                            )
                          
                      } catch (error) {
                          console.log(error);
                          }
                  };
                        
              })

              
        }
    };

    handleChange=(e)=>{

        //   console.log(billingDetails.name);
      var code = e.target.value;
      var name = e.target.value;
      var email = e.target.value;
      var address = e.target.value;
      var city = e.target.value;
      var zip = e.target.value;


      console.log(name);
      
      this.setState({promo:code});

      this.setState({name:code});

      this.setState({email:email});

      this.setState({address:address});

      this.setState({city:city});

      this.setState({zip:zip});






      var billing_details ={
          email:'',
          name:'',
      }

      // console.log(this.state.promo);
      
    }
    checkCode =(e)=>{

      e.preventDefault();
      // console.log('kro');

      // var cost = this.props.basketProps.changeBasketCost;
      // console.log(cost);
      

      
      console.log(this.state.promo);

      var data = {promo:this.state.promo};

      axios.post('http://localhost:8080/promo/check',data).then((response)=>{
          if (response.status == 200) {
              var res = response.data ;
              // console.log(res);
              if (res != "invalid code") {
                  var codeInfo = res.cpromo[0];

                  if (codeInfo.pourcentage != null) {
                      var pourcentage = codeInfo.pourcentage; 
                      this.pourcentageDeduct(pourcentage);
                      
                  }else{
                      var val = codeInfo.value;
                      this.valDeduct(val);
                  }
          
              }else{
                  console.log(res);
                  // this.alert(res);
              }
              
              
          }
      })
      
  }

  pourcentageDeduct = (pourcentage)=>{
      // var cost = this.props.basketProps.cartCost;
      var total = this.state.total;

      var deduction = total*pourcentage/100;
      var newTotal = Math.round(total-deduction);

      // this.props.changeBasketCost(newTotal);

      this.setState({total:newTotal});

  }

  valDeduct = (val)=>{
      // var cost = this.props.basketProps.cartCost;
      var total = this.state.total;
      var newTotal = total - val;
      // this.props.changeBasketCost(newTotal);

      this.setState({total:newTotal});
  }
  
    render() {
      const {stripe,props} = this.props;
      // console.log(this.props.value.props);
  
      return (
        <div>
            <form onSubmit={this.handleSubmit} style={{width:400, margin: "0 auto"}}>
                <h1>{ this.state.total} €</h1>
                {/* <label>
                    email
                    <input onChange ={this.handleChange}></input>
                </label>
                <label>
                    name
                    <input onChange ={this.handleChange}></input>
                </label> */}
                {/* <label>
                    <input id="cardholder-name" type="text"/>
                    <div id="card-element"></div>
                    <div id="card-result"></div>
                    <button id="card-button">Save Card</button>
                </label> */}

                <BillingDetailsFields />


                {/* <label>
          Name
          <input
          onChange={this.handleChange}
            name="name"
            type="text"
            placeholder="Jane Doe"
            required
          />
        </label>
        
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="jane.doe@example.com"
            required/>
        </label>

        <label>
          Address
          <input
            name="address"
            type="text"
            placeholder="185 Berry St. Suite 550"
            required
           />

        </label>
        
        <label>
          City
            <input
            name="city"
            type="text"
            placeholder="San Francisco"
            required
            />
        </label>

        <label>
          Zip
          <input
          label="ZIP"
          type="text"
          placeholder="94103"
          required
           />

        </label> */}

                <label>
                    Code Promo
                    <input onChange ={this.handleChange}></input>
                    <button type = 'submit' 
                    onClick={this.checkCode}
                    className='' >valid
                    </button>
                </label>

                <CardElement
                options={{
                    style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                        color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                    },
                    hidePostalCode: true
                }}
                />
                <button type="submit" disabled={!stripe}>
                Pay
                </button>
                
            </form>
        </div>
      );
    }
  }
  
  const InjectedCheckoutForm = (props) => {
      // console.log(props);
    return (
      <ElementsConsumer>
        {({elements, stripe}) => (
          <CheckoutForm elements={elements} stripe={stripe} value={props} />
        )}
      </ElementsConsumer>
    );
  };

  const stripePromise = loadStripe('pk_test_51Gv9aXLbgko1nJUkmcvG1A4kinboDc5zyFJLioO4HqC7vZsyAbF0DfHysoODUQoDX5S9RZagpZ56FP6DeT7gbPLt00hIGfEbnu');
  const Checkout = (props) => {
      // console.log(props.location.state.response);
    return (
  
      <Elements stripe={stripePromise} >
        <InjectedCheckoutForm props={props.location.state.response}/>
      </Elements>
    );
  };
  
  export default Checkout;
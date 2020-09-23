import React , {Component } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import logo from './logo.png';
import background from './assets/img/homepage.jpg'
import './App.css';
import radio from './assets/img/icons/radio.png';
import pin from './assets/img/icons/pin.png';
import calendar from './assets/img/icons/calendar.png';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, matchPath, Switch, withRouter} from "react-router-dom";
import register from "./components/register";
import login from "./components/login";
import create from "./components/createStudio";
import index from './components/index';
import updateUser from './components/updateUser';
import updateUser2 from './components/updateUser2';

import AllStudio from './components/AllStudio';
import oneStudio from './components/Studio'
import Slide from './components/Slide'
import N from './components/Navbar';
import { Helmet } from 'react-helmet'
import Logout from './components/logout';
import Cart from './components/cart/cart';
import Checkout from './components/checkout/checkout';
import searchStudio from './components/searchStudio';

import { getLogin } from "./components/actions/getAction";
import { connect} from "react-redux";

import InvoiceStudio from './components/invoiceStudio';
import bookingList from './components/bookingList';
import factures from './components/factures';
import Monstudio from './components/Monstudio';
import Studiores from './components/Studiores';
// import FicheStudio from './components/search';


//Admin
import UpdateStudio from './components/updateStudio';
import DeleteUser from './components/deleteUser';
import ReactUser from './components/reactUser';
import Code from './components/code_promo';
import ClippedDrawer from './components/adminNew';
import AdminRouter from "./components/adminRouter";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
  return (
    <>
      <Router>
        {console.log(<Route />)}
      <div className="App">
        <Route path="/admin" component={AdminRouter}/>
        <N />
        <Route  path="/invoice" exact component={InvoiceStudio}/>
        <Route  path="/logout" exact component={Logout}/>
        <Route path="/register" exact component={register} />
        <Route path="/login" exact component={login} />
        <Route path="/create" exact component={create} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/search" exact component={searchStudio} />
        <Route path="/" exact component={index} />
        <Route path="/update" exact component={updateUser2} />
        <Route path="/studio" exact component={AllStudio} />
        <Route path="/studio/:id" exact component={oneStudio} />
        <Route path="/slide" exact component={Slide} />
        <Route path= "/checkout" exact component={Checkout}/>
        <Route path="/my-bookings" exact component={bookingList} />
        <Route path="/factures" exact component={factures} />
        <Route path="/monstudio" exact component={Monstudio} />
        <Route path="/monstudio/:id" component={Studiores} />

        {/* <Route path="/delete" exact component={DeleteUser} />
        <Route path="/get_code" exact component={DeleteUser} />
        <Route path="/update_studio" exact component={UpdateStudio} />
        <Route path="/react_user" exact component={ReactUser} />
        <Route path="/code_promo" exact component={Code} /> */}
        {/* <Route path="/admin2" exact component={ClippedDrawer} /> */}


      </div>
    </Router>
    </>
  );
  }
}

const mapStateToProps = state => ({
  loginProps : state.auth,
})

export default connect(mapStateToProps, { getLogin })(App);

import * as React from 'react';
import logo from '../E_STUDIO1.png';
import logo2 from '../estuduio2.png';

import '../App.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Redirect , withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import { getBasket , getLogin } from "./actions/getAction";
import { removeOneBasket , logout} from "./actions/deleteAction";
import axios from 'axios';

class N extends React.Component{

    constructor(props){
        super(props)
        this.state =  {
            logged: false,
            has_studio : false,
            isCpromo :null,
        }
    }

    componentDidMount(){
        getBasket();
        getLogin();
        this.getpromo();
        this.check_has_studio();
        console.log(this.props)
        // if(localStorage.getItem('token')){
        //     this.setState({logged: true})
        //     this.yo()
        // }
        // else {
        //     this.yo()
        // }
        this.yo();
        
    }
    getpromo = () => {
        const dis = this;
        axios.get('http://localhost:8080/promo/ajd', {
        }).then(function (response) {
            dis.setState({isCpromo: response.data[0].code})
        }).catch(function (error) {
                console.log(error);
        });
    }
    check_has_studio = () => {
        axios.get("http://localhost:8080/hasstudio", {headers: { "token": this.props.loginProps.token }}).then(response => {
            console.log(response.data)
            if(response.data.succes == true){
                this.setState({ has_studio : true});
            } else {
                this.setState({ has_studio : false});
            }
        })
    }

    LOGOUT = () => {
        console.log('loginout')
        this.props.logout();
        // console.log(this.props.history)
        this.props.history.push('/login');
        // return (<Redirect to={{pathname: "/login"}} />);
    }

    yo = () => {
        if(this.props.loginProps.loggedin == true){
            return(
            <Nav>
                <NavDropdown title="Mon Compte" className="homepage-text" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/update">Mise a jour</NavDropdown.Item>
                    <NavDropdown.Item href="/my-bookings">Mes Reservations</NavDropdown.Item>
                    <NavDropdown.Item href="/factures">Mes Factures</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => this.LOGOUT()}>Déconnexion</NavDropdown.Item>
                    {/* <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
                    <NavDropdown.Divider />
                    {/* <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                </NavDropdown>
            </Nav>
            )
        }
        else {
            return(
                        
                <Nav> 
                       <Nav.Link className="homepage-text" href="/login">Connexion</Nav.Link>
                       <Nav.Link className="homepage-text register" eventKey={2} href="/register">Inscription</Nav.Link>
                   </Nav> 
            )
        }
    }

    logout = () => {
        
        localStorage.removeItem("token")
        return(
            <Redirect to="/"></Redirect>
        )
    }

      render(){
        
return( 
            <Navbar className="laNav" sticky="top">
                <Navbar.Brand className="homepage-text" href="/">
                    <img
                    alt=""
                    src={logo2}
                    width="175"
                    height="5%"
                    className="img-responsive d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {this.props.loginProps.loggedin  ? <Nav.Link className="homepage-text" href="/create">Ajouter un studio</Nav.Link> : null}
                    <Nav.Link className="homepage-text" href="/studio">Tous les studios</Nav.Link>
                </Nav>
                <div style={{backgroundColor : "#02c39a", margin : "auto" ,textAlign : "center"}}>
                        { this.state.isCpromo !== null ? <><p> Ce code promo est disponible aujourd'hui:</p><h3>{this.state.isCpromo}</h3></> : null}
                    </div>
                {this.props.loginProps.loggedin && this.props.loginProps.role == "admin" ? <Nav.Link className="homepage-text" href="/admin">Panel admin</Nav.Link> : null}
                {this.props.loginProps.loggedin && this.state.has_studio ? <Nav.Link className="homepage-text" href="/monstudio">Mes studios</Nav.Link> : null}
                <Nav>
                    <NavDropdown title={'Mon panier ' + `(${this.props.basketProps.basketNumbers})`}  className="homepage-text cart-menu" id="collasible-nav-dropdown">
                        <ul className="list-item">
                            {this.props.basketProps.products.length > 0 ? this.props.basketProps.products.map( e => 
                                <li>{ e.name} De {e.hours[0]} a {e.hours[1]} Le {e.dateaff} <button onClick={() => this.props.removeOneBasket(e.id)}>X</button></li>
                            ) : <li>Vous n'avez rien dans votre panier</li> }
                        </ul>
                        <NavDropdown.Item className="hero-banner-button cart-button" href="/cart">Passer la commande ( {this.props.basketProps.cartCost} euros)</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                {this.yo()}
                </Navbar.Collapse>
                </Navbar>
    )
        }
}


const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,
    // user: state.user,
})

export default withRouter(connect(mapStateToProps, { getBasket, removeOneBasket , getLogin , logout})(N));
  

import React, { useState, useEffect, Component, Button, Header } from 'react';
import { Link , Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios';


import { connect } from 'react-redux';
import { getBasket , changeBasketCost, getLogin} from "../actions/getAction";
import login from '../login';
import { Alert } from 'react-bootstrap';
import Checkout from '../checkout/checkout';

class Cart extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            total:null,
            promo:'',
            show: false,
            // res : null,
            loggedin : false,
            email : null,
            nom : null,
            prenom : null,
        }

        // this.handleChange = this.handleChange.bind(this);

    }

    handleInputChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
    };
    
    componentDidMount(){
        console.log(this.props.basketProps);
        // var prix = [];

        var cost = this.props.basketProps.cartCost;

        // console.log(cost);

        this.setState({total:cost})

        // this.handleClose();
        // this.handleShow()
    
    }

    handleClose = () => {
        this.setState({show:false})
    };

    handleShow = () => {
        this.setState({show:true})
    };

    

    checkout=()=> {

        let bk = this.props.basketProps.cartCost

        this.props.history.push("/checkout", { response: bk })
    }

    checkout2 = () => {
        if(this.state.nom !== null && this.state.email !== null && this.state.prenom !== null){
            console.log('ok')
        } else {
            //veuillez remplir les champs
        }
    }

    form = () => {
        return(
            <>
                <div className="form-group">
                    <label>Nom</label>
                    <input type="text"
                        name = "nom"
                        className="form-control"
                        placeholder="Entrer un nom"
                        required
                        onChange={(e)=> this.handleInputChange(e)}></input>
                </div>
                <div className="form-group">
                    <label>Prenon</label>
                    <input type="text"
                        name = "prenom"
                        className="form-control"
                        placeholder="Entrer un prenom"
                        required
                        onChange={(e)=> this.handleInputChange(e)}></input>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email"
                        name = "email"
                        className="form-control"
                        placeholder="Entrer un email"
                        required
                        onChange={(e)=> this.handleInputChange(e)}></input>
                </div>
                <Link onClick={this.checkout2}>
                    <button type="submit"
                        className="btn btn-primary hero-banner-button">Accepter et continuer</button>
                </Link>
                </>
        )
    }
    
    buyNow=()=>{
        
    }
  
    render()
    {
        
        const isProduct = this.props.basketProps.products.length > 0;
        let ul;
        if (isProduct) {
             ul = <div > 
                    <ul>
                        {this.props.basketProps.products.map( e => 
                            <li style={{listStyle: "none", color: "white"}}>{ e.name} De {e.hours[0]} a {e.hours[1]}</li>)}
                    </ul>
               
                <br/>
                {/* <button type = 'submit' 
                onClick={this.checkout}
                className='' >CHECKOUT
                </button>
                <br/>
                <button type = 'submit' 
                onClick={this.handleShow}
                className='' > BUY NOW
                </button> */}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
                { this.props.loginProps.loggedin ?<button type = 'submit' 
                onClick={this.checkout}
                style={{ backgroundColor: "white", border: "none"}}
                className='' >Valider mon panier</button> : <Link to="/login">Veuillez vous connecter pour payer</Link>}
                

            </div>
        }else{
             ul = <li style={{listStyle: "none"}}>
                    Vous n'avez rien dans votre panier
            </li>
        }
        
        return(
            <div style={{ backgroundColor : '#02c39a', fontSize: 25,padding : '30px', height: '100%'}}>
            <div className="container" style={{ backgroundColor : '#02c39a'}}>
                <div className="row">
                <div className="col-5"> 
                <div  style={{ padding:"26px 30px 16px" }}>
                    <h2 style={{ color: 'white', fontWeight: '600', letterSpacing: '2.5px', fontSize: '22px'}}>MON PANIER</h2>
                </div>
                <div>
                    {ul}
                </div>
                <div>
                    <p className = "mt-2"> Total: {this.props.basketProps.cartCost} €</p>
                    {/* <p> Total : {this.state.total} </p> */}
                </div>
                
                {/* {this.alert(res)}; */}
            </div>
            </div>
            </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,

})

export default connect(mapStateToProps, { getBasket , changeBasketCost, getLogin})(Cart)




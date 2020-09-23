import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getBasket , getLogin } from "./actions/getAction";
import { removeOneBasket , logout} from "./actions/deleteAction";
import Rating from '@material-ui/lab/Rating';
import jsPDF from 'jspdf';
import logo from '../logo.png';
import moment from 'moment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SvgIcon from '@material-ui/core/SvgIcon';

class bookingList extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            data: null,
            bool: false,
            avis : null,
            rating : 5,
            hover : -1,
        }
        
    }

    getBooking =  () => {
        axios.get("http://localhost:8080/factures", {headers: { "token": this.props.loginProps.token }}).then(response => {
            console.log(response.data);
            this.setState({data: response.data})
        // console.log(this.state.data)
            this.display()
    })
        
    }

    avis = (id) => {
        console.log(this.state.rating,this.state.avis);
        if(this.state.avis !== null && this.state.rating !== null ){
            let data = {
                commentaire : this.state.avis,
                note : this.state.rating,
                studio_id : id,
            }
            axios.post('http://localhost:8080/avis/create', data, {headers: { "token": localStorage.getItem("token") }}).then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    componentDidMount(){
        this.getBooking()
    }
    handleInputChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
    };

    display = () => {
            return(
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-6 left-side-checkout"></div>
                    <div className="col-6 text-center d-flex align-items-center flex-column">
                    {this.state.data.map((studio) => {
                        let cart =  JSON.parse(studio.cart);
                        return (cart.map((e) => {
                            console.log(e)
                            return (<div class="card">
                                    <img class="card-img-top" src="holder.js/100x180/" alt="" />
                                    <div class="card-body">
                                        <h4 class="card-title">{e.name}</h4> {moment() > moment(e.datestock) ? <CheckCircleIcon style={{ color: "green" }}/> : null}
                                        <p class="card-text">{e.dateaff}</p>
                                        <img className="image_one_studio my-3" src={e.studio_img}></img>
                                        {/* <button onClick={() => this.generatePDF(studio.id, studio.day, studio.start, studio.finish, studio.price, studio.studio_name)}>Facture</button> */}
                                        <p className="py-3">de {e.hours[0]} a {e.hours[1]}</p>
                                        { moment() > moment(e.datestock) ? 
                                            <div>
                                                <h3 className="my-3">Laisser un avis</h3>
                                                <input name="avis" onChange={this.handleInputChange}></input>
                                                <Rating
                                                    name="hover-feedback"
                                                    value={this.state.rating}
                                                    precision={1}
                                                    onChange={(event, newValue) => {
                                                    this.setState({rating : newValue});
                                                    }}
                                                    onChangeActive={(event, newHover) => {
                                                        this.setState({hover : newHover});
                                                    }}
                                                />
                                                <button onClick={()=> this.avis(e.studioid)}>Ajouter un avis</button>
                                            </div> 
                                            : <p className="py-3">A venir</p>}
                                        {/* <p className="py-3">{e.dateaff}</p> */}
                                    </div> 
                                </div>)
                        }))
                    }
                    )}
                    </div>
                    </div>
                    </div>
            )
    }

    render(){
        return(
            <>
                {this.state.data !== null ? this.display() : null}
            </>
        )
    }
    
}


const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,
})

export default connect(mapStateToProps, { getBasket, removeOneBasket , getLogin , logout})(bookingList);
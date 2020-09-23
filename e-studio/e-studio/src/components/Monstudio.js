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

class Monstudio extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            data: null,
            bool: false,
            avis : null,
            rating : 5,
            hover : -1,
            studios : [],
        }
        
    }

    check_has_studio = () => {
        axios.get("http://localhost:8080/hasstudio", {headers: { "token": this.props.loginProps.token }}).then(response => {
            console.log(response.data)

            if(response.data.succes == true){
                this.setState({ has_studio : true});
            } else {
                this.setState({ has_studio : false});
            }
            this.setState({ studios : response.data.studios})
        })
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
        // this.getBooking()
        this.check_has_studio();
    }
    handleInputChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
    };

    render()
    {
        return(
            <div className="container-fluid">
                <div class="row">
                <div className="col-6 d-flex flex-column align-items-center">
            {this.state.studios.length > 0 ? this.state.studios.map((studio) => {
                console.log(studio)
                {
                return(
                <div className="studio">
                    {   
                        <div className="el_studio mb-5">
                            <img src={studio.images[0] === undefined ? "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png" : studio.images[0].url_image }></img>
                            <Link params={{ studio: studio.id }} to={"monstudio/"+studio.id}>{studio.name}</Link>
                            <p>{studio.prix}€/h</p>
                        </div>
                    }
                </div>
                )
            }
            }) : null }
            </div>
            <div className="col-6 allstudio">

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

export default connect(mapStateToProps, { getBasket, removeOneBasket , getLogin , logout})(Monstudio);
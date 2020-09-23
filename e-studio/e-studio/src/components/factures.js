import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getBasket , getLogin } from "./actions/getAction";
import { removeOneBasket , logout} from "./actions/deleteAction";
import jsPDF from 'jspdf';
import logo from '../logo.png';
import moment from 'moment'
import 'moment/locale/fr';
class bookingList extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            data: null,
            bool: false,
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

    componentDidMount(){
        this.getBooking()
    }

    generatePDF = (id,cart,total) => {

        cart = JSON.parse(cart);
        console.log(cart);

         var doc = new jsPDF('p', 'pt');
        
        doc.addImage(logo, 'PNG', 170, 50, )

        doc.setFont('helvetica')
        doc.setFontType('small')
        doc.text(15, 200, 'Nom du studio')
        
        doc.text(150, 200, "Jour")
        doc.text(250, 200, "Heure de debut")  

        doc.text(350, 200, "Heure de fin")  

        doc.text(450, 200, "Somme payée")
        doc.text(10, 202, "________________________________________________________________________________________________________________")

        let coord = 230;

        cart.map((e,key) => {
        console.log(key)
        

        let nom = e.name;
        let jour = e.dateaff;
        let debut = e.hours[0];
        let fin = e.hours[1];
        let prix = (+e.prix+e.prixservices) * e.nbrhour;
            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            // doc.text(15, 200, 'Nom du studio')
            
            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            doc.text(15, coord, nom.toString())      

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            // doc.text(15, coord, "Jour")  

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            doc.text(150, coord, jour.toString())   

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            // doc.text(15, 400, "Heure de debut")  

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            doc.text(250, coord, debut.toString())

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            // doc.text(15, 500, "Heure de fin")  

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            doc.text(350, coord, fin.toString())
            



            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            // doc.text(15, 600, "Somme payée")  

            // doc.setFont('helvetica')
            // doc.setFontType('normal')
            doc.text(450, coord, prix.toString() + " €")
            doc.text(10, coord + 25, "________________________________________________________________________________________________________________")
            coord += 50; 
        })

        doc.text(10, coord + 85, "________________________________________________________________________________________________________________")

        doc.text(450, coord + 110, "Total")
        doc.text(450, coord + 140, total.toString() + " €")

        doc.save('facture-' + id + '.pdf')
        
    }
    
    
    display = () => {
            return(
                <div className="container">
                    <div className="row">
                    <div className="col-12 text-center d-flex align-items-center flex-column">
                    {this.state.data.map(studio => 
                        <div class="card">
                            <img class="card-img-top" src="holder.js/100x180/" alt="" />
                            <div class="card-body">
                                <h4 class="card-title">Payer le {    moment(studio.created_at).format('DD/MM/YYYY')}  Prix : {studio.total} €</h4>
                                <button onClick={() => this.generatePDF(studio.id,studio.cart,studio.total)}>Telecharger la facture</button>
                                <p className="py-3">{studio.studio_name}</p>
                            </div> 
                        </div>
                    )}
                    </div>
                    </div>
                    </div>
            )
    }

    render(){
        return(
            <div>
                {this.state.data !== null ? this.display() : null}
            </div>
        )
    }
    
}


const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,
})

export default connect(mapStateToProps, { getBasket, removeOneBasket , getLogin , logout})(bookingList);
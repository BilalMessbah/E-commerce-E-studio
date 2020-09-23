import React, { Component } from 'react';
import jsPDF from 'jspdf';
import logo from '../logo.png';



export default class InvoiceStudio extends Component {
    constructor(props) {
        super(props)
        this.state ={}
    };

    generatePDF = () => {
        var doc = new jsPDF('p', 'pt');
        
        doc.addImage(logo, 'PNG', 170, 50, )
        
        doc.setFont('helvetica')
        doc.setFontType('normal')
        doc.text(20, 200, 'This is the second title.')
        
        doc.setFont('helvetica')
        doc.setFontType('normal')
        doc.text(20, 230, 'This is the thiRd title.')      
        
        doc.save('facture.pdf')
    }

    

    render() {
        return (
           <div>
              <button onClick={this.generatePDF} type="primary">Télécharger Facture</button> 
           </div>
        );
     }
}
import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class searchStudio extends Component {


    constructor(props){
        super(props)

        this.state = {
            date: this.props.location.state.date,
            address: this.props.location.state.address
        }

    }
    componentDidMount(){
        
    }

    render(){
        return(
            <div>
                {this.state.address} - {this.state.date}
            </div>
        )
    }
}
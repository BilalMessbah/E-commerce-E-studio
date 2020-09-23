import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

class DeleteStudio extends Component {
    constructor(props) {
        super(props)
        this.state = {
            autocomplete : [],
            autovalue : null,
        }
    }

    addletter = (event, id = null) => {

        this.setState({
            autovalue: event.target.value,
            id: id,
            autocomplete: []
        });
        console.log(id);
    }

    Autocomplete_value = (props) => {
        const listItems = props.Autocomplete_value.map((value) => <button value={value.name} onClick={event => { this.addletter(event, value.id) }} type="button" class="btn btn-secondary teee">{value.name}</button>);
        return (<div> {listItems}</div>);
    }

    autocomplete = (event) => {
        this.setState({
            autovalue: event.target.value,
            autocomplete: []
        })
        var array = [];
        const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ "value": event.target.value }) };
        if (event.target.value != "")
            fetch(' http://127.0.0.1:8080/autocomplete', requestOptions).then(response => response.json()).then(data => {
                Object.keys(data.studios).map(function (key, index) { array.push(data.studios[key]); });
                this.setState({ autocomplete: array });
            });
    }

    validate = (e) => {
        console.log(this.state.id);
            var requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json', "token": localStorage.getItem("token")}  };
            fetch(`http://localhost:8080/delete_studio/${this.state.id}`, requestOptions).then(response => response.json()).then(data => {
                document.getElementById("success").textContent = 'Studio '+this.state.autovalue+' supprimer avec succes';
                console.log(data);
            }).catch(function (error) {
                console.log(error);
            });
    };

    render () {
    return (
        <div className="body">
            <div className="container">
                <div className="card text-center" style={{ display: 'contents' }}>
                    <div className="card-body">
                        <h1>Supprimer un Studio</h1>
                        <label>Nom du studio: </label>
                        <div>
                            <label for="checkIn">Chercher par mot clé</label>
                            <input autocomplete="off" value={this.state.autovalue} onChange={(event) => this.autocomplete(event)} placeholder="Nom" class="form-control" id="checkIn" name="checkin-date"></input>
                            <this.Autocomplete_value Autocomplete_value={this.state.autocomplete} />
                        </div>
                        <div className="form-group" id="success">

                        </div>
                        <button type="submit"
                            onClick={this.validate}
                            className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
    }
}
export default DeleteStudio;
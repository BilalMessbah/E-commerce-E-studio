import React, { useState, Component } from 'react';
import axios from 'axios';
import { getBasket , getLogin } from "./actions/getAction";
import { connect } from "react-redux";
class UpdateUser2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lastname: null,
            firstname: null,
            email: null,
            password: null,
            autocomplete : [],
            autovalue : null,
        }
    }
    componentDidMount(){
        getLogin();
        console.log(this.props)
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

    autocomplete(event) {
        this.setState({
            autovalue: event.target.value,
            autocomplete: []
        })
        var array = [];
        const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ "value": event.target.value }) };

        if (event.target.value != "")
            fetch('http://127.0.0.1:8080/autocomplete_user', requestOptions).then(response => response.json()).then(data => {
                Object.keys(data.users).map(function (key, index) { array.push(data.users[key]); });
                this.setState({ autocomplete: array });
            });
    }

    validate = (e) => {
        // axios.get('http://localhost:8080/show', { headers: { "token": localStorage.getItem("token"), "select_value": userModif } }).then(function (response) {
        //     console.log(response);
        //     console.log(response.data.succes.id);
        //     var body = {
        //         "email": email,
        //         "password": password,
        //         "prenom": firstname,
        //         "nom": lastname,
        //         'id': response.data.succes.id,
        //     }
            var requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json', "token": localStorage.getItem("token") }, 
            body: JSON.stringify({ "token": localStorage.getItem("token"),"email": this.state.email,"password": this.state.password,"prenom": this.state.firstname, "nom": this.state.lastname,'id': this.props.loginProps.id}) };
            fetch('http://localhost:8080/update_user', requestOptions).then(response => response.json()).then(data => {
                document.getElementById("success").textContent = 'Utilisateur '+this.state.lastname+' modifier avec succes';
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
                        <h1>Modifier un Utilisateur</h1>
                        {/* <div>
                                <label for="checkIn">Chercher par mot clé</label>
                                <input autocomplete="off" value={this.state.autovalue}  onChange={(event) => this.autocomplete(event)} placeholder="Nom" class="form-control" id="checkIn" name="checkin-date"></input>
                                    <this.Autocomplete_value Autocomplete_value={this.state.autocomplete}/>
                            </div> */}
                        <div className="form-group">
                            <label>Nom :</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Nom"
                                required
                                onChange={(event) => this.setState({lastname: event.target.value})}></input>
                        </div>
                        <div className="form-group">
                            <label>Prenom :</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Prenom"
                                required
                                onChange={(event) => this.setState({firstname: event.target.value})}></input>
                        </div>
                        <div className="form-group">
                            <label>Email: </label>
                            <input type="email"
                                className="form-control"
                                placeholder="Email"
                                required
                                onChange={(event) => this.setState({email: event.target.value})}></input>
                        </div>

                        <div className="form-group">
                            <label>Password :</label>
                            <input type="password"
                                className="form-control"
                                placeholder="Password"
                                required
                                onChange={(event) => this.setState({password: event.target.value})}></input>
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

const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,
    // user: state.user,
})

export default connect(mapStateToProps, { getLogin })(UpdateUser2);

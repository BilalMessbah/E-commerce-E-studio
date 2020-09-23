import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';

const ReactUser = (props) => {
   
    const [email, setEmail] = useState('');
 

    const validate = (e) => {
        axios.get('http://localhost:8080/show', { headers: { "token": localStorage.getItem("token"), "select_value": email } }).then(function (response) {
            console.log(response);
            console.log(response.data.succes.id);
            var requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json', "token": localStorage.getItem("token"),"select_value": email,'id': response.data.succes.id }};
            fetch('http://localhost:8080/reactivated_user', requestOptions).then(response => response.json()).then(data => {
                document.getElementById("success").textContent = 'Utilisateur '+email+' réactiver avec succes';
                console.log(data);
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        });
    };

        return (
            <div className="body">
                <div className="container">
                    <div className="card text-center" style={{ display: 'contents' }}>
                        <div className="card-body">
                            <h1>Réactiver un compte</h1>
                            <div className="form-group">
                                <label>Email: </label>
                                <input type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    required
                                    onChange={(event) => setEmail(event.target.value)}></input>
                            </div>
                            <div className="form-group" id="success">

                        </div>
                            <button type="submit"
                                onClick={validate}
                                className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    export default ReactUser;

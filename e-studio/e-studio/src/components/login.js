import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
  } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import '../../src/css_login_register.css';
import { login } from './actions/addAction';
import FacebookLogin from "react-facebook-login";


const Login = (props) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [succes, setSucces] = useState(null);
    const [error, setError] = useState(null);
    var data = {
        email: email,
        password: password,
    }
    
    const validate = () => {
        console.log(data);
        axios.post('http://localhost:8080/login', data).then(function (response) {
            if (response.status === 200) {
                console.log(response.data);
                props.login(response.data.user[0])
                console.log(response.data.user[0]);
                localStorage.setItem("token", response.data.user[0].token)
                // props.login(response.data.user[0]);
                setSucces("Vous etes bien login")
                props.history.push({
                    pathname: '/',
                    state: { detail: true }})
            }
        })
            .catch(function (error) {
                console.log(error.response);
                setError(error.response.data.error)
            });
    };
    const responseFacebook = response => {
        // console.log(response);
        console.log(response);

        var res = response.name.split(" ");
        var data = {
            email: response.email,
            firstname: res[0],
            name: res[1],
            facebook_id : response.id,
        }
            axios.post('http://localhost:8080/create_account_facebook', data).then(function (response) {
                if(response.status == 200){
                    setSucces("Vous etes bien login")
                    props.login(response.data.user[0])
                    localStorage.setItem("token", response.data.user[0].token)

                    props.history.push({
                         pathname: '/',
                         state: { detail: true }})
                }
            }).catch(function (error) {
                    console.log(error);
                    setError(error.response.data.error)

            });
      };
     const componentClicked = () => console.log("clicked");

    return (
        <div className="container-fluid">
            <div className="row">
            {/* <p onClick={props.onSubmitClick}>Name: {props.auth.user}</p> */}
            <div className="col-6 left-side"></div>
            <div className="col-6 right-side">
            <div className="card text-center">
                <div className="card-body">
                    <h1 className="mb-4">Connexion</h1>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Entrer votre adresse e-mail"
                            required
                            onChange={(event) => setEmail(event.target.value)}></input>
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password"
                            className="form-control"
                            placeholder="Entrer votre mot de passe"
                            required
                            onChange={(event) => setPassword(event.target.value)}></input>
                    </div>
                    {/* <Link> */}
                        <button type="submit"
                            onClick={validate}
                            className="btn btn-primary hero-banner-button">Se connecter
                        </button>
                        <div  className="mt-4">
                            <FacebookLogin
                                appId="405862630301327"
                                autoLoad={false}
                                fields="name,email,picture"
                                onClick={componentClicked}
                                callback={responseFacebook}
                            />
                        </div>
                    {/* </Link> */}
                    {/* <button><a href="/create">Crée une annonce</a></button> */}
                    { succes ? <div class="alert alert-success mt-3" role="alert">
                    {succes}
                    </div> : null}
                    

                    { error ? <div class="alert alert-danger mt-3" role="alert">
                    {error}
                    </div> : null }
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}

// function mapStateToProps(state){
//     console.log('mapStateToProps', state)
//     return {
//         auth: state.auth
//     }
// }

function change (res){
    return res;
}

// function mapDispatchToProps(dispatch){
//     return {
//         onSubmitClick: (res) => 
//         {   
//             const email = res.email
//             const action = { type: 'SUBMIT', email: res.email, nom: res.nom, prenom: res.prenom, token: res.token }
//             dispatch(action)
//         }
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default connect(null, { login })(Login);

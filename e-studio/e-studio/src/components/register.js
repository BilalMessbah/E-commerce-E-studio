import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getBasket , getLogin } from "./actions/getAction";
import FacebookLogin from "react-facebook-login";
import { login } from './actions/addAction';
const Register = (props) => {

    if(props.loginProps.loggedin){
        props.history.push("/update");
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [radio, setRadio] = useState('');
    const [succes, setSucces] = useState(null);
    const [error, setError] = useState(null);


    var data = {
        email: email,
        password: password,
        firstname: firstname,
        name: lastname,
        role: radio,
    }

    const validate = (e) => {
        axios.post('http://localhost:8080/create_account', data).then(function (response) {
            if(response.status == 200){
                console.log(response)
                setSucces("Vous etes bien inscrit")
                // alert("Vous etes bien inscrit")
                props.history.push('/login')
            }
        }).catch(function (error) {
                console.log(error.response);
                let err = "";
                console.log(error.response.data.error);
                switch(error.response.data.error){
                    case "The email field is required.":
                        err = "Le champs email est requis";
                        break;
                    case "The name field is required.":
                        err = "Le champs nom est requis";
                        break;
                    case "The firstname field is required.":
                        err = "Le champs prenom est requis";
                        break;
                    case "The password field is required.":
                        err = "Le champs password est requis";
                        break;
                    case "The email has already been taken.":
                        err = "Cet email a deja ete pris";
                        break;
                    default:
                        err = "Quelque chose s'est mal passe";
                        break;

                }
                setError(err)
            });
    };
    const componentClicked = () => console.log("clicked");

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
                        props.login(response.data.user[0])
                        localStorage.setItem("token", response.data.user[0].token)
                        setSucces("Vous etes bien inscrit");
                        props.history.push({
                             pathname: '/',
                             state: { detail: true }})
                    }
                }).catch(function (error) {
                        console.log(error);
                });
            // this.setState({
            //   userID: response.userID,
            //   name: response.name,
            //   email: response.email,
            //   picture: response.picture.data.url
            // });
          };
    
    return (
        <div className="container-fluid">
            <div className="row">
            <div className="col-6 left-side"></div>
            <div className="col-6 right-side">
            <div className="card text-center">
                <div className="card-body">
                    <h1>S'inscrire</h1>
                    <div className="form-group">
                        <label>Nom</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Entrer un nom"
                            required
                            onChange={(event) => setLastname(event.target.value)}></input>
                    </div>
                    <div className="form-group">
                        <label>Prenom</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Entrer un prenom"
                            required
                            onChange={(event) => setFirstname(event.target.value)}></input>
                    </div>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email"
                            className="form-control"
                            placeholder="Entrer une adresse e-mail"
                            required
                            onChange={(event) => setEmail(event.target.value)}></input>
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password"
                            className="form-control"
                            placeholder="Entrer un mot de passe"
                            required
                            onChange={(event) => setPassword(event.target.value)}></input>
                    </div>
                    <Link onClick={validate}>
                        <button type="submit"
                            className="btn btn-primary hero-banner-button">Accepter et continuer</button>
                    </Link>
                </div>
                <FacebookLogin
                    appId="405862630301327"
                    autoLoad={false}
                    fields="name,email,picture"
                    onClick={componentClicked}
                    callback={responseFacebook}
                />

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
    )
}

const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,
    // user: state.user,
})
// export default Register;
export default connect(mapStateToProps, { getLogin,login})(Register);


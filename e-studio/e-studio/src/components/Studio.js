import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MarkersOnMap from 'markers-on-map-react';
import Geocode from "react-geocode";
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'
import 'moment/locale/fr';
import { connect } from "react-redux";
import { addBasket } from "./actions/addAction";
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';
import { parse } from '@babel/core';
import Rating from '@material-ui/lab/Rating';
class oneStudio extends Component {

    constructor(props){
        super(props)
        this.state = {
            d: [],
            u: [],
            t:false,
            id: this.props.match.params.id,
            longitude: null,
            latitude: null,
            api: "AIzaSyDguFqu_sl5qbBxhci9X_lEzqt5dlumocM",
            date: null,
            personnes: 1,
            open: null,
            close: null,
            valid: false,
            array: [],
            heuredisplay :'none',
            studio: null,
            services : [],
            error: null,
            hour_selected: null,
            hour_selected_2:null,
            valid_2: null,
            all_field: false,
            disabled: "",
            currservices : null,
            array_2: [],
            note : 5,
            visites : 0,
        }
    }


    componentDidMount()
    {   
        this.studio()
        this.visite();
        
    }

    visite = () => {
        let data = {
            id : this.state.id,
        }
        axios.post('http://localhost:8080/visit_studio', data, {headers: { "token": localStorage.getItem("token") }}).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    geo = (address) => {
        Geocode.setApiKey(this.state.api);
        Geocode.setLanguage("en");
        Geocode.fromAddress(address).then(
            response => {
            const { lat, lng } = response.results[0].geometry.location;
            this.setState({latitude: lat})
            this.setState({longitude: lng})
            },
            error => {
                console.error(error);
            }
        )
    }
    heure(props)
    {
        
        
      const listItems = props.heure.map((number) => <button  onClick={this.onClick} style={{ margin : "5px",      width: 'calc(100% - 10px)',}} type="button" class="btn btn-secondary teee">{number}</button>);
      return (<div style={{ } }>{listItems}</div>);
    }
    select = () => {
        let option = []
        let personne = "personne"
        for (let i = 1; i <= this.state.d.nbr_people; i++) {
            if (i > 1) {
                personne = "personnes"
            }
            option.push(<option value={i}>{i} {personne}</option>)
        }
        return option
    }

    addHeure = () => {
        console.log(this.props)
        // console.log(this.state.array)
        // console.log(this.state.hour_selected)
        // console.log(this.state.hour_selected_2)
        let date = moment(this.state.date).format('DD/MM/YYYY');
        let datestock = moment(this.state.date).format('YYYY-MM-DD');
        let opening = parseInt(this.state.hour_selected.substr(0, 2))
        let closing = parseInt(this.state.hour_selected_2.substr(0, 2))
        let nbrhour = closing - opening
        let prix = parseInt(this.state.d.prix)
        //console.log(nbrhour)
        console.log(this.state.currservices);
        let prixserv = this.state.currservices !== null ? 5 : 0;
        this.props.addBasket({ studio_img : this.state.d.images[0] === undefined ? "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png" : this.state.d.images[0].url_image,name: this.state.d.name , service : this.state.currservices , prixservices : prixserv, dateaff:  date, datestock: datestock, studioid : this.state.d.id, prix : prix , nbrhour : nbrhour, hours : [this.state.hour_selected, this.state.hour_selected_2]})
        this.setState({disabled: ' no-error'})
    }


    onClick = () => {
        let date = moment(this.state.date).format('YYYY-MM-DD')
        console.log(date)
        if(date.toString() != "Invalid date") {
            this.setState({valid: true})
            this.hours()
            this.setState({error: null})
            this.errorMessage()
        }
        else {
            this.setState({error: 1})
        }
    }

    errorMessage = () => 
    {
        let message
        if(this.state.error == 1) 
        {
            return(<div>Veuillez remplir tous les champs</div>)
        }
        else 
        {
            message = "no-error"
            return(<div className={message}>Veuillez remplir tous les champs</div>)
        }
    }

    onSelect = (value) => {
        if (value.toString().length > 4) {
            // this.setState({hour_selected: value})
            this.setState({valid_2: true})
            let dis = this
            let date = moment(dis.state.date).format('YYYY-MM-DD')
            axios.post("http://localhost:8080/reservation/get", {day: date, studio_id: dis.props.match.params.id}).then(function (res) {
            let opening = (value.substr(0, 2))
            dis.setState({hour_selected: value})
            let closing = (dis.state.d.closing.substr(0, 2))
            let array = []
            let count = 0;

            let array2 = [];
            let rdv = false;
            // console.log(res[0])
            for (let index = parseInt(opening)+1; index <= closing; index++) 
            {   
                if(rdv){
                    break;
                }
                let bool = false
                if(index.toString().length < 2)
                {
                    index = "0" + index
                }
                // console.log(index)
                
                for (let i in res.data.succes) {
                    // console.log(index);
                    let hours =  res.data.succes[i][0].substr(0,2)
                    
                    if(parseInt(opening)+1 == res.data.succes[i][0].substr(0,2)){
                        console.log(index)
                        array2.push(<option value={index + ":00"}>{index}:00</option>)
                        rdv = true;
                        break;
                    }
                    if (hours.toString() === index.toString()) {
                        bool = true
                    }
                }

                if (!bool) {
                    array.push(<option value={index + ":00"}>{index}:00</option>)
                }
            }

            rdv ? array2.push(<option hidden disabled selected value>Heure de fin</option>) : array.push(<option hidden disabled selected value>Heure de fin</option>)
            let final = rdv ? array2 : array;
            dis.setState({ array_2: final })
            // console.log(dis.state.array_2);

        })
        }
    }

    hour_selected = () => 
    {
        if (this.state.valid_2) {
            let opening = (this.state.hour_selected.substr(0, 2))
            let closing = (this.state.d.closing.substr(0, 2))
            let array = []
            let o = parseInt(opening) + 1
            for (let index = o ; index <= closing; index++) 
            {   
                if(index.toString().length < 2)
                {
                    index = "0" + index
                }
                array.push(<option value={index + ":00"}>{index}:00</option>)
            }
            array.push(<option hidden disabled selected value>Heure de fin</option>)
            return array
        }
    }

    hours = () => {
        let date = moment(this.state.date).format('YYYY-MM-DD')
        let res 
        let dis = this
        let props = dis.props
        axios.post("http://localhost:8080/reservation/get", {day: date, studio_id: dis.props.match.params.id}).then(function (res) {
            let opening = (dis.state.d.opening.substr(0, 2))
            let closing = (dis.state.d.closing.substr(0, 2))
            let array = []
            let count = 0;

            let arraytest = [];
            // console.log(res)

            // si il a un rendez vous juste apres l'heure choisi
            // => heure choisi + 1
            for (let index = opening; index <= closing; index++) 
            {   
                let bool = false
                if(index.toString().length < 2)
                {
                    index = "0" + index
                }
                for (let i in res.data.succes) {
                    let hours =  res.data.succes[i][0].substr(0,2)
                    if (hours.toString() === index.toString()) {
                        // console.log(index);
                        // if (array.length > 0 && parseInt(array[0].props.value.substr(0, 2)) + 1 == hours)  {
                        //     // console.log(array);
                        //     var a = array.indexOf(array[0])
                        //     console.log(a);
                        //     // array.splice(a, 1)
                        // }
                            bool = true
                    }
                }
                if (!bool) 
                {
                    console.log(index);
                    array.push(<option value={index + ":00"}>{index}:00</option>)
                }
            }
            array.push(<option hidden disabled selected value>Heure de départ</option>)
            dis.setState({ array })
        })
    }

    detail = () => {
        if (this.state.t == true) {
            let city = this.state.d.address.split(",")
            MarkersOnMap.Init({
                googleApiKey: this.state.api,
                mapHeight: '500px', 
                mapWidth: '100%',
                mapBackgroundColor: '#02c39a',
                markerObjects: [
                  {
                    markerLat: this.state.latitude,
                    markerLong: this.state.longitude,
                  },
                ],
              });
            let css = false
            MarkersOnMap.Run('div#GoogleMap');
            const button = (value, v) => {
                if (v == 1) {
                    
                    this.setState({all_field: true, hour_selected_2: value})
                    console.log('====================================');
                    console.log(this.state.hour_selected_2);
                    console.log('====================================');
                }
            }
            return(
                <div class="container">
                    <div className="header_of_studio">
                        <h1 className="title_studio">{this.state.d.name}</h1>
                        <div className="icons_studio">
                            <i class="material-icons icon">grade</i>
                            <p className="pt-1 note mr-1">{this.state.note !== null ? this.state.note : 5}</p>
                            <p className="pt-1">({this.state.visites !== null ? this.state.visites : 0})</p>
                            <span className="lil-point">·</span>
                        </div>
                    </div>
                    <div class="row">
                        <div className="col-9 el_studio">
                            <img className="image_one_studio" src={this.state.d.images[0] === undefined ? "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png" : this.state.d.images[0].url_image}></img>
                            <div className="py-2">
                                <p className="description">{this.state.d.name} en quelques mots</p>
                            </div>
                    <p>Adresse: {this.state.d.address}</p>
                    <p>Prix: {this.state.d.prix}€/h</p>   
                    <p>Propriétaire: {this.state.u.nom} {this.state.u.prenom}</p>
                    
                    <div className="mt-3" id="GoogleMap"></div>
                    <br/>
                    {this.state.avis.length > 0 ? this.state.avis.map( e => {
                    console.log(e)
                    return(
                        <div className="media mb-3">                
                            <div className="media-body p-2 shadow-sm rounded bg-light border">
                                <small className="float-right text-muted">{moment(e.created_at).format("DD/MM/YYYY hh:mm")}</small>
                                <Rating name="read-only" value={e.note} readOnly />
                                <h6 className="mt-0 mb-1 text-muted">{e.user[0].nom}  {e.user[0].prenom}</h6>
                                {e.commentaire}
                            </div>
                        </div>
                    )}) : <p>Il n'y a pas de commentaire</p>}
                    </div>
                    <div className="col-3">
                        <div className="calendar">
                            <p>Ajoutez des dates pour voir le prix</p>
                            <div className="booking">
                            <SingleDatePicker
                                numberOfMonths={1}
                                showClearDates={true}
                                date={this.state.date}
                                onDateChange={date => this.setState({ date })} 
                                focused={this.state.focused} 
                                onFocusChange={({ focused }) => this.setState({ focused })} 
                                id="your_unique_id"
                            />
                        </div>
                            <select className="select_people mt-3" value={this.state.personnes} onChange = {event => this.setState({personnes: event.target.value})}>
                                {this.select()}
                            </select>
                            {this.errorMessage()}
                            {this.state.valid ? <div><select className="select_people mt-3" onChange = {event => this.onSelect(event.target.value)}>{this.state.array.length > 0 ? this.state.array : null}</select></div> : null}
                            {this.state.valid_2 ? <div><select className="select_people mt-3" onChange={event => button(event.target.value, 1)}>{this.state.array_2}</select></div> : null}
                            
                            {this.state.services.length > 0 ? <div><p style={{marginTop:'9px'}}>Services complementaires</p><select className="select_people mt-3" onChange={e => this.setState({currservices : e.target.value})}>{ this.state.services.map( e => <option id={e.id}>{e.name}</option>) }</select></div> : null}
                            {this.state.all_field ? <button className={"hero-banner-button button-studio" + this.state.disabled} onClick={() => this.addHeure()}>Ajouter au panier</button> : <button className="hero-banner-button button-studio" onClick={this.onClick}>Verifier les disponibilités</button>}
                        </div>
                    </div>
                        
                    </div>
                </div>
            )  
            
        }
    }

    studio = async () => {
        const dis = this;
        axios.get('http://localhost:8080/show_studio/'+this.state.id, {
        }).then(function (response) {
                console.log(response.data.succes)
                dis.setState({d: response.data.succes})
                dis.setState({note: response.data.succes.note_generale})
                dis.setState({visites: response.data.succes.visites})
                dis.setState({ avis : response.data.succes.avis})
                dis.setState({u: response.data.succes.user[0]})
                dis.setState({t: true})
                response.data.succes.services.unshift({id: 0, name : 'Aucun'});
                dis.setState({ services : response.data.succes.services});
                dis.geo(response.data.succes.address)
                dis.setState({open: response.data.succes.opening})
                dis.setState({close: response.data.succes.closing})
        }).catch(function (error) {
                console.log(error);
        });
    }

    render(){
        return(
            <div>
                {this.detail()}
            </div>
        )
    }
}

export default connect(null, { addBasket })(oneStudio);
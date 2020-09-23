import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PlacesAutocomplete from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';


class AllStudio extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            d: [],
            isCpromo : null,
            address: null,
            gmapsLoaded: false,
            date: null,
            scrollTop: 0,
            studio : null,
            orderBy : "popularite",
            autocomplete : [],
            autovalue : null,
        }
    }

    initMap = () => {
        this.setState({
          gmapsLoaded: true,
        })
      }
    componentDidMount(){
        window.addEventListener('scroll', console.log(2));
        window.initMap = this.initMap
        const gmapScriptEl = document.createElement(`script`)
        gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDguFqu_sl5qbBxhci9X_lEzqt5dlumocM&libraries=places&callback=initMap`
        document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl);
        this.studio();
        this.getpromo();
    }

    getpromo = () => {
        const dis = this;
        axios.get('http://localhost:8080/promo/ajd', {
        }).then(function (response) {
            dis.setState({isCpromo: response.data[0].code})
        }).catch(function (error) {
                console.log(error);
        });
    }
    handleChange = address => {
        this.setState({ address });
        console.log(this.state.address);
      };
    
    studio = () => {

        // console.log(this.props.location.state);
        const dis = this;
        if(this.props.location.state === undefined || this.props.location.state.date == "Invalid date" && this.props.location.state.address == ""){
            
            axios.get('http://localhost:8080/studio', {
            }).then(function (response) {
                dis.setState({d: response.data.studios})
            }).catch(function (error) {
                    console.log(error);
            });
        } else {
            console.log('recherche')
            let address = this.props.location.state.address;
            let date = this.props.location.state.date;

            let body = {
                address : address,
                date : date,
            }
            console.log(body)
            axios.post('http://localhost:8080/search', body).then(function (response) {
                console.log('trouve')
                console.log(response.data)
                dis.setState({d: response.data.studios})
            }).catch(function (error) {
                    console.log(error);
            });
        }
    }  
    handleInputChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
    };

    search = (id_studio = null) => {
        const dis = this;
        let body = {
            address : this.state.address == "" || this.state.address == null ? "," : this.state.address ,
            date : this.state.date,
            orderBy : this.state.orderBy,
            id : id_studio,
        }
        console.log(body)
        axios.post('http://localhost:8080/search', body).then(function (response) {
            console.log('trouve')
            console.log(response.data)
            dis.setState({d: response.data.studios})
        }).catch(function (error) {
                console.log(error);
        });
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
            fetch(' http://127.0.0.1:8080/autocomplete_search', requestOptions).then(response => response.json()).then(data => {
                Object.keys(data.studios).map(function (key, index) { array.push(data.studios[key]); });
                this.setState({ autocomplete: array });
            });
    }
    addletter = (event, id = null) => {
        console.log('ici');
        this.setState({
            autovalue: event.target.value,
            id: id,
            autocomplete: []
        });
        this.search(id);
        console.log(id);
    }


    render()
    
    {
        const searchOptions = {
            componentRestrictions: { country: ['fr'] },
            types: ['(cities)'],
          }
        return(
            <div className="container-fluid">
                <div className="row">
                <div className="d-flex col-3">
                    <nav class=" navbar-light bg-light position-sticky" style={{width: "100%"}}>
                        <form onSubmit={(e) => {e.preventDefault()}} class="form">
                        <p className="my-2">Lieu</p> 
                        <div class="md-form mb-3">
                                {this.state.gmapsLoaded && (
                                    <PlacesAutocomplete
                                    searchOptions={searchOptions}
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    onSelect={this.handleSelect}
                                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="input-icon SingleDatePicker">
                            <div className="column-input">
                            <input
                                class="form-control"
                                {...getInputProps({
                                placeholder: 'À proximité, adresse exacte, arrêt de métro…',
                                className: 'location-search-input form-control',
                                })}
                            />
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Chargement...</div>}
                                {suggestions.map(suggestion => {

                                const style = suggestion.active
                                    ? { backgroundColor: '#42a5f5', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div className="input-suggestion py-3 px-2"
                                    {...getSuggestionItemProps(suggestion, {

                                        style,
                                    })}
                                    > 
                                    <span>{suggestion.description}</span>
                                    </div>
                                    
                                );
                                })}
                            </div>
                            </div>
                            </div>
                        )}
                        </PlacesAutocomplete>)}
                        </div>
                            <button class="btn btn-outline-success mb-3" onClick={() => this.setState({ address : ""})}>Effacer</button>                        
                            <div>
                                <label for="checkIn">Chercher par mot clé</label>
                                <input autocomplete="off" value={this.state.autovalue}  onChange={(event) => this.autocomplete(event)} placeholder="Nom" class="form-control mb-3" id="checkIn" name="checkin-date"></input>
                                    <this.Autocomplete_value Autocomplete_value={this.state.autocomplete}/>
                            </div>
                            <select class="form-control mr-sm-2 mb-3" onChange={(e) => { this.setState({ orderBy : e.target.value })}}>
                                <option selected value="prixasc">Prix croissant</option>
                                <option value="prixdesc">Prix decroissant</option>
                                <option value="avis">Avis</option>
                                <option value="popularite">Popularite</option>
                            </select>
                            <button onClick={() => this.search()} class="btn btn-outline-success my-2 my-sm-0" type="submit">Rechercher</button>
                        </form>
                    </nav>
            {/* { this.state.isCpromo !== null ? this.state.isCpromo : null} */}
            </div>
                <div className="col-6">
                {this.state.d.map((studio) => {
                console.log(studio)
                {
                return(
                    <>
                    {
                        <div className="el_studio mb-5" style={{alignItems: "center"}}>
                            <img src={studio.images[0] === undefined ? "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png" : studio.images[0].url_image }></img>
                            <Link params={{ studio: studio.id }} to={"studio/"+studio.id}>{studio.name}</Link>
                            <p>{studio.prix}€/h</p>
                        </div>

                    }
                    </>
                )
            }
            })}
                </div>
                <div className="col-3 allstudio"></div>
            </div>
            </div>
        )
    }
}

export default AllStudio


// const validate = () => {
//     
// };
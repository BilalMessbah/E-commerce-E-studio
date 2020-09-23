import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete'


class UpdateStudio extends Component {


    constructor(props) {
        super(props)
        this.state = {
            name: null,
            address: null,
            address2: [],
            tva: true,
            description: null,
            prix: null,
            image: null,
            nbr_people: null,
            type_studio: null,
            country: null,
            city: null,
            autocomplete : [],
            autovalue : null,
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', console.log(2));
        window.initMap = this.initMap
        const gmapScriptEl = document.createElement(`script`)
        gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDguFqu_sl5qbBxhci9X_lEzqt5dlumocM&libraries=places&callback=initMap`
        document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)
    }


    initMap = () => {
        this.setState({
            gmapsLoaded: true,
        })
    }

    d = () => {
        let formdata = new FormData();
        formdata.append('id_studio', this.state.id);
        formdata.append('image1', this.state.image)
        formdata.append('name', this.state.name)
        formdata.append('nbr_people', this.state.nbr_people)
        formdata.append('tva', "true")
        formdata.append('description', this.state.description)
        formdata.append('prix', this.state.prix)
        formdata.append('inge_son', "true")
        formdata.append('address', this.state.address)
        return formdata;
    }

    handleChange = (address) => {
        this.setState({ address });
        // console.log(address);
    }

    handleSelect = (address) => {
        this.setState({ address: address })
        this.setState({ address2: [] })
        this.state.address2.push(address)
        console.log(this.state.address2[0])
    };

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
            fetch(' http://127.0.0.1:8080/autocomplete', requestOptions).then(response => response.json()).then(data => {
                Object.keys(data.studios).map(function (key, index) { array.push(data.studios[key]); });
                this.setState({ autocomplete: array });
            });
    }

    validate = (e) => {
        let dis = this
        console.log(this);
        console.log(this.state.address);
        console.log(localStorage.getItem("token"));
        const requestOptions = { method: 'POST', headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") }, 
        body: JSON.stringify({ "id_studio": this.state.id, "name": this.state.name, 'nbr_people': this.state.nbr_people,'description': this.state.description, 'prix': this.state.prix, 'address': this.state.address}) };
        fetch('http://localhost:8080/update_studio', requestOptions).then(response => response.json()).then(data =>  {
            document.getElementById("success").textContent = 'Studio '+this.state.name+' modifier avec succes';
            console.log(data);
        });
    };

    render() {
        const searchOptions =
        {
            componentRestrictions: { country: ['fr'] },
            types: ['address']
        }

        return (
            <div className="bg-studio">
                <div className="container bg-studio">
                    <div className="card text-center" style={{ display: 'contents' }}>
                        <div className="card-body p-5">
                            <h1>Modifier un article</h1>
                            <div>
                                <label for="checkIn">Chercher par mot clé</label>
                                <input autocomplete="off" value={this.state.autovalue}  onChange={(event) => this.autocomplete(event)} placeholder="Nom" class="form-control" id="checkIn" name="checkin-date"></input>
                                    <this.Autocomplete_value Autocomplete_value={this.state.autocomplete}/>
                            </div>
                            <div className="form-group">
                                <label>Name :</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Name"
                                    required
                                    onChange={(event) => this.setState({ name: event.target.value })}></input>
                            </div>
                            <div className="form-group">
                                <label>Description :</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Description"
                                    required
                                    onChange={(event) => this.setState({ description: event.target.value })}></input>
                            </div>
                            <div className="form-group">
                                <label>Adresse:</label>
                                {this.state.gmapsLoaded && (
                                    <PlacesAutocomplete
                                        searchOptions={searchOptions}
                                        value={this.state.address}
                                        onChange={this.handleChange}
                                        onSelect={this.handleSelect}>
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div className="input-icon">
                                                <i className="material-icons">my_location</i>
                                                <div className="column-input">
                                                    <input
                                                        className="form-control"
                                                        {...getInputProps({
                                                            placeholder: 'À proximité, adresse exacte, arrêt de métro…',
                                                            className: 'location-search-input form-control',
                                                        })}/>
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
                                                                    })}>
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
                            <div className="form-group">
                                <label>Prix:</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Prix"
                                    required
                                    onChange={(event) => this.setState({ prix: event.target.value })}></input>
                            </div>
                            <div className="form-group">
                                <label>Number of people :</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Number of people"
                                    required
                                    onChange={(event) => this.setState({ nbr_people: event.target.value })}></input>
                            </div>
                            {/* <div>
                                <input type="file"
                                    className="form-control"
                                    placeholder="Tva"
                                    required
                                    onChange={(event) => this.setState({ image: event.target.files[0] })}></input>
                            </div> */}
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

export default UpdateStudio;

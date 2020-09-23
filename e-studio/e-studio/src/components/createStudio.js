import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete'


class Create extends Component { 


    constructor(props){
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
            newservice : '',
            listservice : [],
        }
    }

    componentDidMount(){
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
        let formdata = new FormData()
        formdata.append('image1', this.state.image)
        formdata.append('name', this.state.name)
        formdata.append('nbr_people', this.state.nbr_people)
        formdata.append('tva', "true")
        formdata.append('description', this.state.description)
        formdata.append('prix', this.state.prix)
        formdata.append('inge_son', "true")
        formdata.append('address', this.state.address)
        formdata.append('services', this.state.listservice)
        return formdata;
    }


    handleChange = (address) => {
        this.setState({ address });
        // console.log(address);

    }

    handleSelect = (address) => {
        this.setState({address: address})
        this.setState({address2: []})
        this.state.address2.push(address)
        console.log(this.state.address2[0])
    };

    addService = () => {
      console.log('oui');
      if(this.state.newservice !== ''){
        let array = this.state.listservice;
        array.push(this.state.newservice);
        this.setState({ listservice : array,
                        newservice : '',
        });
      }
    }

    removeService = (key) => {
      let array = this.state.listservice;
      array.splice(key,key+1);
      this.setState({ listservice : array});
    }


    validate = (e) => {
        let dis = this
        var myHeaders = new Headers({
            "token":  localStorage.getItem("token"),
          });
          console.log(this.state.address)
        console.log(localStorage.getItem("token"))
        axios.post('http://localhost:8080/studio/create', this.d(), {headers: { "token": localStorage.getItem("token") }}).then(function (response) {
            if(response.status == 200 && response.data.test){
                dis.props.history.push('studio/' + response.data.test)
            }
            else {
              console.log(response)
            }
        })
            .catch(function (error) {
                console.log(error);
            });

    };


    // handleCheck(e) {
    //     e.currentTarget.dataset.id 
    // }
    

    render(){

    const searchOptions = 
    {
        componentRestrictions: { country: ['fr'] },
        types: ['address']
    }

    return (
      <div className="container-fluid overflow-hidden">
        <div className="row">
        {/* <p onClick={props.onSubmitClick}>Name: {props.auth.user}</p> */}
        <div className="col-6 left-side-checkout"></div>
        <div className="col-6 right-side">
            <div className="card text-center ">
                <div className="card-body p-5">
                    <h1>Ajouter votre Studio</h1>
                    <div className="form-group">
                        <label>Nom:</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Nom"
                            required
                            onChange={(event) => this.setState({name: event.target.value})}></input>
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Description"
                            required
                            onChange={(event) => this.setState({description: event.target.value})}></input>
                    </div>
                    <div className="form-group">
                        <label>Adresse:</label>
                            {this.state.gmapsLoaded && (
                            <PlacesAutocomplete
                              searchOptions={searchOptions}
                              value={this.state.address}
                              onChange={this.handleChange}
                              onSelect={this.handleSelect}
                            >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="input-icon">
                      <div className="column-input">
                      <input
                        className="form-control"
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
                    <div className="form-group">
                        <label>Prix:</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Prix"
                            required
                            onChange={(event) => this.setState({prix: event.target.value})}></input>
                    </div>
                    <div className="form-group">
                        <label>Nombre de personnes autorisées:</label>
                        <input type="text"
                          className="form-control"
                          placeholder="Nombre de personnes autorisées"
                          required
                          onChange={(event) => this.setState({nbr_people: event.target.value})}></input>
                    </div>
                    
                    <div className="form-group">
                      { this.state.listservice.length > 0 ? this.state.listservice.map((e,key) => 
                          <>
                          <p style={{fontWeight: "bold"}}>{e}</p>
                          <button className="my-1" style={{backgroundColor: "#02c39a", color: "white", border: "none", padding: "20"}} onClick={() =>this.removeService(key)}>Retirer</button>
                          </>
                      ) 
                      :null }
                    </div>
                    <div className="form-group">

                        <label>Ajouter des services supplementaires</label>
                        <input type="text"
                          value={this.state.newservice}
                          className="form-control"
                          placeholder="Exemple Mixage"
                          
                          onChange={(event) => this.setState({newservice: event.target.value})}></input>
                          <button style={{backgroundColor: "#02c39a", color: "white", border: "none", padding: "20"}} className="mt-3" onClick={()=>this.addService()}>Ajouter un service</button>
                    </div>

                    <div className="form-group">
                    <label>Image du Studio:</label>
                    <input type="file"
                            className="form-control"
                            required
                            onChange={(event) => this.setState({image: event.target.files[0]})}></input>
                    </div>
                    {/* <Link onClick={validate}> */}
                        <button type="submit"
                            onClick={this.validate}
                            className="btn btn-primary hero-banner-button mt-3">Ajouter</button>
                    {/* </Link> */}
                </div>
            </div>
        </div>
        </div>
        </div>
    )
    }
}

export default Create;

import * as React from 'react';
import logo from '../logo.svg';
import background from '../assets/img/homepage.jpg'
import '../App.css';
import radio from '../assets/img/icons/radio.png';
import pin from '../assets/img/icons/pin.png';
import calendar from '../assets/img/icons/calendar.png';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import N from '../components/Navbar';
import PlacesAutocomplete from 'react-places-autocomplete';
import ScriptTag from 'react-script-tag';
import Slide from '../components/Slide';
import 'react-dates/initialize';
import moment from 'moment'
import 'moment/locale/fr';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';


export default class index extends React.Component {

    constructor(props) {
      super(props);
      this.state = { 
      address: '',
      gmapsLoaded: false,
      date: null,
      scrollTop: 0 };
    }

    search = () => {
      
        let date = moment(this.state.date).format('YYYY-MM-DD')
        let address = this.state.address
        this.props.history.push({
          pathname: '/studio',
          state: { 
            date: date,
            address: address 
          }
        })
    }

    initMap = () => {
      this.setState({
        gmapsLoaded: true,
      })
    }

    heure(props)
    {
      const listItems = props.heure.map((number) => <button  style={{ margin : "5px",      width: 'calc(100% - 10px)',}} type="button" class="btn btn-secondary teee">{number}</button>);
      return (<div style={{ } }>{listItems}</div>);
    }

    componentDidMount(){
      window.addEventListener('scroll', console.log(2));
      window.initMap = this.initMap
      const gmapScriptEl = document.createElement(`script`)
      gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDguFqu_sl5qbBxhci9X_lEzqt5dlumocM&libraries=places&callback=initMap`
      document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)
    }

    handleChange = address => {
      this.setState({ address });
      console.log(this.state.address);
    };

    render (){  

      const searchOptions = {
        componentRestrictions: { country: ['fr'] },
        types: ['(cities)'],
      }
  
          return (
          <>
          <div className="homepage-section1">
                  
                  <div className="hero-banner-section">
                    <div className="hero-banner">
                      <div className="hero-title mb-3">
                          <h1 className="text-bold">Un micro près de chez vous</h1>
                      </div>
                      <div class="form-group">
                            {this.state.gmapsLoaded && (
                            <PlacesAutocomplete
                              searchOptions={searchOptions}
                              value={this.state.address}
                              onChange={this.handleChange}
                              onSelect={this.handleSelect}
                              >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="input-icon SingleDatePicker">
                      <i class="material-icons">my_location</i>
                      <div className="ml-1 column-input">
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
                                {/* <input class="form-control" type="text" autocomplete="off" placeholder="À proximité, adresse exacte, arrêt de métro…"></input> */}
                              <div class="input-icon mt-3 mb-2">
                                <i class="material-icons mr-1">calendar_today</i>
                                <SingleDatePicker
                                  numberOfMonths={1}
                                  date={this.state.date} // momentPropTypes.momentObj or null
                                  onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                                  focused={this.state.focused} // PropTypes.bool
                                  onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                                  id="your_unique_id" // PropTypes.string.isRequired,
                                />
                                {/* <input class="form-control" type="text" autocomplete="off" placeholder="Ajoutez une date"></input> */}
                              </div>
                              <div class="ml-1 input-icon mt-3">
                                <button onClick={ this.search } class="hero-banner-button">Rechercher</button>
                              </div>
                          </div>    
                        </div>
                    </div>
                  </div>
                  <div className="homepage-section2 container">
                    <h2 className="le_h2">Comment ça marche ?</h2>
                    <div className="container mb-4">
                      <div class="row">
                        <div class="col-4 homepage-carousel text-center">
                          <img src={pin}></img>
                          <h3 className="title-section2">Lorem ipsum</h3>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <div class="col-4 homepage-carousel text-center">
                          <img src={calendar}></img>
                          <h3 className="title-section2">Lorem ipsum</h3>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <div class="col-4 homepage-carousel text-center">
                          <img src={radio}></img>
                          <h3 className="title-section2">Lorem ipsum</h3>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                      </div>
                    </div>
                    <div className="homepage-section2 py-2">
                      <h2>Les plus populaires</h2>
                      <Slide />
                    </div>
                  </div>
                  </>
          )
    }
}
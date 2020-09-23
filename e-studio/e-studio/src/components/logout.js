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

export default function Logout(props) {
    localStorage.removeItem("token");
    props.history.push('/')

}
import React, { Component } from 'react'
import background from '../assets/img/test.jpg'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

class Slide extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: null,
            d: false,
        }
    }
    componentDidMount(){
        this.validate()
    }

    slide = () => {
        return(
            this.state.data.map((studio) => {
            {
                return(
                    <div className="col-3 img">
                        <img src={background} />
                        <Link params={{ studio: studio.id }} to={"studio/"+studio.id}>
                        <p className="country">{studio.name}</p>
                        </Link>
                        <p class="description">{studio.description}</p>
                        <p class="prix">À partir de {studio.prix}€/heure</p>
                        {/* <p className="review">{<FontAwesomeIcon icon={faStar} />} 4.99</p> */}
                    </div>
                )
            }
            })
        )
    }

    validate = () => {
        let dis = this
        axios.get('http://localhost:8080/popular').then(function (response) {
            if (response.status === 200) 
            {
                dis.setState({data: response.data.test})
                console.log(dis.state.data)
                dis.setState({d: true})
                console.table(dis.state.data)
            }
        })
            .catch(function (error) {
                console.log(error);
            });
    };
    
    render(){
        return(
            <div className="container mb-4">
                <div className="row">
                    {this.state.d == true ? this.slide() :  null}
                </div>
            </div>
        )
    }
}

export default Slide;
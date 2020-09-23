import React, { useState, Component } from 'react';
import axios from 'axios';

class Get_Code extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isCpromo: null,
            success : false,
        }
    }
    validate = (e) => {
        const dis = this;
        axios.get('http://localhost:8080/promo/ajd', {
        }).then(function (response) {
            dis.setState({isCpromo: response.data, success : true})
            // let tab = dis.state.isCpromo;
            // document.getElementById("success").textContent = tab;
        }).catch(function (error) {
                console.log(error);
        });
    }
    
    render() {
    return (
        <div className="body">
            <div className="container">
                <div className="card text-center" style={{ backgroundColor: 'pink', display: 'contents' }}>
                    <div className="card-body">
                        <h1>Affichage des codes promos</h1>
                        <div className="form-group" id="success">
                            { this.state.success && this.state.isCpromo !== null ? this.state.isCpromo.map(e => <p>{e.code}</p>) : null}

                        </div>
                      <button type="submit" onClick={this.validate} className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
    }
}
export default Get_Code;
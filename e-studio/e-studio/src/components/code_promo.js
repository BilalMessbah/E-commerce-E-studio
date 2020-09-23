import React, { useState } from 'react';

const Code = (props) => {
    const [code, setCode] = useState('');
    const [percent, setPercent] = useState('');
    const [valeur, setValeur] = useState('');
    const [debut, setDebut] = useState('');
    const [fin, setFin] = useState('');
    const [isSaisonnier, setIsSaisonnier] = useState('');

    var data = {
        code: code,
        percent: percent,
    }

    const validate = (e) => {
        var requestOptions = { method: 'POST', headers: {'Content-Type': 'application/json',"token": localStorage.getItem("token")},
        body: JSON.stringify({ "code": code, "pourcentage": percent, "value": valeur, 'debut': debut, 'fin': fin, 'isSaisonnier': isSaisonnier}) }
        fetch(`http://localhost:8080/Cpromo`, requestOptions).then(response => response.json()).then(data => {
            document.getElementById("success").textContent = "Code promo "+code+" crée avec succes";
                console.log(data);
            }).catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div className="body">
            <div className="container">
                <div className="card text-center" style={{ backgroundColor: 'pink', display: 'contents' }}>
                    <div className="card-body">
                        <h1>Creation code promo</h1>
                        <div className="form-group">
                            <label>Code :</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Nom du code"
                                required
                                onChange={(event) => setCode(event.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Pourcentage :</label>
                            <input type="text"
                                className="form-control"
                                placeholder="percent %"
                                onChange={(event) => setPercent(event.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Valeur :</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Valeur a retirer en euros"
                                onChange={(event) => setValeur(event.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Debut :</label>
                            <input type="datetime-local"
                                className="form-control"
                                placeholder="Code"
                                onChange={(event) => setDebut(event.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Fin :</label>
                            <input type="datetime-local"
                                className="form-control"
                                placeholder="Code"
                                onChange={(event) => setFin(event.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Code Saisonnier ?</label>
                            <input type="text"
                                className="form-control"
                                placeholder="0 or 1"
                                onChange={(event) => setIsSaisonnier(event.target.value)}></input>
                        </div>
                        <div className="form-group" id="success">

                        </div>
                        <button type="submit" onClick={validate} className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Code;
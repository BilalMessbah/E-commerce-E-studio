import React from 'react';

const BillingDetailsFields = () => {
    return (
      
      <div>
        <div className="form-group">
        <label>
          Nom <br />
          <input
            name="name"
            type="text"
            placeholder="Jane Doe"
            required
          />
        </label>
        </div>
        
        <div className="form-group">
        <label>
          E-mail <br />
          <input
            name="email"
            type="email"
            placeholder="jane.doe@example.com"
            required/>
        </label>
        </div>
        
        <div className="form-group">
        <label>
          Adresse <br />
          <input
            name="address"
            type="text"
            placeholder="185 Berry St. Suite 550"
            required
           />

        </label>
        
        </div>
        <div className="form-group">
        <label>
          Ville <br />
            <input
            name="city"
            type="text"
            placeholder="San Francisco"
            required
            />
        </label>
        </div>
        
        <div className="form-group">
        <label>
          Code Postal <br />
          <input
          name="zip"
          type="text"
          placeholder="94103"
          required
           />
        </label>
        </div>
    </div>
      
    );
  };
  export default BillingDetailsFields;

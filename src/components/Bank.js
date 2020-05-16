import React, { Component } from 'react';
import './Admin.css'

class Bank extends Component {

    render() {
      return (
        <div id="content" style={{justifyContent:'center', width:'100%'}}>
          
          <h1 className="head">Welcome <strong>{this.props.usertype[this.props.account].name}.</strong></h1>
          <br/>
        <h3 >Add Bags</h3>
        <br/>
        {/* <div className="button-container" > */}
        <form onSubmit={(event) => {
          event.preventDefault()
          const donor = event.target[0].value
          const donor_name = event.target[1].value
          const donor_number = event.target[2].value
          const blood_group = event.target[3].value
          const expiry = event.target[4].value
          const city = event.target[5].value
          this.props.createBloodbag(donor, donor_name, donor_number, blood_group, expiry, city.toLowerCase())
        }}>
          <div className="form-group row">
          <label className="col-md-2 col-form-label"> <h6>Donor address :</h6> </label>
            <div className="col-sm-10">
            <input 
              id="address"
              type="text"
              // ref={(input) => { this.userName = input }}
              className="form-control"
              placeholder="Donor's public address"
              required />
            </div>
          </div>
          <div className="form-group row">
          <label  className="col-md-2 col-form-label"> <h6>Donor name :</h6> </label>
            <div className="col-sm-10">
            <input 
              id="donorName"
              type="text"
              className="form-control"
              placeholder="Donor's name (if donating first time)"
              />
            </div>
          </div>
          <div className="form-group row">
          <label  className="col-md-2 col-form-label"> <h6>Donor number :</h6> </label>
            <div className="col-sm-10">
            <input 
              id="donorNo"
              type="tel"
              className="form-control"
              pattern="[0-9]{10}"
              placeholder="Phone number (10 digit)"
              required />
            </div>
          </div>
          <div className="form-group row">
          <label  className="col-md-2 col-form-label"> <h6>Blood group :</h6> </label>
            <div className="col-sm-10">
            <input 
              id="userName"
              type="text"
              className="form-control"
              placeholder="Blood group"
              required />
            </div>
          </div>
          <div className="form-group row">
          <label  className="col-md-2 col-form-label"> <h6>Expiry :</h6> </label>
            <div className="col-sm-10">
            <input 
              id="userName"
              type="text"
              className="form-control"
              placeholder="Number of days till expiry"
              required />
            </div>
          </div>
          <div className="form-group row">
          <label  className="col-md-2 col-form-label"> <h6>City :</h6> </label>
            <div className="col-sm-10">
            <input 
              id="userCity"
              type="text"
              className="form-control"
              placeholder="Name of city"
              required />
            </div>
          </div>
          <button style={{justifyContent:'center'}} type="submit" className="btn btn-primary">Add Blood Bag</button>
        </form>
        {/* </div> */}
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Donor</th>
              <th scope="col">Owner</th>
              <th scope="col">Blood Group</th>
              <th scope="col">Expiration Date</th>
              <th scope="col">Expiry Status</th>
              <th scope="col">Usage Status</th>
              <th scope="col">City</th>
            </tr>
          </thead>
          <tbody id="Blood bag list">
          {/* {console.log(this.props.usertype)} */}
            { this.props.bags.reverse().slice(0,10).map((bag, key) => {
              if (bag.bank === this.props.account){
                const expiry = (new Date(bag.expiry * 1000))
              return(
                <tr key={key}>
                  <th scope="row">{bag.id.toString()} <br></br>Address:</th>
                  <td>{this.props.usertype[bag.donor].name} <br></br>{bag.donor}</td>
                  <td>{this.props.usertype[bag.owner].name} <br></br> {bag.owner}</td>
                  <td>{bag.blood_group}</td>
                  <td>{expiry.toString().slice(0,15)}<br></br>{expiry.toString().slice(16,24
                    )}</td>
                  <td>{bag.expired ? "true" : expiry.toJSON().slice(0,10) < new Date().toJSON().slice(0,10) ? "true" : "false"}</td>
                  <td>{bag.used.toString()}</td>
                  <td>{bag.city.charAt(0).toUpperCase() + bag.city.slice(1)}</td>
                </tr>
              )
              }
            })} 
          </tbody>
        </table>

        </div>
      );
    }
  }
  
  export default Bank;
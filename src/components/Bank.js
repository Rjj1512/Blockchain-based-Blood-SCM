import React, { Component } from 'react';
import './Admin.css'

class Bank extends Component {

    render() {
      return (
        <div id="content" style={{justifyContent:'center', width:'100%'}}>
          <h1 className="head">Welcome <strong>Bank.</strong></h1>
          <br/>
        <h3 >Add Bank</h3>
        <br/>
        {/* <div className="button-container" > */}
        <form onSubmit={(event) => {
          event.preventDefault()
          const donor = event.target[0].value
          const donor_name = event.target[1].value
          const blood_group = event.target[2].value
          const expiry = event.target[3].value
          this.props.createBloodbag(donor, donor_name, blood_group, expiry)
        }}>
          <div className="form-group row">
          <label  class="col-md-2 col-form-label"> <h6>Donor address :</h6> </label>
            <div class="col-sm-10">
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
          <label  class="col-md-2 col-form-label"> <h6>Donor name :</h6> </label>
            <div class="col-sm-10">
            <input 
              id="userName"
              type="text"
              ref={(input) => { this.userName = input }}
              className="form-control"
              placeholder="Donor's name (if donating first time)"
              />
            </div>
          </div>
          <div className="form-group row">
          <label  class="col-md-2 col-form-label"> <h6>Blood group :</h6> </label>
            <div class="col-sm-10">
            <input 
              id="userName"
              type="text"
              ref={(input) => { this.userName = input }}
              className="form-control"
              placeholder="Blood group"
              required />
            </div>
          </div>
          <div className="form-group row">
          <label  class="col-md-2 col-form-label"> <h6>Expiry :</h6> </label>
            <div class="col-sm-10">
            <input 
              id="userName"
              type="text"
              ref={(input) => { this.userName = input }}
              className="form-control"
              placeholder="Number of days till expiry"
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
              <th scope="col">Collector Bank</th>
              <th scope="col">Owner</th>
              <th scope="col">Blood Group</th>
            </tr>
          </thead>
          <tbody id="Blood bag list">
          {/* {console.log(this.props.usertype)} */}
            { this.props.bags.reverse().slice(0,10).map((bag, key) => {
              if (bag.bank == this.props.account){
              return(
                <tr key={key}>
                  <th scope="row">{bag.id.toString()}</th>
                  <td>{this.props.usertype[bag.donor].name} {bag.donor}</td>
                  <td>{this.props.usertype[bag.bank].name} {bag.bank}</td>
                  <td>{this.props.usertype[bag.owner].name} {bag.owner}</td>
                  <td>{bag.blood_group}</td>
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
import React, { Component } from 'react';
import './Admin.css'

class Hospital extends Component {
  render() {
    return (
      <div id="content" style={{ justifyContent: 'center', width: '100%' }}>
        <h1 className="head">Welcome <strong>{this.props.usertype[this.props.account].name}.</strong></h1>
        <br />
        <h4 style={{ justifyContent: 'center' }}>Your Current Inventory</h4>
        {/* <form onSubmit={(event) => {
          event.preventDefault()
        }}>> */}
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Collector Bank's (Name and Address)</th>
                <th scope="col">Blood Group</th>
                <th scope="col">Used</th>
              </tr>
            </thead>
            <tbody id="Options list">
              {this.props.bags.sort((a, b) => b.expiry - a.expiry).reverse().slice(0, 10).map((bag, key) => {
                if (bag.owner === this.props.account) {
                  let a = bag.id.toNumber()
                  console.log(a)
                  return (
                    <tr key={key}>
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{bag.owner_name} <br /> {bag.bank} </td>
                      <td>{bag.blood_group}</td>
                      <th scope="row">
                      <button
                          name={bag.id.toNumber()}
                          className="btn btn-primary"
                          disabled={bag.used}
                          onClick={(event) => {
                            this.props.useBag(event.target.name);
                          }}>{bag.used ? "Bag used" : "Mark bag as used"}</button></th>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
      <p>&nbsp;</p>
        {/* </form>
        <form onSubmit={(event) => {
          event.preventDefault()
        }}>
          <div className="form-group row">
          <label  className="col-md-2 col-form-label"> <h6>Blood group :</h6> </label>
            <div className="col-sm-4">
            <input 
              id="bloodgrp"
              type="text"
              ref={(input) => { this.bloodgrp = input }}
              className="form-control"
              placeholder="Blood group"
              required />
            </div>
            <button
                //name={bag.id.toNumber()}
                className="btn btn-primary"
                //onClick={(event) => {
                //this.props.h_placeOrder(event.target.name)
                //}}
                >Search Bags</button>
          </div>
        }}> */}
        <h4 style={{ justifyContent: 'center' }}>Available blood bags</h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Collector Bank's (Name and Address)</th>
                <th scope="col">Current Owner's Name and Address</th>
                <th scope="col">Blood Group</th>
                <th scope="col">Expiry</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="Options list">
              {this.props.bags.sort((a, b) => b.expiry - a.expiry).reverse().slice(0, 10).map((bag, key) => {
                if (bag.owner !== this.props.account && bag.used !== true /*&& bag.blood_group === "AB-"*/) {
                  let a = bag.id.toNumber()
                  console.log(a)
                  console.log(bag.expiry,"expiry")
                  return (
                    <tr key={key}>
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{this.props.usertype[bag.bank].name} <br /> {bag.bank} </td>
                      <td>{this.props.usertype[bag.owner].name} <br /> {bag.owner} </td>
                      <td>{bag.blood_group}</td>
                      <td>{expiry.slice(0,15)}</td>
                      <th scope="row">
                        <button
                          name={bag.id.toNumber()}
                          className="btn btn-primary"
                          onClick={(event) => {
                            this.props.h_placeOrder(event.target.name)
                          }}>Buy for 1.5 ETH </button></th>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        {/* </form> */}
      </div>
    );
  }
}

export default Hospital;
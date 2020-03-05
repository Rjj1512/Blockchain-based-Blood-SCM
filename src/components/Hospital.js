import React, { Component } from 'react';
import './Admin.css'

class Hospital extends Component {

  render() {
    return (
      <div id="content" style={{ justifyContent: 'center', width: '100%' }}>
        <h1 className="head">Welcome <strong>Hospital.</strong></h1>
        <br />
        <h4 style={{ justifyContent: 'center' }}>Your Current Inventory</h4>
        <form>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Collector Bank's (Name and Address)</th>
                <th scope="col">Blood Group</th>
              </tr>
            </thead>
            <tbody id="Options list">
              {this.props.bags.reverse().slice(0, 10).map((bag, key) => {
                if (bag.owner === this.props.account) {
                  let a = bag.id.toNumber()
                  console.log(a)
                  return (
                    <tr key={key}>
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{bag.owner_name} <br /> {bag.bank} </td>
                      <td>{bag.blood_group}</td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        </form>

        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <form onSubmit={(event) => {
          event.preventDefault()
        }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Collector Bank's (Name and Address)</th>
                <th scope="col">Current Owner's Name and Address</th>
                <th scope="col">Blood Group</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="Options list">
              {this.props.bags.reverse().slice(0, 10).map((bag, key) => {
                if (bag.owner !== this.props.account) {
                  let a = bag.id.toNumber()
                  console.log(a)
                  return (
                    <tr key={key}>
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{this.props.usertype[bag.bank].name} <br /> {bag.bank} </td>
                      <td>{this.props.usertype[bag.owner].name} <br /> {bag.owner} </td>
                      <td>{bag.blood_group}</td>
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
        </form>
      </div>
    );
  }
}

export default Hospital;
import React, { Component } from 'react';
import './Admin.css'

class Hospital extends Component {

  render() {
    return (
      <div id="content" style={{ justifyContent: 'center', width: '100%' }}>
        <h1 className="head">Welcome <strong>Hospital.</strong></h1>
        <br />

        <form onSubmit={(event) => {
          event.preventDefault()
          const quan = event.target[0].value
          const bg = event.target[1].value
          // const donor_name = event.target[1].values
          this.props.showInv(quan, bg)
        }}>
          <div className="form-group row">
            <label className="col-md-2 col-form-label"> <h6>Number of Bags :</h6> </label>
            <div className="col-sm-10">
              <input
                id="quantity"
                type="text"
                ref={(input) => { this.Quantity = input }}
                className="form-control"
                placeholder="Quanitiy of Bags to be ordered"
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-md-2 col-form-label"> <h6>Blood Group :</h6> </label>
            <div className="col-sm-10">
              <input
                id="bg"
                type="text"
                ref={(input) => { this.bg = input }}
                className="form-control"
                placeholder="Blood Group selected"
              />
            </div>
          </div>

          <button style={{ justifyContent: 'center' }} type="submit" className="btn btn-primary">Show Options</button>
        </form>

        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <form onSubmit = {(event) => {
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
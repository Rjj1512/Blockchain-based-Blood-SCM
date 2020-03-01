import React, { Component } from 'react';
import './Admin.css';

class Admin extends Component {

    render() {
      return (
        <div id="content" style={{justifyContent:'center', width:'100%'}}>
          <h1 className="head">Welcome <strong>Admin.</strong></h1>
        <br/>
        <h3>Add Bank</h3>
        <div className="button-container" >
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = event.target[0].value
          const address = event.target[1].value
          this.props.createBank(address, name)
        }}>
          <div className="form-group mr-sm-2">
            <input 
              id="userName"
              type="text"
              ref={(input) => { this.userName = input }}
              className="form-control"
              placeholder="User Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="userAddress"
              type="text"
              ref={(input) => { this.userAddress = input }}
              className="form-control"
              placeholder="User Address"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Bank</button>
        </form>
        </div>
        <br/>
        <p>&nbsp;</p>
        <h3>Add Hospital</h3>
        <div className="button-container">
        <form className="form-inline" onSubmit={(event) => {
          event.preventDefault()
          const name = event.target[0].value
          const address = event.target[1].value
          this.props.createHosp(address,name)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="userName"
              type="text"
              ref={(input) => { this.userName = input }}
              className="form-control"
              placeholder="User Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="userAddress"
              type="text"
              ref={(input) => { this.userAddress = input }}
              className="form-control"
              placeholder="User Address"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Hospital</button>
        </form>
        </div>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">User Type</th>
            </tr>
          </thead>
          <tbody id="User list">
            { this.props.users.reverse().slice(0,10).map((user, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{user.id.toString()}</th>
                  <td>{user.name}</td>
                  <td>{user.user_address}</td>
                  <td>{user.user}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      
      );
    }
  }
  
  export default Admin;
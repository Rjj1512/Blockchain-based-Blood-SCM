import React, { Component } from 'react';
import ReactDOM from "react-dom";
import './Admin.css';
import './List.css';

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {show: false, filter: ''}
  }

  showModal = () => {
    console.log("here")
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  changeFilter = (type) => {
    this.setState({ filter: type})
  }

    render() {
      return (
        <div id="content" style={{justifyContent:'center', width:'100%'}}>
          <h1 className="head">Welcome <strong>Admin.</strong></h1>
        <br/>
        <List users = {this.props.users} show={this.state.show}
         handleClose={this.hideModal} 
         filter={this.state.filter} changeFilter={this.changeFilter}>
        </List>
        <button className="btn btn-primary float-right" style={{backgroundColor: 'green', display: 'flex', justifyContent: 'right'}} type="button" onClick={this.showModal}>
          Show donor list
        </button>
        <h3>Add Bank</h3>
        <div className="button-container" >
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = event.target[0].value
          const address = event.target[1].value
          const city = event.target[2].value
          this.props.createBank(address, name, city.toLowerCase())
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
          <div className="form-group mr-sm-2">
            <input
              id="userCity"
              type="text"
              ref={(input) => { this.userCity = input}}
              className="form-control"
              placeholder="User City"
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
          const city = event.target[2].value
          this.props.createHosp(address,name,city.toLowerCase())
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
          <div className="form-group mr-sm-2">
            <input
              id="userCity"
              type="text"
              ref={(input) => { this.userCity = input }}
              className="form-control"
              placeholder="User City"
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
              <th scope="col">User City</th>
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
                  <td>{user.city.charAt(0).toUpperCase() + user.city.slice(1)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      
      );
    }
  }
  
  const List = ({ handleClose, show, users, filter, changeFilter}) => {
  const showHideClassname = show ? "modal display-block" : "modal display-none";
  var i = 0
  return (
      <div className={showHideClassname}>
      <section className="modal-main">
      <p>&nbsp;</p>
      <div>
      <form class='form-inline' onSubmit={(event) => {
          event.preventDefault()
          const type = event.target[0].value
          changeFilter(type)
        }}>
          <div className="form-group mr-sm-2">
            <input 
              id="bloodtype"
              type="text"
              className="form-control"
              placeholder="Blood Type" />
          </div>        
          <button type="submit" className="btn btn-primary">Apply Filter</button>
        </form>
        </div>
        <br/>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Number</th>
            <th scope="col">Blood group</th>
          </tr>
        </thead>
        <tbody id="User list">
          {users.reverse().map((user, key) => {
            console.log(user.user)
            if (user.user_type != 1){
              return true
            }
            if (filter !=''){
              if (user.blood_group != filter) {
                return true
              }
            }
            console.log(filter,user.blood_group)
              i = i+1
            return(
              <tr key={key}>
                <th scope="row">{i}</th>
                <td>{user.name}</td>
                <td>{user.number}</td>
                <td>{user.blood_group}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
          <button className="btn btn-primary" 
          style={{margin:'auto', display: 'block',backgroundColor: 'red', display: 'flex', justifyContent: 'center'}}
           onClick={handleClose}>close</button>
          <br/>
      </section>
      </div>
  );
};
  const container = document.createElement("div");
  document.body.appendChild(container);
  export default Admin;
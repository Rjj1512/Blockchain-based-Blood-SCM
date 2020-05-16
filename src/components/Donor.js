import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import './Admin.css';
import './Donor.scss';
import Parser from 'html-react-parser';
import ReactNotification from 'react-notifications-component'
import {store} from 'react-notifications-component'
import 'animate.css/animate.css'
import 'react-notifications-component/dist/theme.css'


class Donor extends Component {  
  render() {
    return (
      <div id="content" style={{justifyContent:'center', width:'100%'}}>

        <div>
        <ReactNotification/>

        {console.log(this.props.notification," see")}
        {this.props.notification.map((bag, key) => {
          console.log(bag.toString()," bag")
          var use = bag.toString()
          console.log(use)
          store.addNotification({
            title: "Congratulations!",
            message: "Your blood bag no: " + use + " has been used. Thank you for donating",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        })}
      </div>
        <h1 className="head">Welcome <strong>{this.props.usertype[this.props.account].name}.</strong></h1>
        <div>
            <button
              className="btn btn-primary"
              onClick={(event) => {
                this.props.gotIt();
              }}>Clear notifications ?</button>
        </div>
        <p>&nbsp;</p>
        <h3 >Your BloodBags</h3>
        <br/>
            { this.props.bloodbags.reverse().slice(0,10).map((bag, key) => {
              const expiry = (new Date(bag.expiry * 1000)).toJSON().slice(0,10)
              const trig = '<h4 > Bag ID :- ' + (bag.id).toString() + ' <h4> <h6>click to view details</h6>'
              if (bag.donor === this.props.account){
              return(
                <Collapsible 
                triggerStyle={{ background: 'darkgray' }}
                triggerClassName="CustomTriggerCSS"
                triggerOpenedClassName="CustomTriggerCSS--open"
                contentOuterClassName="CustomOuterContentCSS"
                contentInnerClassName="CustomInnerContentCSS"
                transitionTime={400} easing={'cubic-bezier(0.175, 0.885, 0.32, 2.275)'} trigger={Parser(trig)}>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Collector Bank</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Blood Group</th>
                      <th scope="col">Expiry Status</th>
                      <th scope="col">Usage Status</th>
                    </tr>
                  </thead>
          
                  <tbody id="Blood bag list">
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{bag.bank}</td>
                      <td>{bag.owner}</td>
                      <td>{bag.blood_group}</td>
                      <td>{bag.expired ? "true" : expiry < new Date().toJSON().slice(0,10) ? "true" : "false"}</td>
                      <td>{bag.used.toString()}</td>
                  </tbody>
                </table>
                </Collapsible>
              )
              }
            })} 
      </div>
      
    );
  }
}

export default Donor;

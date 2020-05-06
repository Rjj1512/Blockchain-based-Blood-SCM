import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import './Admin.css';
import './Donor.scss';
import Parser from 'html-react-parser';

class Donor extends Component {

  
  render() {
    return (
      <div id="content" style={{justifyContent:'center', width:'100%'}}>
        <h1 className="head">Welcome <strong>Donor.</strong></h1>
        <h3 >Your BloodBags</h3>
        <br/>
          {/* {console.log(this.props.donorbags)} */}
            { this.props.bloodbags.reverse().slice(0,10).map((bag, key) => {
              const expiry = (new Date(bag.expiry * 1000)).toString()
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
                      <th scope="col">Expiry</th>
                    </tr>
                  </thead>
          
                  <tbody id="Blood bag list">
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{bag.bank}</td>
                      <td>{bag.owner}</td>
                      <td>{bag.blood_group}</td>
                      <td>{expiry.slice(0,25)}</td>
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

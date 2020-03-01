import React, { Component } from 'react';
import './Admin.css';

class Hospital extends Component {

    render() {
      return (
        <div id="content" style={{justifyContent:'center', width:'100%'}}>
          <h1 className="head">Welcome <strong>Hospital.</strong></h1>
        </div>
      );
    }
  }
  
  export default Hospital;
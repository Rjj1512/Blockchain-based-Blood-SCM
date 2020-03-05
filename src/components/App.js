import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Blood from '../abis/Blood.json'
import Navbar from './Navbar'
import Donor from './Donor'
import Bank from './Bank'
import Hospital from './Hospital'
import Admin from './Admin'

class App extends Component {


  // var d = new Date(1382086394000);
  // alert(d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear());

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Blood.networks[networkId]
    if(networkData) {
      const blood = web3.eth.Contract(Blood.abi, networkData.address)
      this.setState({ blood })
      const bagCount = await blood.methods.bagCount().call()
      this.setState({ bagCount })
      const userCount = await blood.methods.userCount().call()
      this.setState({ userCount: userCount })
      // Load bloodbags
      for (var i = 1; i <= bagCount; i++) {
        const bag = await blood.methods.bloodbags(i).call()
        this.setState({
          bloodbags: [...this.state.bloodbags, bag]
        })
      }
      // console.log(this.state.bloodbags)
      // Load users
      for (var i = 1; i <= userCount; i++) {
        const user = await blood.methods.users(i).call()
        this.setState({
          users: [...this.state.users, user]
        })
      }
      // Load usertype mapping
      for (var i = 1; i <= userCount; i++) {
        const user = await blood.methods.users(i).call()
        const address = user.user_address
        this.setState(prevState => ({
          usertype: {                   // object that we want to update
              ...prevState.usertype,    // keep all other key-value pairs
              [address]: user       // update the value of specific key
          }
      }))
      }
      const account_type = await blood.methods.usertype(accounts[0]).call()
      console.log(accounts[0])
      console.log(account_type)
      this.setState({ acc_type: account_type.user_type.toNumber() })
      this.setState({ loading: false})
      // Load Donor bags
      if(this.state.acc_type == 1){
        const arr = await blood.methods.getDbags(this.state.account).call()
        const len = arr.length
        // console.log(this.state.bloodbags[1])
        // console.log(arr[0].toNumber(),arr[1].toNumber(),arr[2].toNumber())
        for (var i = 0; i < len; i++) {
          this.setState({
            donorbags: [...this.state.donorbags, this.state.bloodbags[arr[i].toNumber()]]
          })
        }
      }
      // console.log ho ja bhai
    } else {
      window.alert('Contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      bagCount: 0,
      bloodbags: [],
      donorbags: [],
      users: [],
      usertype: {},
      loading: true
    }

    this.createBloodbag = this.createBloodbag.bind(this)
    this.createBank = this.createBank.bind(this);
    this.createHosp = this.createHosp.bind(this);
  }

  createBloodbag(donor, donor_name, bloodgroup, exp) {
    var today = new Date().getTime();
    var donation = Math.round(today / 1000);
    var expiry = donation + 86400*exp;
    this.setState({ loading: true })
    this.state.blood.methods.createBloodbag(donation, donor, donor_name, bloodgroup, expiry).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  createBank(bank, name) {
    this.setState({ loading: true })
    this.state.blood.methods.createBank(bank,name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  createHosp(hosp, name) {
    this.setState({ loading: true })
    this.state.blood.methods.createHosp(hosp,name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    const acc_type = this.state.acc_type;
    let dothis;

    if (acc_type === 1) {
      console.log(this.state.donorbags)
      dothis = <Donor
                bloodbags={this.state.bloodbags}
                account={this.state.account} />;
    } else if(acc_type === 2) {
      dothis = <Bank
                bags={this.state.bloodbags}
                users={this.state.users}
                usertype={this.state.usertype}
                account={this.state.account}
                createBloodbag={this.createBloodbag} />;
    } else if(acc_type === 3){
      dothis = <Hospital
                donorbags={this.state.donotbags}
                createBloodbag={this.createBloodbag} />;
    } else if(acc_type === 14){
      dothis = <Admin
                users={this.state.users}
                createBank={this.createBank}
                createHosp={this.createHosp} />;
    } else {
      dothis = <h1>I'm sorry, you are not an authorized user for this application.</h1>
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : dothis
              }
              {}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

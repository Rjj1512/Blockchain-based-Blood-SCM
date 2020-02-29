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
      // Load products
      for (var i = 1; i <= bagCount; i++) {
        const bag = await blood.methods.bloodbags(i).call()
        this.setState({
          bloodbags: [...this.state.bloodbags, bag]
        })
      }
      const account_type = await blood.methods.usertype(accounts[0]).call()
      this.setState({ acc_type: account_type.toNumber() })
      this.setState({ loading: false})
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
      loading: true
    }

    this.createBloodbag = this.createBloodbag.bind(this)
  }

  createBloodbag(donation, donor, bloodgroup, expiry, owner_name) {
    this.setState({ loading: true })
    this.state.blood.methods.createBloodbag(donation, donor, bloodgroup, expiry, owner_name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  render() {
    const acc_type = this.state.acc_type;
    let dothis;

    if (acc_type === 1) {
      dothis = <Donor
                donorbags={this.state.donorbags} />;
    } else if(acc_type === 2) {
      dothis = <Bank
                bags={this.state.bags}
                createBloodbag={this.createBloodbag} />;
    } else if(acc_type === 3){
      dothis = <Hospital
                donorbags={this.state.donotbags}
                createBloodbag={this.createBloodbag} />;
    } else if(acc_type === 14){
      dothis = <Admin/>;
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

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
        const bag = await blood.methods.bloodbags(i).call();
        console.log(bag.expired, "Expiration")
        this.setState({
          bloodbags: [...this.state.bloodbags, bag]
        })
      }
      console.log(this.state.bloodbags)
      // Load users
      for (i = 1; i <= userCount; i++) {
        const user = await blood.methods.users(i).call()
        this.setState({
          users: [...this.state.users, user]
        })
      }
      // Load usertype mapping
      for (i = 1; i <= userCount; i++) {
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
      if (account_type == null) {
        window.alert('You are not a valid user of the application')
      }
      else {
        this.setState({ acc_type: account_type.user_type.toNumber() })
      }
      console.log(accounts[0])
      console.log(this.state.acc_type,"type of user")
      
      this.setState({ loading: false})
      // Load Donor bags
      if(this.state.acc_type === 1){
        const arr = await blood.methods.getDbags(this.state.account).call()
        const len = arr.length
        // console.log(this.state.bloodbags[1])
        // console.log(arr[0].toNumber(),arr[1].toNumber(),arr[2].toNumber())
        for (i = 0; i < len; i++) {
          this.setState({
            donorbags: [...this.state.donorbags, this.state.bloodbags[arr[i].toNumber()]]
          })
          console.log("here are the donor bags")
          console.log(this.state.donorbags)
        }
        const arr2 = await blood.methods.getNotification(this.state.account).call()
        const len2 = arr2.length
        console.log("notif len ",len2)
        for (var i = 0; i < len2; i++) {
          const bag = arr2[i]
          console.log("bag",bag)
          this.setState({
          notification: [...this.state.notification, bag]
        })
        console.log("notif len", len)
        console.log("here are the used bags")
        console.log(this.state.notification)
        }
      } 
      else if(this.state.acc_type === 14) {
        const exp = [];
        for (var i = 1; i <= bagCount; i++) {
          const bag = await blood.methods.bloodbags(i).call()
          const expiry = (new Date(bag.expiry * 1000))
          if(!bag.used) {
            if(expiry.toJSON().slice(0,10) < new Date().toJSON().slice(0,10) && !bag.expired) {
              exp.push(bag.id.toNumber());
            }
          } 
        }
        const s = exp.length;
        if(s > 0) {
          const v = await blood.methods.expiredBag(exp, s).send({from : this.state.account});
          console.log(v.toNumber() == exp.length);
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
      notification: [],
      usertype: {},
      loading: true
    }

    this.createBloodbag = this.createBloodbag.bind(this)
    this.createBank = this.createBank.bind(this);
    this.h_placeOrder = this.h_placeOrder.bind(this);
    this.createHosp = this.createHosp.bind(this);
    this.showInv = this.showInv.bind(this);
    this.useBag = this.useBag.bind(this);
    this.gotIt = this.gotIt.bind(this);

  }

  createBloodbag(donor, donor_name, donor_number, bloodgroup, exp, city) {
    var today = new Date().getTime();
    var donation = Math.round(today / 1000);
    var expiry = donation + 86400*exp;
    this.setState({ loading: true })
    this.state.blood.methods.createBloodbag(donation, donor, donor_name, donor_number, bloodgroup, expiry, city).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  createBank(bank, name, city) {
    this.setState({ loading: true })
    this.state.blood.methods.createBank(bank,name, city).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  createHosp(hosp, name, city) {
    this.setState({ loading: true })
    this.state.blood.methods.createHosp(hosp,name, city).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  h_placeOrder(id) {
    this.setState({ loading: true})
    const price = window.web3.utils.fromWei('15000000000000000000', 'Ether')
    console.log(id)
    this.state.blood.methods.h_placeOrder(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false})
    })
  }

  showInv( quantity, bloodgroup ) {
    this.setState({ loading: true})
    console.log("Bag count is :");
    const len = this.state.bagCount
    for (let i =0; i < len.toNumber(); i++){
    }
  }

  useBag(id) {
    this.setState({ loading: true})
    console.log(id)
    this.state.blood.methods.useBag(id).send({ from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  gotIt() {
    this.setState({ loading: true})
    this.state.blood.methods.gotIt().send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({loading: false })
    })
  }

  render() {
    const acc_type = this.state.acc_type;
    let dothis;

    if (acc_type == 1) {
      console.log(this.state.donorbags)
      dothis = <Donor
                bloodbags={this.state.bloodbags}
                usertype={this.state.usertype}
                notification={this.state.notification}
                gotIt={this.gotIt}
                account={this.state.account} />;
    } else if(acc_type == 2) {
      dothis = <Bank
                bags={this.state.bloodbags}
                users={this.state.users}
                usertype={this.state.usertype}
                account={this.state.account}
                createBloodbag={this.createBloodbag} />;
    } else if(acc_type == 3){
      dothis = <Hospital
                donorbags={this.state.donorbags}
                bags={this.state.bloodbags}
                users={this.state.users}
                usertype={this.state.usertype}
                account={this.state.account}
                useBag = {this.useBag}
                h_placeOrder = {this.h_placeOrder}
                showInv = {this.showInv}
                createBloodbag={this.createBloodbag} />;
    } else if(acc_type == 14){
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

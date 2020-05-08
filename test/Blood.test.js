const Blood = artifacts.require("./Blood.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Blood', ([donor, bank, hosp, admin, bank2, hosp2]) => {
  let blood

  before(async () => { 
    blood = await Blood.deployed()
  }) 

  describe('deployment', async() => {
      it('deployed successfully', async() =>{
          const address = await blood.address
          assert.notEqual(address, 0x0)
          assert.notEqual(address, '')
          assert.notEqual(address, null)
          assert.notEqual(address, undefined)
      })
  })

  describe('Bloodbags', async () => {
    let result, bagCount, donation, expiry, event

    before(async () => {
      const a = await blood.usertype(admin).user_type
      console.log(await blood.usertype(admin))
      // console.log(a.toNumber())
      await blood.createBank(bank, "Lilavati blood bank", {from: admin}) // Bank and Hospital added using admin
      await blood.createBank(bank2, "Jamnavati blood bank", {from: admin})
      await blood.createHosp(hosp, "Jaslok hospital", {from: admin})
      await blood.createHosp(hosp2, "Cooper hospital", {from: admin})
      var one_day = 3600*24
      donation = Date.now()
      expiry = donation+(30*one_day)
      await blood.createBloodbag(donation, donor, "Pranav", "A+", expiry, { from: bank2 })
      await blood.createBloodbag(donation, donor, "Deep", "AB-", expiry, { from: bank2 })
      await blood.createBloodbag(donation, donor, "Rahil", "O-", expiry, { from: bank })
      await blood.createBloodbag(donation, donor, "","AB-", expiry, { from: bank2 })

      result = await blood.createBloodbag(donation, donor, "Pranav", "A+", expiry, { from: bank })
      bagCount = await blood.bagCount()
    })

    it('creates bags', async () => {
      // SUCCESS
      assert.equal(bagCount, 5)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), bagCount.toNumber(), 'id is correct')
      assert.equal(event.donation_date.toNumber(), donation, 'donation_date is correct')
      assert.equal(event.donor, donor, 'donor is correct')
      assert.equal(event.bank, bank, 'bank is correct')
      assert.equal(event.blood_group, "A+", 'blood group is correct')
      assert.equal(event.expiry.toNumber(), expiry, 'expiry is correct')
      assert.equal(event.owner, bank, 'owner is correct')

      // FAILURE: Product must have a name
      await blood.createBloodbag(donation, "0x0", "A+", expiry,
      "Lilavati blood bank", { from: bank }).should.be.rejected;
      // FAILURE: Product must have a price
      await blood.createBloodbag(donation, donor, "", expiry,
      "Lilavati blood bank", { from: bank }).should.be.rejected;
    })

    it('get donors bags', async () => {
      const arr = await blood.getDbags(donor);
      const len = arr.length;
      var i;

      for(i=0; i<len; i++) {
        const ind = arr[i];
        event = await blood.bloodbags(ind);
        assert.equal(event.donor, donor, 'donor is correct')
        console.log(event.id);
      }
    })
  })

  describe('Hospital', async() =>{
    let event, ev2, bag

    before(async () => {
      await blood.h_placeOrder(3, { from: hosp, value: web3.utils.toWei('1', 'Ether')})
    })

    it('shows inventory', async() => {
      event = await blood.getHbags(hosp, { from: hosp})
      await blood.useBag(event[0], { from: hosp})
      ev2 = await blood.getHbags(hosp, { from: hosp})
      console.log(ev2[0].toNumber())
      bag = await blood.bloodbags(ev2[0].toNumber())
      console.log(await bag.used)
      console.log(await blood.getNotification(donor))
      await blood.gotIt({from: donor})
      console.log(await blood.getNotification(donor))
    })
  })
})
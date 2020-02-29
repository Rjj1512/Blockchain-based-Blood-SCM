const Blood = artifacts.require("./Blood.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Blood', ([donor, bank, hosp, admin, bank2]) => {
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
      const a = await blood.usertype(admin)
      console.log(a.toNumber())
      await blood.createBank(bank, {from: admin}) // Bank and Hospital added using admin
      await blood.createBank(bank2, {from: admin})
      await blood.createHosp(hosp, {from: admin})
      var one_day = 3600*24
      donation = Date.now()
      expiry = donation+(30*one_day)
      await blood.createBloodbag(donation, donor, "AB+", expiry, "Jamnavati blood bank", { from: bank2 })
      result = await blood.createBloodbag(donation, donor, "A+", expiry, "Lilavati blood bank", { from: bank })
      bagCount = await blood.bagCount()
    })

    it('creates bags', async () => {
      // SUCCESS
      assert.equal(bagCount, 2)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), bagCount.toNumber(), 'id is correct')
      assert.equal(event.donation_date.toNumber(), donation, 'donation_date is correct')
      assert.equal(event.donor, donor, 'donor is correct')
      assert.equal(event.bank, bank, 'bank is correct')
      assert.equal(event.blood_group, "A+", 'blood group is correct')
      assert.equal(event.expiry.toNumber(), expiry, 'expiry is correct')
      assert.equal(event.owner_name, "Lilavati blood bank", 'owner_name is correct')
      assert.equal(event.owner, bank, 'owner is correct')

      // FAILURE: Product must have a name
      await blood.createBloodbag(donation, "0x0", "A+", expiry,
      "Lilavati blood bank", { from: bank }).should.be.rejected;
      // FAILURE: Product must have a price
      await blood.createBloodbag(donation, donor, "", expiry,
      "Lilavati blood bank", { from: bank }).should.be.rejected;
    })

    it('get donors bags', async () => {
      const arr = await blood.getArray(donor);
      const len = arr.length;
      var i;

      for(i=0; i<len; i++) {
        const ind = await blood.donors(donor,i);
        event = await blood.bloodbags(ind);
        assert.equal(event.donor, donor, 'donor is correct')
        console.log(event);
      }
    })

  })

  describe('Hospital', async() =>{
    let event, donation, expiry

    before(async () => {
      var one_day = 3600*24
      donation = Date.now()
      expiry = donation+(30*one_day)
      await blood.createBloodbag(donation, donor, "A+", expiry, "Baap hospital", { from: hosp })
      await blood.createBloodbag(donation, donor, "AB-", expiry, "Baap hospital", { from: hosp })
    })

    it('shows inventory', async() => {
      console.log(await blood.getHbags(hosp))
    })
  })

})
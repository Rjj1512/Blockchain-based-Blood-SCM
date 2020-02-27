const Blood = artifacts.require("./Blood.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Blood', ([donor, bank, hosp]) => {
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

      it('Has a name', async() => {

  })
})
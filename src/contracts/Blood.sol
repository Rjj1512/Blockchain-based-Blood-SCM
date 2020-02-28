pragma solidity >=0.4.21 <0.6.0;


contract DateTime {
        function getYear(uint timestamp) public returns (uint16);
        function getMonth(uint timestamp) public returns (uint8);
        function getDay(uint timestamp) public returns (uint8);
}

contract Blood{
    uint public today;
    address public dateTimeAddr = 0x66eDEfff0A0c87bA4ca2b8E73BB05787eb35908E;
    address payable public admin = address(0x66eDEfff0A0c87bA4ca2b8E73BB05787eb35908E);
    DateTime dateTime = DateTime(dateTimeAddr);
    uint[] public temp_array;
    string public name;
    uint public bagCount = 0;
    uint public h_bagCount = 0;
    mapping(uint => Bloodbag) public bloodbags; // This is the general list of bloodbags.
    mapping(address => uint[]) public donors; // Bloodbags corresponding to donors stored here.
    mapping(uint => Bloodbag) public hBags; // This is the general list of bloodbags.
    mapping(address => uint) public usertype; // This mapping is to identify the type of user using the website, i.e
                                              // (1 = donor, 2 = bank and 3 = hospital)
    function getArray(address _donor) public view returns (uint256[] memory) {
        return donors[_donor];
    }

    struct Bloodbag {
        uint id;
        uint donation_date;
        address payable donor;
        address payable bank;
        string blood_group;
        uint expiry;
        string owner_name;
        address payable owner;
        uint price;
    }

    event BagCreated(
        uint id,
        uint donation_date,
        address payable donor,
        address payable bank,
        string blood_group,
        uint expiry,
        string owner_name,
        address payable owner,
        uint price
    );

    event message(string message);

    constructor() public{
        name = "Deeeeep";
        init_hBags();
    }

    function createBloodbag(uint _donation_date, address payable _donor,
     string memory _blood_group, uint _expiry, string memory _owner_name) public {
        // Require valid params
        require(usertype[msg.sender] == 2, "Not a blood bank.");
        require(bytes(_owner_name).length > 0, "error in name");
        require(bytes(_blood_group).length > 0, "error in blood group");
        require(_donation_date > 0, "error in d_date");
        require(_expiry > _donation_date, "error in exp_date");
        require(_donor != address(0), "error in donor");
        // Increment bag count
        bagCount ++;
        // Date related stuff
        // Set donor id = 1 if not already exists.
        usertype[_donor] = 1;
        // Create the Blood bag
        Bloodbag memory temp_bloodbag = Bloodbag(bagCount, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender, 10);
        bloodbags[bagCount] = temp_bloodbag;
        donors[_donor].push(temp_bloodbag.id);
        // Trigger an event
        emit BagCreated(bagCount, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender, 10);
    }

    function createBank(address _bank) public {
        require(msg.sender == admin,"Not an admin");
        require(_bank != address(0),"No bank address");
        usertype[_bank] = 2;
    }

    function createHosp(address _hosp) public {
        require(msg.sender == admin,"Not an admin");
        require(_hosp != address(0),"No hosp address");
        usertype[_hosp] = 3;
    }

    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
    function init_hBags() public {
        uint one_day = 3600*24;
        // donation = Date.now()
        uint expiry = now + (30*one_day);
        for (uint i = 0; i < 3; i++) {
            hBags[i] = Bloodbag(i+20, now + i, admin, admin, 'A', expiry, 'Admin Hospital', admin, 5);
            h_bagCount ++;
        }
        name = 'Back to 2';
    }


    function h_showInventory(string memory _bg) public returns(uint[] memory){
        if (bytes(_bg).length != 0){
            for(uint j = 0; j < h_bagCount; j++ ){
                if (compareStrings(_bg, hBags[j].blood_group)){
                    temp_array.push(hBags[j].id);
                }
            }
            return temp_array;
        } else {
            for(uint j = 0; j < h_bagCount; j++ ){
                    temp_array.push(hBags[j].id);
            }
            return temp_array;
        }
    }

    // function h_placeOrder() public {

    // }

    // function bb_accept_order() public {

    // }


}
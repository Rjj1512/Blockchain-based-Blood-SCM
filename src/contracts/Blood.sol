pragma solidity >=0.4.21 <0.6.0;


contract DateTime {
        function getYear(uint timestamp) public returns (uint16);
        function getMonth(uint timestamp) public returns (uint8);
        function getDay(uint timestamp) public returns (uint8);
}

contract Blood {
    uint public today;
    address public dateTimeAddr = 0x37BAb999e4c362BDE56d9fC1BA7bA36306f3dAa5;
    address public admin = address(0x37BAb999e4c362BDE56d9fC1BA7bA36306f3dAa5);
    DateTime dateTime = DateTime(dateTimeAddr);

    string public name;
    uint public bagCount = 0;
    mapping(uint => Bloodbag) public bloodbags; // This is the general list of bloodbags.
    mapping(address => uint[]) public donors; // Bloodbags corresponding to donors stored here.
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
    }

    event BagCreated(
        uint id,
        uint donation_date,
        address payable donor,
        address payable bank,
        string blood_group,
        uint expiry,
        string owner_name,
        address payable owner
    );

    event message(string message);

    constructor() public{
        name = "Pranav Gor";
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
        _owner_name, msg.sender);
        bloodbags[bagCount] = temp_bloodbag;
        donors[_donor].push(temp_bloodbag.id);
        // Trigger an event
        emit BagCreated(bagCount, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender);
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
}
pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

// contract DateTime {
//         function getYear(uint timestamp) public returns (uint16);
//         function getMonth(uint timestamp) public returns (uint8);
//         function getDay(uint timestamp) public returns (uint8);
// }

contract Blood{
    // uint public today;
    // address public dateTimeAddr = 0x66eDEfff0A0c87bA4ca2b8E73BB05787eb35908E;
    address payable public admin = address(0x993ea21A23fE094aF6D053000EB022dEcd83C513);
    address payable public hospi = address(0x7340C15749cD4efbf70034D565d82b7d908860E2);
    // DateTime dateTime = DateTime(dateTimeAddr);
    string public name;
    uint public bagCount = 0;
    uint public userCount = 0;
    mapping(uint => Bloodbag) public bloodbags; // This is the general list of bloodbags.
    mapping(address => uint[]) public donors; // Bloodbags corresponding to donors stored here.
    mapping(address => uint[]) public hospitals; // Bloodbags corresponding to hospitals stored here.
    mapping(address => User) public usertype; // This mapping is to identify the type of user using the website, i.e
                                              // (1 = donor, 2 = bank and 3 = hospital)
    mapping(uint => User) public users; // List of all users
    function getDbags(address payable _donor) public view returns (uint256[] memory) {
        return donors[_donor];
    }

    function getHbags(address payable _hospital) public view returns (uint256[] memory) {
        return hospitals[_hospital];
    }

    // ALL STRUCTS

    struct User {
        uint id;
        uint user_type;
        string user;
        address payable user_address;
        string name;
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
        // uint price;
    }

    // ALL STRUCTS END

    event BagCreated(
        uint id,
        uint donation_date,
        address payable donor,
        address payable bank,
        string blood_group,
        uint expiry,
        string owner_name,
        address payable owner
        // uint price
    );

    event message(string message);
    event arr(uint[] array);

    event bagPurchased(
        uint id,
        uint donation_date,
        address payable donor,
        address payable bank,
        string blood_group,
        uint expiry,
        string owner_name,
        address payable owner
        // uint price
    );

    constructor() public{
        name = "Pranav Gor";
        userCount ++;
        usertype[admin] = User(userCount, 14, "Admin", admin, "Pranav");
        users[userCount] = User(userCount, 14, "Admin", admin, "Pranav");
    }

    function createBloodbag(uint _donation_date, address payable _donor, string memory _donor_name,
     string memory _blood_group, uint _expiry) public {
        // Require valid params
        string memory d_name = _donor_name;
        require(usertype[msg.sender].user_type == 2, "Not a blood bank.");
        if(bytes(d_name).length == 0){
            d_name = usertype[_donor].name;
        }
        require(bytes(d_name).length > 0, "Please input name");
        require(bytes(_blood_group).length > 0, "error in blood group");
        require(_donation_date > 0, "error in d_date");
        require(_expiry > _donation_date, "error in exp_date");
        require(_donor != address(0), "error in donor");
        // Increment bag count
        bagCount ++;
        // Date related stuff
        // Add donor and set type = 1 if not already exists.
        if (usertype[_donor].id == 0){
            userCount++;
            usertype[_donor] = User(userCount, 1, "Donor", _donor, d_name);
            users[userCount] = User(userCount, 1, "Donor",_donor, d_name);
        }
        // Create the Blood bag
        string memory _owner_name = usertype[msg.sender].name;
        Bloodbag memory temp_bloodbag = Bloodbag(bagCount, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender);
        bloodbags[bagCount] = temp_bloodbag;
        // add bag to specific donor's list
        donors[_donor].push(temp_bloodbag.id);
        // Trigger an event
        emit BagCreated(bagCount, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender);
    }

    function createBank(address payable _bank, string memory _name) public {
        require(msg.sender == admin,"Not an admin");
        require(_bank != address(0),"No bank address");
        userCount++;
        usertype[_bank] = User(userCount, 2, "Bank",_bank, _name);
        users[userCount] = User(userCount, 2, "Bank",_bank, _name);
    }

    function createHosp(address payable _hosp, string memory _name) public {
        require(msg.sender == admin,"Not an admin");
        require(_hosp != address(0),"No hosp address");
        userCount++;
        usertype[_hosp] = User(userCount, 3, "Hospital",_hosp, _name);
        users[userCount] = User(userCount, 3, "Hospital",_hosp, _name);
    }

    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }

    function h_placeOrder(uint bag_id) public payable {
        // Fetch the owner
        address payable _seller = bloodbags[bag_id].owner;
        require(msg.value > 1, 'Wrong price paid');
        require(usertype[msg.sender].user_type == 3, 'Unauthorized transaction originator');
        address(_seller).transfer(msg.value);
        //Transfer ownership
        bloodbags[bag_id].owner = msg.sender;
        bloodbags[bag_id].owner_name = usertype[msg.sender].name;
        Bloodbag memory _bloodbag = bloodbags[bag_id];
        hospitals[msg.sender].push(_bloodbag.id);
        emit bagPurchased(_bloodbag.id, _bloodbag.donation_date, _bloodbag.donor, _bloodbag.bank,
         _bloodbag.blood_group,_bloodbag.expiry,_bloodbag.owner_name,_bloodbag.owner);
    }
}
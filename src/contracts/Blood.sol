pragma solidity >=0.4.21 <0.6.0;

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
    mapping(address => uint[]) public notification; // Stores pending notification for used bags of donors
    mapping(uint => User) public users; // List of all users

   /* function getBags() public view returns (mapping(uint=> Bloodbag) memory) {
        return bloodbags;
    }*/

    function getDbags(address payable _donor) public view returns (uint256[] memory) {
        return donors[_donor];
    }

    function getNotification(address payable _donor) public view returns (uint256[] memory) {
        return notification[_donor];
    }

    function getHbags(address payable _hospital) public view returns (uint256[] memory) {
        return hospitals[_hospital];
    }

    function expiredBag(uint256 bag_id) public returns (bool) {
        bloodbags[bag_id].expired = true;
        bloodbags[bag_id].used = false;
        //address donor = bloodbags[bag_id].donor;
        //notification[donor].push(bag_id);
        return bloodbags[bag_id].expired;
    }

    // ALL STRUCTS

    struct User {
        uint id;
        uint user_type;
        string user;
        address payable user_address;
        string name;
        string number;
        string blood_group;
        string city;
    }

    struct Bloodbag {
        uint id;
        bool used;
        bool expired;
        uint donation_date;
        address payable donor;
        address payable bank;
        string blood_group;
        uint expiry;
        string owner_name;
        address payable owner;
        string city;
    }

    // ALL STRUCTS END

    event BagCreated(
        uint id,
        bool used,
        bool expired,
        uint donation_date,
        address payable donor,
        address payable bank,
        string blood_group,
        uint expiry,
        string owner_name,
        address payable owner,
        string city
    );

    event message(string message);
    event arr(uint[] array);

    event bagPurchased(
        uint id,
        bool used,
        bool expired,
        uint donation_date,
        address payable donor,
        address payable bank,
        string blood_group,
        uint expiry,
        string owner_name,
        address payable owner,
        string city
    );

    constructor() public{
        name = "Pranav Gor";
        userCount ++;
        usertype[admin] = User(userCount, 14, "Admin", admin, "Pranav", '', '', "Mumbai");
        users[userCount] = User(userCount, 14, "Admin", admin, "Pranav", '', '', "Mumbai");
    }

    function createBloodbag(uint _donation_date, address payable _donor, string memory _donor_name,
     string memory _donor_number, string memory _blood_group, uint _expiry, string memory _city) public {
        // Require valid params
        string memory d_name = _donor_name;
        require(usertype[msg.sender].user_type == 2, "Not a blood bank.");
        if(bytes(d_name).length == 0){
            d_name = usertype[_donor].name;
        }
        require(bytes(d_name).length > 0, "Please input name");
        require(bytes(_blood_group).length > 0, "error in blood group");
        require(bytes(_city).length > 0, "Plese provide City name");
        require(_donation_date > 0, "error in d_date");
        require(_expiry > _donation_date, "error in exp_date");
        require(_donor != address(0), "error in donor");
        // Increment bag count
        bagCount ++;
        // Date related stuff
        // Add donor and set type = 1 if not already exists.
        if (usertype[_donor].id == 0){
            userCount++;
            usertype[_donor] = User(userCount, 1, "Donor", _donor, d_name,_donor_number, _blood_group, _city);
            users[userCount] = User(userCount, 1, "Donor", _donor, d_name, _donor_number, _blood_group, _city);
        }
        // Create the Blood bag
        string memory _owner_name = usertype[msg.sender].name;
        Bloodbag memory temp_bloodbag = Bloodbag(bagCount, false, false, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender, usertype[msg.sender].city);
        bloodbags[bagCount] = temp_bloodbag;
        // add bag to specific donor's list
        donors[_donor].push(temp_bloodbag.id);
        // Trigger an event
        emit BagCreated(bagCount, false, false, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender, usertype[msg.sender].city);
    }

    function createBank(address payable _bank, string memory _name, string memory _city) public {
        require(msg.sender == admin,"Not an admin");
        require(_bank != address(0),"No bank address");
        require(bytes(_name).length > 0, "Plese provide Bank name");
        require(bytes(_city).length > 0, "Plese provide City name");
        require(usertype[_bank].user_type != 2,"Bank already exists");
        userCount++;
        usertype[_bank] = User(userCount, 2, "Bank",_bank, _name, '', '', _city);
        users[userCount] = User(userCount, 2, "Bank",_bank, _name, '', '', _city);
    }

    function createHosp(address payable _hosp, string memory _name, string memory _city) public {
        require(msg.sender == admin,"Not an admin");
        require(_hosp != address(0),"No hosp address");
        require(bytes(_name).length > 0, "Plese provide Hospital name");
        require(bytes(_city).length > 0, "Plese provide City name");
        require(usertype[_hosp].user_type != 3,"Hospital Already exists");
        userCount++;
        usertype[_hosp] = User(userCount, 3, "Hospital",_hosp, _name, '', '', _city);
        users[userCount] = User(userCount, 3, "Hospital", _hosp, _name, '', '', _city);
    }

    function h_placeOrder(uint bag_id) public payable {
        // Fetch the owner
        address payable _seller = bloodbags[bag_id].owner;
        bool used = bloodbags[bag_id].used;
        bool expired = bloodbags[bag_id].expired;
        require(msg.value > 1, 'Wrong price paid');
        require(usertype[msg.sender].user_type == 3, 'Unauthorized transaction originator');
        address(_seller).transfer(msg.value);
        //Transfer ownership
        bloodbags[bag_id].owner = msg.sender;
        bloodbags[bag_id].owner_name = usertype[msg.sender].name;
        bloodbags[bag_id].city = usertype[msg.sender].city;
        Bloodbag memory _bloodbag = bloodbags[bag_id];
        hospitals[msg.sender].push(_bloodbag.id);
        emit bagPurchased(_bloodbag.id, used, expired, _bloodbag.donation_date, _bloodbag.donor, _bloodbag.bank,
         _bloodbag.blood_group,_bloodbag.expiry,_bloodbag.owner_name,_bloodbag.owner, _bloodbag.city);
    }

    function useBag(uint bag_id) public {
        require(usertype[msg.sender].user_type == 3, 'Unauthorized transaction originator');
        bloodbags[bag_id].used = true;
        bloodbags[bag_id].expired = false;
        address donor = bloodbags[bag_id].donor;
        notification[donor].push(bag_id);
    }

    function gotIt() public {
        require(usertype[msg.sender].user_type == 1, 'Unauthorized transaction originator');
        notification[msg.sender].length = 0;
    }
}

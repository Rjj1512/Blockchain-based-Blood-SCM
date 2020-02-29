pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

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
    uint public b_bagCount = 0;
    uint public h_bagCount = 0;
    mapping(uint => Bloodbag) public bloodbags; // This is the general list of bloodbags.
    mapping(address => uint[]) public donors; // Bloodbags corresponding to donors stored here.
    mapping(address => uint[]) public hospitals; // Bloodbags corresponding to hospitals stored here.
    mapping(address => uint) public usertype; // This mapping is to identify the type of user using the website, i.e
                                              // (1 = donor, 2 = bank and 3 = hospital)
    function getArray(address _donor) public view returns (uint256[] memory) {
        return donors[_donor];
    }

    function getHbags(address _hospital) public view returns (uint256[] memory) {
        return hospitals[_hospital];
    }

    function getTemp() public view returns (uint256[] memory) {
        return temp_array;
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
        usertype[admin] = 14;
        usertype[0x2eEB28e7Acec6f402ee207d82Ef1F7AABeDb312a] = 3;
        // init_hospitals
    }

    function createBloodbag(uint _donation_date, address payable _donor,
     string memory _blood_group, uint _expiry, string memory _owner_name) public {
        // Require valid params
        // require(usertype[msg.sender] == 2, "Not a blood bank.");
        require(bytes(_owner_name).length > 0, "error in name");
        require(bytes(_blood_group).length > 0, "error in blood group");
        require(_donation_date > 0, "error in d_date");
        require(_expiry > _donation_date, "error in exp_date");
        require(_donor != address(0), "error in donor");
        // Increment bag count
        bagCount ++;
        // Date related stuff
        // Set donor id = 1 if not already exists.
        if (usertype[_donor] == 0){
            usertype[_donor] = 1;
        }
        // Create the Blood bag
        Bloodbag memory temp_bloodbag = Bloodbag(bagCount, _donation_date, _donor, msg.sender, _blood_group, _expiry,
        _owner_name, msg.sender);
        bloodbags[bagCount] = temp_bloodbag;
        b_bagCount ++;
        // add bag to specific donor's list
        donors[_donor].push(temp_bloodbag.id);
            if (usertype[msg.sender] == 3){ //Hospital ne banaya
                hospitals[msg.sender].push(temp_bloodbag.id);
                h_bagCount ++;
                b_bagCount --;
            }
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

    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
    // function init_hospitals() public {
    //     uint one_day = 3600*24;
    //     // donation = Date.now()
    //     uint expiry = now + (30*one_day);
    //     created = Bloodbag(i+20, now + i, admin, admin, 'A', expiry, 'Admin Hospital', 0x2eEB28e7Acec6f402ee207d82Ef1F7AABeDb312a, 5)
    //     for (uint i = 0; i < 3; i++) {
    //         hospitals[0x2eEB28e7Acec6f402ee207d82Ef1F7AABeDb312a].push
    //             ();
    //     }
    //     name = 'Back to 2';
    // }


    // function h_showInventory(string memory _bg) public {
    //     address hosp = msg.sender;
    //     uint[] memory h_bags = getHbags(hosp);
    //     if (bytes(_bg).length != 0){
    //         for(uint j = 0; j < h_bags.length; j++ ){
    //             Bloodbag memory bb = bloodbags[h_bags[j]];
    //             if (compareStrings(_bg, bb.blood_group)){
    //                 temp_array.push(bb.id);
    //             }
    //         }
    //     } else {
    //         temp_array = getHbags(msg.sender);
    //     }
    // }
    Bloodbag[] public Allbags;
    Bloodbag[] temp;
    mapping(address => uint) counts;

    function getAllBags() public {
        for(uint k = 0; k < bagCount; k++){
            Allbags.push(bloodbags[k]);
        }
    }


    function filterBags(address _hosp, string memory _bg) public returns(Bloodbag[] memory) {
        getAllBags();
        for (uint i = 0; i < Allbags.length; i++){
            if ((Allbags[i].owner != _hosp) && (compareStrings(Allbags[i].blood_group, _bg))){
                temp.push(Allbags[i]);
            }
        }

        return temp;
    }
    bool[] visited;

    // function getCounts(Bloodbag[] memory _input, uint _leng) public {
    //     uint[] memory countsss;
    //     address[] memory list;
    //     for (uint i = 0; i <= _leng; i++ ){
    //         visited[i] = false;
    //     }

    //     for (uint i = 0; i < _leng; i++) {
    //     // Skip this element if already processed
    //         if (visited[i] == true)
    //             continue;

    //         // Count frequency
    //         uint count = 1;
    //         for (uint j = i + 1; j < _leng; j++) {
    //             if (_input[i].owner == _input[j].owner) {
    //                 visited[j] = true;
    //                 count++;
    //             }
    //         }
    //         countsss[i] = count;
    //         list[i] = _input.owner;
    //     }


    // }

    function h_placeOrder(address payable _hosp, address payable _bank,
     string memory _bg, uint _amount, string memory _name) public payable {
        Bloodbag[] memory temp1;
        temp1 = filterBags(_hosp, _bg);
        // bool f = false;
        // uint leng = temp1.length;
        // getCounts(temp1, leng);
        // Bloodbag[] memory finale;
        // mapping(address => uint) counts;
        require(_amount != 0, 'Number of Bags unspecified');
        require(msg.sender == _hosp, 'Unauthorized transaction originator');
        uint total = 10 * _amount;
        address(_bank).transfer(total);
        //we need to get the bank address and also the ID of the bags to be purchased, for further processing from Frontend
        // assuming we got two id here for an example:-
        uint[] memory _ids;
        _ids[0] = 2;
        _ids[1] = 4;
        for (uint i = 0; i < _ids.length; i++ ){
            Bloodbag memory b = bloodbags[_ids[i]];
            bloodbags[_ids[i]].owner = msg.sender;
            bloodbags[_ids[i]].owner_name = _name;
            emit bagPurchased(b.id, b.donation_date, b.donor, b.bank, b.blood_group,b.expiry,b.owner_name,b.owner);
        }
    }


}
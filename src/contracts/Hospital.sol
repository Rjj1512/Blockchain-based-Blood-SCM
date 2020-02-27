pragma solidity >=0.4.21 <0.6.6;

contract Hospital {
    //satic for now
    address payable public d = 0xFBd5f41D8817A1b779dF826D556658bE066e54C7;
    address payable public b = 0xBD7145686Cddccf191393b4852e81Ba5B2ffDC08;
    address payable public o = 0xf66406428ddb5dea2F506B19Fd5DadCCF135b950;
    address payable public h = 0xf66406428ddb5dea2F506B19Fd5DadCCF135b950;

    string public Hid;


    uint public bagcount = 0;
    uint public thresh = 3;
    mapping(uint => Bag) public bag;

    struct Bag{
        uint id;
        address payable donor;
        address payable bank;
        address payable owner;
        address payable hospital;
        string owner_name;
        uint expiry;
    }

    // Bag[] public bags;

    constructor() public {
        // for (uint i = 0; i <= thresh; i++){
        //     bagcount = bagcount + 1;
        //     bags.push(bagcount, d1, b, o, h, 'ABC hospital', 10);
        // }
        // for (uint i = 0; i <= thresh; i++){
        // bag[bagcount] = Bag(bagcount, d, b, o, h, 'ABC', 10);
        // bagcount ++;
        // }
        Hid = 'Hii there';
        
    }

}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract TipDonate {
    address public owner;
    uint256 public totalDonations;
    string[] public donors;
    mapping(address => bool) public donarAddress; // Changed to public for easier frontend checking
    
    mapping(string => uint) public currencies;
    mapping(string => bool) public isCurrencyThere;
    string[] public allowedCurrencies;
    uint256 public nextUpdateTime;

    constructor() {
        owner = msg.sender;
        nextUpdateTime = block.timestamp + 300;
    }

    event currencyCreated(string currency);
    event assignETH(string currency, uint amount);
    event donatedAmount(string name, uint amount);
    event updatePrices();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    function addNewCurrency(string memory currency) public  {
        require(!isCurrencyThere[currency], "Currency already exists");
        allowedCurrencies.push(currency);
        isCurrencyThere[currency] = true;
        emit currencyCreated(currency);
    }

    function setETHforCurrency(string memory currency, uint256 amount) public onlyOwner {
        require(isCurrencyThere[currency], "Currency does not exist");
        currencies[currency] = amount;
        emit assignETH(currency, amount);
    }

    // FIXED: Uses msg.value to track real money
    function donateAmount(string memory name) external payable {
        require(msg.value > 0, "Must send some ETH");
       // require(!donarAddress[msg.sender], "Already Donated");

        donors.push(name);
        totalDonations += msg.value;
        donarAddress[msg.sender] = true;

        emit donatedAmount(name, msg.value);
    }

    function withdrawAmount() public onlyOwner {
        uint256 totalAmt = address(this).balance;
        require(totalAmt > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: totalAmt}("");
        require(success, "Withdraw failed");
        
        totalDonations = 0; // Reset tracking
    }

    // UPDATED: Batch update handles the timer automatically
    function updateAllPrices(string[] memory _names, uint256[] memory _amounts) public onlyOwner {
        require(_names.length == _amounts.length, "Array mismatch");
        for (uint i = 0; i < _names.length; i++) {
            currencies[_names[i]] = _amounts[i];
        }
        nextUpdateTime = block.timestamp + 300; 
        emit updatePrices();
    }

    // View Functions
    function getCurrencies() public view returns (string[] memory) {
        return allowedCurrencies;
    }

    function getDonors() public view returns (string[] memory) {
        return donors;
    }
    function getCurrencyAmount(string memory _curr) public view returns(uint){
        require(isCurrencyThere[_curr]==true,"No currency Exist");
        return currencies[_curr];
    }
}
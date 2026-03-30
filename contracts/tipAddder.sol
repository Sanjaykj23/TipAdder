pragma solidity ^0.8.10;
contract TipDonate {
    address public owner;
    uint256 public totalDonations;
    string[] public donors;
    mapping(address => bool) donarAddress;
    uint totalNumberOfCurrencies;
    mapping(string => uint256) public currencies;
    mapping(string => bool) isCurrencyThere;
    string[] allowedCurrencies;
    uint nextUpdateTime;
    constructor() {
        owner = msg.sender;
        nextUpdateTime = block.timestamp + 300;
    }
    event currencyCreated(string currency);
    function addNewCurrency(string memory currency) public {
        require(isCurrencyThere[currency] == false, "Currency already exists");
        allowedCurrencies.push(currency);
        isCurrencyThere[currency] = true;
        totalNumberOfCurrencies++;
        emit currencyCreated(currency);
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Nota  Owner");
        _;
    }
    event assignETH(string currency, uint amount);
    function setETHforCurrency(string memory currency, uint amount) public {
        require(isCurrencyThere[currency] == true, "Currency was not exists");
        currencies[currency] = amount;
        emit assignETH(currency, amount);
    }
    event sendMoneyFromDonar(string currency, string name, uint amount);
    function sendMoney(
        string memory currency,
        string memory name,
        uint amount
    ) public {
        require(donarAddress[msg.sender] == false, "Already Donated");
        require(isCurrencyThere[currency] == true, "Currency was not Added");
        require(amount > 0, "No amount");
        emit sendMoneyFromDonar(currency, name, amount);
    }
    event donatedAmount(string name, uint amount);
    function donateAmount(uint amount, string memory name) external payable {
        donors.push(name);
        totalDonations += amount;
        donarAddress[msg.sender] = true;
        emit donatedAmount(name, amount);
    }
    function withdrawAmount() public onlyOwner {
        uint totalAmt = address(this).balance;
        require(totalAmt > 0, "There are no Donations!");
        (bool success, ) = msg.sender.call{value: totalAmt}("");
        require(success, "Transaction Failed!");
        totalDonations = 0;
    }
    function Currencies() public view returns (string[] memory) {
        return allowedCurrencies;
    }
    function currencyExist(string memory currency) public view returns (bool) {
        return isCurrencyThere[currency];
    }
    function getCurrencyAmount(
        string memory currency
    ) public view returns (uint256) {
        require(isCurrencyThere[currency] == true, "Currency was not Added");
        return currencies[currency];
    }
    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }
    function getDonors() public view returns (string[] memory) {
        return donors;
    }
    function getNextUpdateTime() public view returns (uint) {
        return nextUpdateTime;
    }
    function setNextUpdateTime() public {
        nextUpdateTime = block.timestamp + 300;
    }
    // New function to handle everything at once
    event updatePrices();
    function updateAllPrices(string[] memory _names,uint256[] memory _amounts) public onlyOwner {
        require(_names.length == _amounts.length, "Arrays must match");
        for (uint i = 0; i < _names.length; i++) {
            currencies[_names[i]] = _amounts[i];
        }
        //nextUpdateTime = block.timestamp + 300; 
        setNextUpdateTime();// Update the timer here too!
        emit updatePrices();
    }
}

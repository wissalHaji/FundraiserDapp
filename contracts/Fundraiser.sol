// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

// the address of the custodian is associated
// with the manager of the fundraiser assuming
// that the beneficiary use a service like coinbase
// in order to be able to sell received ether and
// does not have access to his private key in order to
// be able to withdraw

contract Fundraiser {
    using SafeMath for uint256;

    struct Donation {
        uint256 value;
        uint256 conversionFactor;
        uint256 date;
    }

    address private _owner;

    mapping(address => Donation[]) private _donations;
    event DonationReceived(address indexed donor, uint256 value);
    event Withdraw(uint256 amount);
    string public name;
    string public website;
    string public imageURL;
    string public description;
    address payable public beneficiary;
    uint256 public totalDonations = 0;
    uint256 public donationsCount = 0;

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    // Need this function when the contract is created
    // by a clone factory
    function init(
        string memory _name,
        string memory _website,
        string memory _imageURL,
        string memory _description,
        address _beneficiary,
        address _fundraiserOwner
    ) public {
        require(_owner == address(0), "owner already initialized");
        require(
            _beneficiary != address(0),
            "beneficiary address should be diffrent from the zero address"
        );
        require(
            _fundraiserOwner != address(0),
            "owner address should be diffrent from the zero address"
        );
        name = _name;
        website = _website;
        imageURL = _imageURL;
        description = _description;
        beneficiary = payable(_beneficiary);
        _owner = _fundraiserOwner;
    }

    // the Fundraiser manager can change the benefiaciary address
    // in case he enetered a wrong one or the beneficiary decides to
    // switch the exchange he is using
    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        require(
            _beneficiary != address(0),
            "beneficiary address should be diffrent from the zero address"
        );
        beneficiary = _beneficiary;
    }

    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation =
            Donation({
                value: msg.value,
                date: block.timestamp,
                conversionFactor: 2 // pass it in param
            });
        _donations[msg.sender].push(donation);
        // using safeMath since there is no limit to the
        // amount that a donor can donate nor on the number
        // of donations
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
        emit DonationReceived(msg.sender, msg.value);
    }

    function myDonations() external view returns (Donation[] memory donations) {
        return _donations[msg.sender];
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        beneficiary.transfer(balance);
        emit Withdraw(balance);
    }

    // simulate anonymous donations
    // the donation will not really be anonymous
    // since the transaction will be recorded on the blockchain
    // with the address of the emitter unless the adress is
    // set up to make tracing it more difficult
    receive() external payable {
        totalDonations += msg.value;
        donationsCount++;
    }
}

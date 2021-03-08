// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.8.0;

import "./Fundraiser.sol";
import "./CloneFactory.sol";

contract FundraiserFactory is CloneFactory {
    mapping(string => Fundraiser) public _fundraisers;
    address public masterContract;
    string[] _names;
    uint256 constant maxLimit = 20;
    event FundraiserCreated(
        Fundraiser indexed fundraiser,
        address indexed owner
    );

    constructor(address _masterContract) {
        masterContract = _masterContract;
    }

    function fundraisersCount() public view returns (uint256) {
        return _names.length;
    }

    // TODO : change this to clone factory
    // current gas : 1249969
    // function createFundraiser(
    //     string calldata name,
    //     string calldata url,
    //     string calldata imageURL,
    //     string calldata description,
    //     address payable beneficiary
    // ) external {
    //     require(!_nameExists(name), "fundraiser name already exists");
    //     Fundraiser fundraiser =
    //         new Fundraiser(
    //             name,
    //             url,
    //             imageURL,
    //             description,
    //             beneficiary,
    //             msg.sender
    //         );
    //     _fundraisers[name] = fundraiser;
    //     _names.push(name);
    //     emit FundraiserCreated(fundraiser, msg.sender);
    // }

    function createFundraiser(
        string calldata name,
        string calldata url,
        string calldata imageURL,
        string calldata description,
        address payable beneficiary
    ) external {
        require(!_nameExists(name), "fundraiser name already exists");
        Fundraiser fundraiser =
            Fundraiser(payable(createClone(masterContract)));
        fundraiser.init(
            name,
            url,
            imageURL,
            description,
            beneficiary,
            msg.sender
        );
        _fundraisers[name] = fundraiser;
        _names.push(name);

        emit FundraiserCreated(fundraiser, msg.sender);
    }

    function fundraisers(uint256 limit, uint256 offset)
        external
        view
        returns (Fundraiser[] memory coll)
    {
        require(offset <= fundraisersCount(), "offset out of bounds");
        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;
        coll = new Fundraiser[](size);
        for (uint256 i = 0; i < size; i++) {
            coll[i] = _fundraisers[_names[offset + i]];
        }
        return coll;
    }

    function fundraiserByName(string calldata name)
        external
        view
        returns (Fundraiser)
    {
        require(_nameExists(name), "The requested fundraiser does not exist");
        return _fundraisers[name];
    }

    function _nameExists(string calldata name) private view returns (bool) {
        return _fundraisers[name] != Fundraiser(0x0);
    }
}

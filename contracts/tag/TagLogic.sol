//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TagTypes.sol";
import "./TagStore.sol";

contract TagLogic is Ownable, TagTypes {
    address private alexandriaAddr;
    TagStore private store;

    constructor(address _tagStoreAddr) {
        store = TagStore(_tagStoreAddr);
    }

    modifier onlyAlexandria() {
        require(msg.sender == alexandriaAddr, "403");
        _;
    }

    function upgradeAlexandria(address _alexandriaAddr) public onlyOwner {
        alexandriaAddr = _alexandriaAddr;
    }

    function add(
        address caller,
        string memory name,
        string memory description
    ) public onlyAlexandria {
        require(
            store.exists(name) == false,
            string(abi.encodePacked("Tag '", name, "' already exists"))
        );
        Tag memory tag = store.add(caller, name, description);
        emit tagAdded(tag);
    }

    function list() public view onlyAlexandria returns (Tag[] memory tags) {
        return store.list();
    }
}

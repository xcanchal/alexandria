//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TagTypes.sol";
import "./TagLogic.sol";

contract TagStore is Ownable, TagTypes {
    address private logicAddress;

    modifier onlyLogic() {
        require(msg.sender == logicAddress, "403");
        _;
    }

    function upgradeLogic(address _logicAddress) public onlyOwner {
        logicAddress = _logicAddress;
    }

    function generateId(string memory name) private pure returns (bytes32) {
        return keccak256(abi.encode(name));
    }

    function add(
        address caller,
        string memory name,
        string memory description
    ) public onlyLogic returns (Tag memory addedTag) {
        Tag memory tag;
        tag.id = generateId(name);
        tag.name = name;
        tag.description = description;
        tag.creator = caller;
        tag.createdAt = block.timestamp * 1000;

        tags.push(tag);
        tagsById[tag.id] = tag;

        return tag;
    }

    function list() public view onlyLogic returns (Tag[] memory) {
        return tags;
    }

    function getById(bytes32 id) public view onlyLogic returns (Tag memory) {
        return tagsById[id];
    }

    function exists(string memory name) public view onlyLogic returns (bool) {
        bytes32 id = generateId(name);
        Tag memory tag = getById(id);
        return tag.id == id;
    }
}

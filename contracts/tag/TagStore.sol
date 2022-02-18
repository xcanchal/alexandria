//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TagTypes.sol";
import "./TagLogic.sol";

contract TagStore is Ownable, TagTypes {
    struct Record {
        Tag data;
        uint256 idListPointer;
    }

    mapping(bytes32 => Record) private records;
    bytes32[] private idList;

    address private logicAddress;

    event TagCreated(Tag tag);
    event TagUpdated(Tag tag);
    event TagDeleted(Tag tag);

    modifier onlyLogic() {
        require(msg.sender == logicAddress, "403");
        _;
    }

    function upgradeLogic(address _logicAddress) public onlyOwner {
        logicAddress = _logicAddress;
    }

    function create(Tag memory tag) public onlyLogic returns (bool success) {
        require(!exists(tag.id), "400");
        idList.push(tag.id);
        records[tag.id] = Record({data: tag, idListPointer: idList.length - 1});
        emit TagCreated(tag);
        return true;
    }

    function updateDescription(bytes32 id, string memory description)
        public
        onlyLogic
        returns (bool success)
    {
        require(exists(id), "404");
        records[id].data.description = description;
        emit TagUpdated(records[id].data);
        return true;
    }

    function deleteById(bytes32 id) public onlyLogic returns (bool success) {
        require(exists(id), "404");
        Record memory record = records[id];

        uint256 indexToDelete = record.idListPointer;
        bytes32 idToMove = idList[idList.length - 1];
        idList[indexToDelete] = idToMove;
        records[idToMove].idListPointer = indexToDelete;
        records[idToMove].data.deleted = true;
        idList.pop();

        emit TagDeleted(record.data);
        return true;
    }

    function getById(bytes32 id) public view onlyLogic returns (Tag memory) {
        if (!exists(id)) revert("404");
        return records[id].data;
    }

    function getByIndex(uint256 index)
        public
        view
        onlyLogic
        returns (Tag memory)
    {
        require(index < idList.length, "404");
        return records[idList[index]].data;
    }

    function exists(bytes32 id) private view returns (bool) {
        if (idList.length == 0) return false;
        return idList[records[id].idListPointer] == id;
    }

    function count() public view onlyLogic returns (uint256) {
        return idList.length;
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./QuestionTypes.sol";
import "./QuestionLogic.sol";

contract QuestionStore is Ownable, QuestionTypes {
    struct Record {
        Question data;
        uint256 idListPointer;
    }

    mapping(bytes32 => Record) private records;
    bytes32[] private idList;

    address private logicAddress;

    event QuestionCreated(Question question);
    event QuestionUpdated(Question question);
    event QuestionDeleted(Question question);

    modifier onlyLogic() {
        require(msg.sender == logicAddress, "403");
        _;
    }

    function upgradeLogic(address _logicAddress) public onlyOwner {
        logicAddress = _logicAddress;
    }

    function create(Question memory question)
        public
        onlyLogic
        returns (bool success)
    {
        require(!exists(question.id), "400");
        idList.push(question.id);
        records[question.id] = Record({
            data: question,
            idListPointer: idList.length - 1
        });
        emit QuestionCreated(question);
        return true;
    }

    function update(
        address caller,
        bytes32 id,
        string memory title,
        string memory body,
        string[] memory tags
    ) public onlyLogic returns (bool success) {
        require(exists(id), "404");
        require(records[id].data.creator == caller, "403");
        records[id].data.title = title;
        records[id].data.body = body;
        records[id].data.tags = tags;
        emit QuestionUpdated(records[id].data);
        return true;
    }

    function deleteById(address caller, bytes32 id)
        public
        onlyLogic
        returns (bool success)
    {
        require(exists(id), "404");
        require(records[id].data.creator == caller, "403");
        Record memory record = records[id];

        uint256 indexToDelete = record.idListPointer;
        bytes32 idToMove = idList[idList.length - 1];
        idList[indexToDelete] = idToMove;
        records[idToMove].idListPointer = indexToDelete;
        records[idToMove].data.deleted = true;
        idList.pop();

        emit QuestionDeleted(record.data);
        return true;
    }

    function getById(bytes32 id)
        public
        view
        onlyLogic
        returns (Question memory)
    {
        if (!exists(id)) revert("404");
        return records[id].data;
    }

    function getByIndex(uint256 index)
        public
        view
        onlyLogic
        returns (Question memory)
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

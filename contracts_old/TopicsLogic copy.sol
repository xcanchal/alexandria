//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../utils/Validators.sol";

contract TopicsLogic is Ownable, Validators {
    constructor() {}

    function add(string memory name, string memory description)
        external
        lengthBetween(name, 2, 25, string("name"))
        lengthBetween(description, 10, 250, string("description"))
    {
        require(
            topicsByName[name].id == 0,
            string(abi.encodePacked("Topic '", name, "' already exists"))
        );

        uint256 id = _topicIds.current();
        Topic memory topic;
        topic.id = id;
        topic.name = name;
        topic.description = description;
        topic.createdAt = block.timestamp * 1000;
        topic.updatedAt = block.timestamp * 1000;

        topics.push(topic);
        topicsById[id] = topic;
        topicsByName[topic.name] = topic;
        _topicIds.increment();

        emit topicAdded(topic);
    }

    function list() public view returns (Topic[] memory) {
        return topics;
    }

    function getById(uint256 id)
        public
        view
        validId(id)
        returns (Topic memory)
    {
        Topic memory topic = topicsById[id];
        if (topic.id == 0) {
            revert("Topic not found");
        }
        return topic;
    }

    function exists(uint256 id) public view validId(id) returns (bool) {
        Topic memory topic = topicsById[id];
        return topic.id > 0;
    }
}

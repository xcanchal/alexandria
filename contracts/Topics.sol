//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./utils/Validators.sol";

contract Topics is Ownable, Validators {
    struct Topic {
        uint256 id;
        string name;
        string description;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /* struct TopicStats {
      int256 questions
      int256 answers
      int256 participants
    } */

    using Counters for Counters.Counter;
    Counters.Counter private _topicIds;
    Topic[] private topics;
    mapping(uint256 => Topic) private topicsById;
    mapping(string => Topic) private topicsByName;

    constructor() {
        _topicIds.increment();
    }

    event topicAdded(Topic topic);

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

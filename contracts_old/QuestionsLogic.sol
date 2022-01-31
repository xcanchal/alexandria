//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Topics.sol";
import "./Users.sol";
import "./utils/Validators.sol";

contract Questions is Ownable, Validators {
    Topics private topics;
    Users private users;

    struct Question {
        uint256 id;
        string text;
        uint256 userId;
        uint256 topicId;
        string[] tags;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /* struct QuestionStats {
      int256 views;
      int256 votes;
    } */

    using Counters for Counters.Counter;
    Counters.Counter private _questionIds;
    Question[] private questions;
    mapping(uint256 => Question) private questionsById;
    mapping(uint256 => Question[]) private questionsByTopicId;

    constructor(address topicsAddress, address usersAddress) {
        topics = Topics(topicsAddress);
        users = Users(usersAddress);
        _questionIds.increment();
    }

    event questionAdded(Question question);

    function add(
        string memory text,
        uint256 topicId,
        uint256 userId,
        string[] memory tags
    ) external lengthBetween(text, 10, 100, string("text")) {
        if (!topics.exists(topicId)) {
            revert("Topic does not exist");
        } else if (!users.exists(userId)) {
            revert("User does not exist");
        }

        uint256 id = _questionIds.current();
        Question memory question;
        question.id = id;
        question.text = text;
        question.topicId = topicId;
        question.userId = userId;
        question.tags = tags;
        question.createdAt = block.timestamp * 1000;
        question.updatedAt = block.timestamp * 1000;

        questions.push(question);
        questionsById[question.id] = question;
        questionsByTopicId[question.topicId].push(question);
        _questionIds.increment();

        emit questionAdded(question);
    }

    function list() public view returns (Question[] memory) {
        return questions;
    }

    function getById(uint256 id)
        public
        view
        validId(id)
        returns (Question memory)
    {
        Question memory question = questionsById[id];
        if (question.id == 0) {
            revert("Question not found");
        }
        return question;
    }

    function exists(uint256 id) public view validId(id) returns (bool) {
        Question memory question = questionsById[id];
        return question.id > 0;
    }

    function listByTopicId(uint256 topicId)
        public
        view
        returns (Question[] memory)
    {
        return questionsByTopicId[topicId];
    }
}

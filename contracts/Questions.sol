//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Categories.sol";
import "./Users.sol";
import "./utils/Validators.sol";

contract Questions is Ownable, Validators {
    Categories private categories;
    Users private users;

    struct Question {
        uint256 id;
        string text;
        uint256 userId;
        uint256 categoryId;
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
    mapping(uint256 => Question) private questionsById;
    mapping(uint256 => Question[]) private questionsByCategoryId;
    Question[] private questions;

    constructor(address categoriesAddress, address usersAddress) {
        categories = Categories(categoriesAddress);
        users = Users(usersAddress);
        _questionIds.increment();
    }

    event questionAdded(Question question);

    function add(
        string calldata text,
        uint256 categoryId,
        uint256 userId,
        string[] calldata tags
    ) external onlyOwner minLength(text, 10, string("text")) {
        if (!categories.exists(categoryId)) {
            revert("Category does not exist");
        } else if (!users.exists(userId)) {
            revert("User does not exist");
        }

        uint256 id = _questionIds.current();
        Question memory question;
        question.id = id;
        question.text = text;
        question.categoryId = categoryId;
        question.userId = userId;
        question.tags = tags;
        question.createdAt = block.timestamp * 1000;
        question.updatedAt = block.timestamp * 1000;

        questions.push(question);
        questionsById[question.id] = question;
        questionsByCategoryId[question.categoryId].push(question);
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

    function listByCategoryId(uint256 categoryId)
        public
        view
        returns (Question[] memory)
    {
        return questionsByCategoryId[categoryId];
    }
}

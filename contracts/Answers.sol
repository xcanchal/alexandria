//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Questions.sol";
import "./Users.sol";
import "./utils/Validators.sol";

contract Answers is Ownable, Validators {
    Questions private questions;
    Users private users;

    struct Answer {
        uint256 id;
        string text;
        uint256 userId;
        uint256 questionId;
        int256 votes;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /* struct QuestionStats {
      int256 views;
      int256 votes;
    } */

    using Counters for Counters.Counter;
    Counters.Counter private _answerIds;
    mapping(uint256 => Answer) private answersById;
    mapping(uint256 => Answer[]) private answersByQuestionId;
    Answer[] private answers;

    constructor(address questionsAddress, address usersAddress) {
        questions = Questions(questionsAddress);
        users = Users(usersAddress);
        _answerIds.increment();
    }

    event answerAdded(Answer answer);

    function add(
        string calldata text,
        uint256 questionId,
        uint256 userId
    ) external onlyOwner minLength(text, 2, string("text")) {
        if (!questions.exists(questionId)) {
            revert("Question does not exist");
        } else if (!users.exists(userId)) {
            revert("User does not exist");
        }

        uint256 id = _answerIds.current();
        Answer memory answer;
        answer.id = id;
        answer.text = text;
        answer.questionId = questionId;
        answer.userId = userId;
        answer.votes = 0;
        answer.createdAt = block.timestamp * 1000;
        answer.updatedAt = block.timestamp * 1000;

        answers.push(answer);
        answersById[answer.id] = answer;
        answersByQuestionId[answer.questionId].push(answer);
        _answerIds.increment();

        emit answerAdded(answer);
    }

    function list() public view returns (Answer[] memory) {
        return answers;
    }

    modifier checkAnswerExists(uint256 id) {
        Answer memory answer = answersById[id];
        if (answer.id == 0) {
            revert("Answer not found");
        }
        _;
    }

    function getById(uint256 id)
        public
        view
        validId(id)
        checkAnswerExists(id)
        returns (Answer memory)
    {
        return answersById[id];
    }

    function listByQuestionId(uint256 questionId)
        public
        view
        returns (Answer[] memory)
    {
        return answersByQuestionId[questionId];
    }

    function upvote(uint256 id) public validId(id) checkAnswerExists(id) {
        answersById[id].votes += 1;
    }

    function downvote(uint256 id) public validId(id) checkAnswerExists(id) {
        answersById[id].votes -= 1;
    }
}

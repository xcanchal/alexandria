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
    Answer[] private answers;
    mapping(uint256 => Answer) private answersById;
    mapping(uint256 => Answer[]) private answersByQuestionId;

    constructor(address questionsAddress, address usersAddress) {
        questions = Questions(questionsAddress);
        users = Users(usersAddress);
        _answerIds.increment();
    }

    event answerAdded(Answer answer);
    event answerUpvoted(Answer answer);
    event answerDownvoted(Answer answer);

    function add(
        string memory text,
        uint256 questionId,
        uint256 userId
    ) external minLength(text, 2, string("text")) {
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

    // Really needed?
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
        validId(questionId)
        returns (Answer[] memory)
    {
        return answersByQuestionId[questionId];
    }

    function upvote(uint256 id) public validId(id) checkAnswerExists(id) {
        // What about updating the item in the array? :(
        // mapping indexByPosition[position] ? is data redundancy a design error? maybe we just need the mapping...
        answersById[id].votes += 1;

        for (uint256 i = 0; i < answersByQuestionId[id].length; i += 1) {
            if (answersByQuestionId[id][i].id == id) {
                answersByQuestionId[id][i].votes += 1;
                emit answerUpvoted(answersByQuestionId[id][i]);
                break;
            }
        }

        for (uint256 i = 0; i < answers.length; i += 1) {
            if (answers[i].id == id) {
                answers[i].votes += 1;
                break;
            }
        }
    }

    function downvote(uint256 id) public validId(id) checkAnswerExists(id) {
        // What about updating the item in the array? :(
        // mapping indexByPosition[position] ? is data redundancy a design error? maybe we just need the mapping...
        answersById[id].votes -= 1;

        for (uint256 i = 0; i < answersByQuestionId[id].length; i += 1) {
            if (answersByQuestionId[id][i].id == id) {
                answersByQuestionId[id][i].votes -= 1;
                emit answerDownvoted(answersByQuestionId[id][i]);
                break;
            }
        }

        for (uint256 i = 0; i < answers.length; i += 1) {
            if (answers[i].id == id) {
                answers[i].votes -= 1;
                break;
            }
        }
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./tag/TagTypes.sol";
import "./tag/TagLogic.sol";
import "./question/QuestionTypes.sol";
import "./question/QuestionLogic.sol";

contract Alexandria is Ownable, TagTypes, QuestionTypes {
    TagLogic private tagLogic;
    QuestionLogic private questionLogic;

    constructor(address _tagLogicAddr, address _questionLogicAddr) {
        tagLogic = TagLogic(_tagLogicAddr);
        questionLogic = QuestionLogic(_questionLogicAddr);
    }

    /* Tag */
    function upgradeTagLogic(address _tagLogicAddr) public onlyOwner {
        tagLogic = TagLogic(_tagLogicAddr);
    }

    function createTag(string memory name, string memory description) public {
        tagLogic.create(msg.sender, name, description);
    }

    function updateTag(bytes32 id, string memory description) public {
        tagLogic.updateDescription(msg.sender, id, description);
    }

    function getTagById(bytes32 id) public view returns (Tag memory) {
        return tagLogic.getById(id);
    }

    function getTagByIndex(uint256 index) public view returns (Tag memory) {
        return tagLogic.getByIndex(index);
    }

    function deleteTagById(bytes32 id) public {
        tagLogic.deleteById(msg.sender, id);
    }

    function countTags() public view returns (uint256) {
        return tagLogic.count();
    }

    /* Question */
    function upgradeQuestionLogic(address _questionLogicAddr) public onlyOwner {
        questionLogic = QuestionLogic(_questionLogicAddr);
    }

    function createQuestion(
        string memory title,
        string memory body,
        bytes32[] memory tags
    ) public {
        questionLogic.create(msg.sender, title, body, tags);
    }

    function updateQuestion(
        bytes32 id,
        string memory title,
        string memory body,
        bytes32[] memory tags
    ) public {
        questionLogic.update(msg.sender, id, title, body, tags);
    }

    function getQuestionById(bytes32 id) public view returns (Question memory) {
        return questionLogic.getById(id);
    }

    function getQuestionByIndex(uint256 index)
        public
        view
        returns (Question memory)
    {
        return questionLogic.getByIndex(index);
    }

    function deleteQuestionById(bytes32 id) public {
        questionLogic.deleteById(msg.sender, id);
    }

    function countQuestions() public view returns (uint256) {
        return questionLogic.count();
    }
}

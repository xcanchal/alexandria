//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./tag/TagTypes.sol";
import "./tag/TagLogic.sol";

contract Alexandria is Ownable, TagTypes {
    TagLogic private tagLogic;

    constructor(address _tagLogicAddr) {
        tagLogic = TagLogic(_tagLogicAddr);
    }

    function upgradeTagLogic(address _tagLogicAddr) public onlyOwner {
        tagLogic = TagLogic(_tagLogicAddr);
    }

    function createTag(string memory name, string memory description) public {
        tagLogic.create(msg.sender, name, description);
    }

    function updateTagDescription(bytes32 id, string memory description)
        public
    {
        tagLogic.updateDescription(id, description);
    }

    function getTagById(bytes32 id) public view returns (Tag memory) {
        return tagLogic.getById(id);
    }

    function getTagByIndex(uint256 index) public view returns (Tag memory) {
        return tagLogic.getByIndex(index);
    }

    function deleteTagById(bytes32 id) public {
        tagLogic.deleteById(id);
    }

    function countTags() public view returns (uint256) {
        return tagLogic.count();
    }
}

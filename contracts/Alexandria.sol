//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./tag/TagTypes.sol";
import "./tag/TagLogic.sol";

contract Alexandria is Ownable, TagTypes {
    TagLogic private tagLogic;

    function upgradeTagLogic(address _tagLogicAddr) public onlyOwner {
        tagLogic = TagLogic(_tagLogicAddr);
    }

    function addTag(string memory name, string memory description) public {
        tagLogic.add(msg.sender, name, description);
    }

    function listTags() public view returns (Tag[] memory tags) {
        return tagLogic.list();
    }
}

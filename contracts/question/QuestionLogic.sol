//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./QuestionTypes.sol";
import "./QuestionStore.sol";

contract QuestionLogic is Ownable, QuestionTypes {
    address private alexandriaAddr;
    QuestionStore private store;

    constructor(address _questionStoreAddr) {
        store = QuestionStore(_questionStoreAddr);
    }

    modifier onlyAlexandria() {
        require(msg.sender == alexandriaAddr, "403");
        _;
    }

    function upgradeAlexandria(address _alexandriaAddr) public onlyOwner {
        alexandriaAddr = _alexandriaAddr;
    }

    function generateId(string memory title, address caller)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(title, caller));
    }

    function create(
        address caller,
        string memory title,
        string memory body,
        bytes32[] memory tags
    ) public onlyAlexandria returns (bool success) {
        return
            store.create(
                Question({
                    id: generateId(title, caller),
                    title: title,
                    body: body,
                    creator: caller,
                    deleted: false,
                    tags: tags
                })
            );
    }

    function update(
        address caller,
        bytes32 id,
        string memory title,
        string memory body,
        bytes32[] memory tags
    ) public onlyAlexandria returns (bool success) {
        return store.update(caller, id, title, body, tags);
    }

    function getById(bytes32 id)
        public
        view
        onlyAlexandria
        returns (Question memory)
    {
        return store.getById(id);
    }

    function getByIndex(uint256 index)
        public
        view
        onlyAlexandria
        returns (Question memory)
    {
        return store.getByIndex(index);
    }

    function deleteById(address caller, bytes32 id) public onlyAlexandria {
        store.deleteById(caller, id);
    }

    function count() public view onlyAlexandria returns (uint256) {
        return store.count();
    }
}

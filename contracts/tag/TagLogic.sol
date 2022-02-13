//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TagTypes.sol";
import "./TagStore.sol";

contract TagLogic is Ownable, TagTypes {
    address private alexandriaAddr;
    TagStore private store;

    constructor(address _tagStoreAddr) {
        store = TagStore(_tagStoreAddr);
    }

    modifier onlyAlexandria() {
        require(msg.sender == alexandriaAddr, "403");
        _;
    }

    function upgradeAlexandria(address _alexandriaAddr) public onlyOwner {
        alexandriaAddr = _alexandriaAddr;
    }

    function generateId(string memory name) private pure returns (bytes32) {
        return keccak256(abi.encode(name));
    }

    function create(
        address caller,
        string memory name,
        string memory description
    ) public onlyAlexandria returns (bool success) {
        return
            store.create(
                Tag({
                    id: generateId(name),
                    name: name,
                    description: description,
                    creator: caller,
                    deleted: false,
                    createdAt: block.timestamp * 1000,
                    updatedAt: block.timestamp * 1000
                })
            );
    }

    function updateDescription(bytes32 id, string memory description)
        public
        onlyAlexandria
        returns (bool success)
    {
        return store.updateDescription(id, description, block.timestamp * 1000);
    }

    function getById(bytes32 id)
        public
        view
        onlyAlexandria
        returns (Tag memory)
    {
        return store.getById(id);
    }

    function getByIndex(uint256 index)
        public
        view
        onlyAlexandria
        returns (Tag memory)
    {
        return store.getByIndex(index);
    }

    function deleteById(bytes32 id) public onlyAlexandria {
        store.deleteById(id, block.timestamp * 1000);
    }

    function count() public view onlyAlexandria returns (uint256) {
        return store.count();
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract TagTypes {
    struct Tag {
        bytes32 id;
        string name; // 1..35
        string description; // 1..500
        address creator;
        uint256 createdAt;
    }
    Tag[] internal tags;
    mapping(bytes32 => Tag) internal tagsById;

    event tagAdded(Tag tag);
}

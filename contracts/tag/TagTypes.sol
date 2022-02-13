//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

abstract contract TagTypes {
    struct Tag {
        bytes32 id;
        string name; // 1..35
        string description; // 1..500
        bool deleted;
        address creator;
        uint256 createdAt;
        uint256 updatedAt;
    }
}

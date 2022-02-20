//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

abstract contract QuestionTypes {
    struct Question {
        bytes32 id;
        string title;
        string body;
        address creator;
        bool deleted;
        string[] tags;
    }
}

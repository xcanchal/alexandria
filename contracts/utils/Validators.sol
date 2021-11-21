//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Validators {
    modifier validId(uint256 id) {
        require(id > 0, "invalid id");
        _;
    }

    modifier minLength(
        string memory str,
        uint16 length,
        string memory paramName
    ) {
        string memory message = string(
            abi.encodePacked(
                paramName,
                " should at least have ",
                Strings.toString(length),
                " characters"
            )
        );
        require(bytes(str).length >= length, message);
        _;
    }

    modifier maxLength(
        string memory str,
        uint16 length,
        string memory paramName
    ) {
        string memory message = string(
            abi.encodePacked(
                paramName,
                " should have ",
                Strings.toString(length),
                " characters maximum"
            )
        );
        require(bytes(str).length <= length, message);
        _;
    }

    modifier lengthBetween(
        string memory str,
        uint16 minimumLength,
        uint16 maximumLength,
        string memory paramName
    ) {
        string memory message = string(
            abi.encodePacked(
                paramName,
                " should be between ",
                Strings.toString(minimumLength),
                " and ",
                Strings.toString(maximumLength),
                " characters long"
            )
        );
        require(
            bytes(str).length >= minimumLength &&
                bytes(str).length <= maximumLength,
            message
        );
        _;
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Validators {
    modifier validId(uint256 id) {
        require(id > 0, "id must be greater than zero");
        _;
    }

    modifier minLength(
        string calldata str,
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
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./utils/Validators.sol";

contract Users is Ownable, Validators {
    struct User {
        uint256 id;
        string username;
        string bio;
        string avatar;
        address wallet;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /* struct UserStats {
        int256 questions;
        int256 answers;
        int256 upVotes;
        int256 downVotes;
    } */

    using Counters for Counters.Counter;
    Counters.Counter private _userIds;
    User[] private users;
    mapping(uint256 => User) private usersById;
    mapping(string => User) private usersByUsername; // can be deleted if using users by address?
    mapping(address => User) private usersByAddress;

    constructor() {
        _userIds.increment();
    }

    event userAdded(User user);

    function add(
        string memory username,
        string memory bio,
        string memory avatar
    ) external minLength(username, 2, string("username")) {
        // Can be removed in favor of identifying by address?
        require(!existsByUsername(username), "Username already exists");
        // require(!existsByAddress(username), "This address already has a user");

        uint256 id = _userIds.current();
        User memory user;

        user.id = id;
        user.username = username;
        user.bio = bytes(bio).length > 0 ? bio : "";
        user.avatar = bytes(avatar).length > 0 ? avatar : "";
        user.wallet = msg.sender;
        user.createdAt = block.timestamp * 1000;
        user.updatedAt = block.timestamp * 1000;

        users.push(user);
        usersById[id] = user;
        usersByUsername[user.username] = user;
        usersByAddress[user.wallet] = user;
        _userIds.increment();

        emit userAdded(user);
    }

    function list() public view returns (User[] memory) {
        return users;
    }

    function getById(uint256 id) public view validId(id) returns (User memory) {
        User memory user = usersById[id];
        if (user.id == 0) {
            revert("User not found");
        }
        return user;
    }

    function exists(uint256 id) public view validId(id) returns (bool) {
        User memory user = usersById[id];
        return user.id > 0;
    }

    // Can be deleted if implement existsByAddress?
    function existsByUsername(string memory username)
        private
        view
        minLength(username, 2, string("username"))
        returns (bool)
    {
        User memory user = usersByUsername[username];
        return user.id > 0;
    }

    /* implement and add modifier validAddres(wallet) */
    function getByAddress(address addr) public view returns (User memory) {
        User memory user = usersByAddress[addr];
        if (user.id == 0) {
            revert("User not found with this address");
        }
        return user;
    }

    /* function updateBio() {
    } */

    /* function updateAvatar() {
    } */
}

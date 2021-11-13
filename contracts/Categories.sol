//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./utils/Validators.sol";

contract Categories is Ownable, Validators {
    struct Category {
        uint256 id;
        string name;
        string description;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /* struct CategoryStats {
      int256 questions
      int256 answers
      int256 participants
    } */

    using Counters for Counters.Counter;
    Counters.Counter private _categoryIds;
    mapping(uint256 => Category) private categoriesById;
    Category[] private categories;

    constructor() {
        _categoryIds.increment();
    }

    event categoryAdded(Category category);

    function add(string calldata name, string calldata description)
        external
        onlyOwner
        minLength(name, 2, string("name"))
        minLength(description, 2, string("description"))
    {
        uint256 id = _categoryIds.current();
        Category memory category;
        category.id = id;
        category.name = name;
        category.description = description;
        category.createdAt = block.timestamp * 1000;
        category.updatedAt = block.timestamp * 1000;

        categories.push(category);
        categoriesById[id] = category;
        _categoryIds.increment();

        emit categoryAdded(category);
    }

    function list() public view returns (Category[] memory) {
        return categories;
    }

    function getById(uint256 id)
        public
        view
        validId(id)
        returns (Category memory)
    {
        Category memory category = categoriesById[id];
        if (category.id == 0) {
            revert("Category not found");
        }
        return category;
    }

    function exists(uint256 id) public view validId(id) returns (bool) {
        Category memory category = categoriesById[id];
        return category.id > 0;
    }
}

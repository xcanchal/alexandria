import { expect } from "chai";
import { ethers } from "hardhat";
import { Categories, Users } from "../typechain";
import { validateDate } from "./utils";

async function deployContracts() {
  const Categories = await ethers.getContractFactory("Categories");
  const categories = await Categories.deploy();
  await categories.deployed();

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();

  const Questions = await ethers.getContractFactory("Questions");
  const questions = await Questions.deploy(categories.address, users.address);
  await categories.deployed();

  const Answers = await ethers.getContractFactory("Answers");
  const answers = await Answers.deploy(questions.address, users.address);
  await answers.deployed();

  return { categories, users, questions, answers };
}

const categoryData = {
  name: "blockchain",
  description: "all about blockchain",
};

const userData = {
  username: "xcanchal",
  bio: "Full stack software engineer",
  avatar: "",
};

const questionData = {
  text: "How to deploy a smart contract in Solidity?",
  categoryId: 1,
  userId: 1,
  tags: ["solidity", "web3", "smart-contracts"],
};

const answersData = [
  {
    text: "You can do it in several ways...",
    questionId: 1,
    userId: 1,
  },
  {
    text: "I use Hardhat and it's awesome",
    questionId: 1,
    userId: 2,
  },
];

describe("Answers", () => {
  /* describe("add()", () => {
    it("should throw an invalid id error if the questionId is lte 0", async () => {
      const { users, questions } = await deployContracts();
      let error: any;
      try {
        const addUserTx = await users.add(userData.username, "", "");
        await addUserTx.wait();
        const addTx = await questions.add(
          questionData.text,
          0,
          questionData.userId,
          questionData.tags
        );
        await addTx.wait();
      } catch (e: any) {
        error = e;
      }
      expect(error.message).to.contain("id must be greater than zero");
    });

    it("should throw a not found error if the question does not exist", async () => {
      const { users, questions } = await deployContracts();
      let error: any;
      const [data] = questionsData;
      try {
        const addUserTx = await users.add(userData.username, "", "");
        await addUserTx.wait();
        const addTx = await questions.add(
          data.text,
          data.categoryId,
          data.userId,
          data.tags
        );
        await addTx.wait();
      } catch (e: any) {
        error = e;
      }
      expect(error.message).to.contain("Category does not exist");
    });
  }); */
});

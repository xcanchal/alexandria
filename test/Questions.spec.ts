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

  return { categories, users, questions };
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

const questionsData = [
  {
    text: "How to deploy a smart contract in Solidity?",
    categoryId: 1,
    userId: 1,
    tags: ["solidity", "web3", "smart-contracts"],
  },
  {
    text: "How to test smart contracts with Hardhat?",
    categoryId: 1,
    userId: 1,
    tags: ["solidity", "web3", "smart-contracts", "testing", "hardhat"],
  },
];

async function addUserAndCategory(categories: Categories, users: Users) {
  const addCategoryTx = await categories.add(
    categoryData.name,
    categoryData.description
  );
  await addCategoryTx.wait();
  const addUserTx = await users.add(
    userData.username,
    userData.bio,
    userData.avatar
  );
  await addUserTx.wait();
}

describe("Questions", () => {
  describe("add()", () => {
    describe("Error cases", () => {
      it("should throw an invalid id error if the categoryId is lte 0", async () => {
        const { users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addUserTx = await users.add(userData.username, "", "");
          await addUserTx.wait();
          const addTx = await questions.add(
            data.text,
            0,
            data.userId,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("id must be greater than zero");
      });

      it("should throw a not found error if the category does not exist", async () => {
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

      it("should throw an invalid id error if the userId is lte 0", async () => {
        const { categories, users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          await addUserAndCategory(categories, users);
          const addTx = await questions.add(
            data.text,
            data.categoryId,
            0,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("id must be greater than zero");
      });

      it("should throw a not found error if the user does not exist", async () => {
        const { categories, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addCategoryTx = await categories.add(
            categoryData.name,
            categoryData.description
          );
          await addCategoryTx.wait();
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
        expect(error.message).to.contain("User does not exist");
      });

      it("should throw an error if the text is lte 10 characters", async () => {
        const { categories, users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addCategoryTx = await categories.add(
            categoryData.name,
            categoryData.description
          );
          await addCategoryTx.wait();
          const addUserTx = await users.add(
            userData.username,
            userData.bio,
            userData.avatar
          );
          await addUserTx.wait();
          const addTx = await questions.add(
            "short txt",
            data.categoryId,
            data.userId,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "text should at least have 10 characters"
        );
      });
    });

    describe("Success cases", () => {
      it("should create a question", async () => {
        const { categories, users, questions } = await deployContracts();
        await addUserAndCategory(categories, users);
        const [data] = questionsData;
        const addTx = await questions.add(
          data.text,
          data.categoryId,
          data.userId,
          data.tags
        );
        await addTx.wait();
        const [question] = await questions.list();
        expect(question.id.toNumber()).to.eq(1);
        expect(question.text).to.eq(data.text);
        expect(question.categoryId).to.eq(data.categoryId);
        expect(question.userId).to.eq(data.userId);
      });
    });
  });

  describe("list()", () => {
    describe("Success cases", () => {
      it("should return an empty question list", async () => {
        const { questions } = await deployContracts();
        expect(await questions.list()).to.have.length(0);
      });

      it("should return a list with existing question", async () => {
        const { categories, users, questions } = await deployContracts();
        await addUserAndCategory(categories, users);

        const addTxs = await Promise.all(
          questionsData.map(({ text, categoryId, userId, tags }) =>
            questions.add(text, categoryId, userId, tags)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const questionList = await questions.list();
        expect(questionList).to.have.length(2);
        expect(questionList[1].id.toNumber()).to.eq(2);
        expect(questionList[1].text).eq(questionsData[1].text);
        expect(questionList[1].categoryId).eq(questionsData[1].categoryId);
        expect(questionList[1].userId).eq(questionsData[1].userId);
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const { categories, users, questions } = await deployContracts();
        let error: any;
        try {
          await addUserAndCategory(categories, users);
          await questions.getById(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("id must be greater than zero");
      });
    });

    it("should return a not found error if category does not exist", async () => {
      const { categories, users, questions } = await deployContracts();
      let error: any;
      try {
        await addUserAndCategory(categories, users);
        await questions.getById(3);
      } catch (e: any) {
        error = e;
      }
      expect(error.message).to.contain("Question not found");
    });

    describe("Success cases", () => {
      it("should return an existing category by id", async () => {
        const { categories, users, questions } = await deployContracts();
        await addUserAndCategory(categories, users);

        const [data] = questionsData;
        const addTx = await questions.add(
          data.text,
          data.categoryId,
          data.userId,
          data.tags
        );
        await addTx.wait();

        const question = await questions.getById(1);

        expect(question.text).eq(data.text);
        expect(question.categoryId).eq(data.categoryId);
        expect(question.userId).eq(data.userId);
        expect(question.tags).deep.eq(data.tags);
        validateDate(new Date(question.createdAt.toNumber()));
        validateDate(new Date(question.updatedAt.toNumber()));
      });
    });
  });

  describe("exists()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const { questions } = await deployContracts();
        let error: any;
        try {
          await questions.exists(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("id must be greater than zero");
      });
    });

    describe("Success cases", () => {
      it("should return true if a question exists", async () => {
        const { questions, categories, users } = await deployContracts();
        const { username, bio, avatar } = userData;
        const addUserTx = await users.add(username, bio, avatar);
        await addUserTx.wait();
        const { name, description } = categoryData;
        const addCategoryTx = await categories.add(name, description);
        await addCategoryTx.wait();
        const [{ text, categoryId, userId, tags }] = questionsData;
        const addQuestionTx = await questions.add(
          text,
          categoryId,
          userId,
          tags
        );
        await addQuestionTx.wait();
        expect(await questions.exists(1)).eq(true);
      });
      it("should return false if a question does not exist", async () => {
        const { questions } = await deployContracts();
        expect(await questions.exists(5)).eq(false);
      });
    });
  });

  describe("listByCategoryId()", () => {
    describe("Success cases", () => {
      it("should return an empty question list", async () => {
        const { questions } = await deployContracts();
        expect(await questions.listByCategoryId(10)).to.have.length(0);
      });

      it("should return a list with existing questions for a category", async () => {
        const { categories, users, questions } = await deployContracts();
        await addUserAndCategory(categories, users);

        const addTxs = await Promise.all(
          questionsData.map(({ text, categoryId, userId, tags }) =>
            questions.add(text, categoryId, userId, tags)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const categoryQuestions = await questions.listByCategoryId(1);
        expect(categoryQuestions).to.have.length(2);

        expect(categoryQuestions[0].id.toNumber()).to.eq(1);
        expect(categoryQuestions[0].text).eq(questionsData[0].text);
        expect(categoryQuestions[0].categoryId).eq(questionsData[0].categoryId);
        expect(categoryQuestions[0].userId).eq(questionsData[0].userId);

        expect(categoryQuestions[1].id.toNumber()).to.eq(2);
        expect(categoryQuestions[1].text).eq(questionsData[1].text);
        expect(categoryQuestions[1].categoryId).eq(questionsData[1].categoryId);
        expect(categoryQuestions[1].userId).eq(questionsData[1].userId);
      });
    });
  });
});

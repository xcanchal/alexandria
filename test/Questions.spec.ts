import { expect } from "chai";
import { ethers } from "hardhat";
import { Topics, Users } from "../typechain";
import { validateDate } from "./utils";

async function deployContracts() {
  const Topics = await ethers.getContractFactory("Topics");
  const topics = await Topics.deploy();
  await topics.deployed();

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();

  const Questions = await ethers.getContractFactory("Questions");
  const questions = await Questions.deploy(topics.address, users.address);
  await topics.deployed();

  return { topics, users, questions };
}

const topicData = {
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
    topicId: 1,
    userId: 1,
    tags: ["solidity", "web3", "smart-contracts"],
  },
  {
    text: "How to test smart contracts with Hardhat?",
    topicId: 1,
    userId: 1,
    tags: ["solidity", "web3", "smart-contracts", "testing", "hardhat"],
  },
];

async function addUserAndTopic(topics: Topics, users: Users) {
  const addTopicTx = await topics.add(topicData.name, topicData.description);
  await addTopicTx.wait();

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
      it("should throw an invalid id error if the topicId is invalid", async () => {
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
        expect(error.message).to.contain("invalid id");
      });

      it("should throw a not found error if the topic does not exist", async () => {
        const { users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addUserTx = await users.add(userData.username, "", "");
          await addUserTx.wait();
          const addTx = await questions.add(
            data.text,
            data.topicId,
            data.userId,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Topic does not exist");
      });

      it("should throw an invalid id error if the userId is lte 0", async () => {
        const { topics, users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          await addUserAndTopic(topics, users);
          const addTx = await questions.add(
            data.text,
            data.topicId,
            0,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });

      it("should throw a not found error if the user does not exist", async () => {
        const { topics, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addTopicTx = await topics.add(
            topicData.name,
            topicData.description
          );
          await addTopicTx.wait();
          const addTx = await questions.add(
            data.text,
            data.topicId,
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
        const { topics, users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addTopicTx = await topics.add(
            topicData.name,
            topicData.description
          );
          await addTopicTx.wait();
          const addUserTx = await users.add(
            userData.username,
            userData.bio,
            userData.avatar
          );
          await addUserTx.wait();
          const addTx = await questions.add(
            "short txt",
            data.topicId,
            data.userId,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "text should be between 10 and 100 characters long"
        );
      });

      it("should throw an error if the text is gte 100 characters", async () => {
        const { topics, users, questions } = await deployContracts();
        let error: any;
        const [data] = questionsData;
        try {
          const addTopicTx = await topics.add(
            topicData.name,
            topicData.description
          );
          await addTopicTx.wait();
          const addUserTx = await users.add(
            userData.username,
            userData.bio,
            userData.avatar
          );
          await addUserTx.wait();
          let longText = "";
          for (let i = 0; i < 101; i += 1) {
            longText += "a";
          }
          const addTx = await questions.add(
            longText,
            data.topicId,
            data.userId,
            data.tags
          );
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "text should be between 10 and 100 characters long"
        );
      });
    });

    describe("Success cases", () => {
      it("should create a question", async () => {
        const { topics, users, questions } = await deployContracts();
        await addUserAndTopic(topics, users);
        const [data] = questionsData;
        const addTx = await questions.add(
          data.text,
          data.topicId,
          data.userId,
          data.tags
        );
        await addTx.wait();
        const question = await questions.getById(1);
        expect(question.text).to.eq(data.text);
        expect(question.tags).to.deep.eq(data.tags);
        expect(question.topicId).to.eq(data.topicId);
        expect(question.userId).to.eq(data.userId);
        expect(new Date(question.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(question.updatedAt.toNumber())).to.be.instanceOf(Date);
      });

      it("should emit a questionAdded event", async () => {
        const { topics, users, questions } = await deployContracts();
        await addUserAndTopic(topics, users);
        const [data] = questionsData;
        const addTx = await questions.add(
          data.text,
          data.topicId,
          data.userId,
          data.tags
        );
        const addTxReceipt = await addTx.wait();
        const events: any[] = addTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).to.eq("questionAdded");
        const { question } = events[0].args;
        expect(question.text).to.eq(data.text);
        expect(question.tags).to.deep.eq(data.tags);
        expect(question.topicId).to.eq(data.topicId);
        expect(question.userId).to.eq(data.userId);
        expect(new Date(question.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(question.updatedAt.toNumber())).to.be.instanceOf(Date);
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
        const { topics, users, questions } = await deployContracts();
        await addUserAndTopic(topics, users);

        const addTxs = await Promise.all(
          questionsData.map(({ text, topicId, userId, tags }) =>
            questions.add(text, topicId, userId, tags)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const questionList = await questions.list();
        expect(questionList).to.have.length(2);
        expect(questionList[1].id.toNumber()).to.eq(2);
        expect(questionList[1].text).eq(questionsData[1].text);
        expect(questionList[1].topicId).eq(questionsData[1].topicId);
        expect(questionList[1].userId).eq(questionsData[1].userId);
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const { topics, users, questions } = await deployContracts();
        let error: any;
        try {
          await addUserAndTopic(topics, users);
          await questions.getById(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("invalid id");
      });
    });

    it("should return a not found error if topic does not exist", async () => {
      const { topics, users, questions } = await deployContracts();
      let error: any;
      try {
        await addUserAndTopic(topics, users);
        await questions.getById(3);
      } catch (e: any) {
        error = e;
      }
      expect(error.message).to.contain("Question not found");
    });

    describe("Success cases", () => {
      it("should return an existing topic by id", async () => {
        const { topics, users, questions } = await deployContracts();
        await addUserAndTopic(topics, users);

        const [data] = questionsData;
        const addTx = await questions.add(
          data.text,
          data.topicId,
          data.userId,
          data.tags
        );
        await addTx.wait();

        const question = await questions.getById(1);

        expect(question.text).eq(data.text);
        expect(question.topicId).eq(data.topicId);
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
        expect(error.message).contains("invalid id");
      });
    });

    describe("Success cases", () => {
      it("should return true if a question exists", async () => {
        const { questions, topics, users } = await deployContracts();
        const { username, bio, avatar } = userData;
        const addUserTx = await users.add(username, bio, avatar);
        await addUserTx.wait();
        const { name, description } = topicData;
        const addTopicTx = await topics.add(name, description);
        await addTopicTx.wait();
        const [{ text, topicId, userId, tags }] = questionsData;
        const addQuestionTx = await questions.add(text, topicId, userId, tags);
        await addQuestionTx.wait();
        expect(await questions.exists(1)).eq(true);
      });
      it("should return false if a question does not exist", async () => {
        const { questions } = await deployContracts();
        expect(await questions.exists(5)).eq(false);
      });
    });
  });

  describe("listByTopicId()", () => {
    describe("Success cases", () => {
      it("should return an empty question list", async () => {
        const { questions } = await deployContracts();
        expect(await questions.listByTopicId(10)).to.have.length(0);
      });

      it("should return a list with existing questions for a topic", async () => {
        const { topics, users, questions } = await deployContracts();
        await addUserAndTopic(topics, users);

        const addTxs = await Promise.all(
          questionsData.map(({ text, topicId, userId, tags }) =>
            questions.add(text, topicId, userId, tags)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const categoryQuestions = await questions.listByTopicId(1);
        expect(categoryQuestions).to.have.length(2);

        expect(categoryQuestions[0].id.toNumber()).to.eq(1);
        expect(categoryQuestions[0].text).eq(questionsData[0].text);
        expect(categoryQuestions[0].topicId).eq(questionsData[0].topicId);
        expect(categoryQuestions[0].userId).eq(questionsData[0].userId);

        expect(categoryQuestions[1].id.toNumber()).to.eq(2);
        expect(categoryQuestions[1].text).eq(questionsData[1].text);
        expect(categoryQuestions[1].topicId).eq(questionsData[1].topicId);
        expect(categoryQuestions[1].userId).eq(questionsData[1].userId);
      });
    });
  });

  /*   describe("getLatest", () => {
      describe("Error cases", () => {

      });
      describe("Success cases", () => {

      });
    }); */
});

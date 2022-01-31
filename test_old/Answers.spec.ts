import { expect } from "chai";
import { ethers } from "hardhat";
import { Topics, Users, Questions } from "../typechain";
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

  const Answers = await ethers.getContractFactory("Answers");
  const answers = await Answers.deploy(questions.address, users.address);
  await answers.deployed();

  return { topics, users, questions, answers };
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
    userId: 1,
  },
];

async function createPrerequiredData(
  topics: Topics,
  users: Users,
  questions: Questions
) {
  const addTopicTx = await topics.add(topicData.name, topicData.description);
  await addTopicTx.wait();

  const addUserTx = await users.add(
    userData.username,
    userData.bio,
    userData.avatar
  );
  await addUserTx.wait();

  const addQuestionTx = await questions.add(
    questionData.text,
    questionData.categoryId,
    questionData.userId,
    questionData.tags
  );
  await addQuestionTx.wait();
}

describe("Answers", () => {
  describe("add()", () => {
    describe("Error cases", () => {
      it("should return an error if questionId is invalid", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        const [data] = answersData;
        try {
          await answers.add(data.text, 0, data.userId);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });

      it("should return an error if question does not exist", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        const [data] = answersData;
        try {
          await answers.add(data.text, 10, data.userId);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Question does not exist");
      });

      it("should return an error if userId is invalid", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        const [data] = answersData;
        try {
          await answers.add(data.text, data.questionId, 0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });

      it("should return an error if user does not exist", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        const [data] = answersData;
        try {
          await answers.add(data.text, data.questionId, 10);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("User does not exist");
      });
    });

    describe("Success cases", () => {
      it("should add an answer", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        await addTx.wait();

        const answer = await answers.getById(1);
        expect(answer.id).to.eq(1);
        expect(answer.text).to.eq(data.text);
        expect(answer.questionId).to.eq(data.questionId);
        expect(answer.userId).to.eq(data.userId);
        expect(new Date(answer.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(answer.updatedAt.toNumber())).to.be.instanceOf(Date);
      });

      it("should emit an answerAdded event", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        const addTxReceipt = await addTx.wait();

        const events: any[] = addTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).to.eq("answerAdded");
        const { answer } = events[0].args;
        expect(answer.text).to.eq(data.text);
        expect(answer.questionId).to.deep.eq(data.questionId);
        expect(answer.userId).to.eq(data.userId);
        expect(answer.votes).to.eq(0);
        expect(new Date(answer.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(answer.updatedAt.toNumber())).to.be.instanceOf(Date);
      });
    });
  });

  describe("list()", () => {
    describe("Success cases", () => {
      it("should return all answers", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);

        const addTxs = await Promise.all(
          answersData.map(({ text, questionId, userId }) =>
            answers.add(text, questionId, userId)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const answerList = await answers.list();
        expect(answerList).to.have.length(2);
        expect(answerList[1].id.toNumber()).to.eq(2);
        expect(answerList[1].text).eq(answersData[1].text);
        expect(answerList[1].questionId).eq(answersData[1].questionId);
        expect(answerList[1].userId).eq(answersData[1].userId);
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should return a validation error if the id is invalid", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.getById(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });

      it("should return a not found error if the answer does not exist", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.getById(10);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Answer not found");
      });
    });

    describe("Success cases", () => {
      it("should return an answer with data if exists", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        await addTx.wait();

        const answer = await answers.getById(1);
        expect(answer.id).to.eq(1);
        expect(answer.text).to.eq(data.text);
        expect(answer.questionId).to.eq(data.questionId);
        expect(answer.userId).to.eq(data.userId);
        expect(new Date(answer.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(answer.updatedAt.toNumber())).to.be.instanceOf(Date);
      });
    });
  });

  describe("listByQuestionId()", () => {
    describe("Error cases", () => {
      it("should return a validation error if the questionId is invalid", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.listByQuestionId(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });
    });

    describe("Success cases", () => {
      it("should return a list of answers by questionId", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);

        const addTxs = await Promise.all(
          answersData.map(({ text, userId }) => answers.add(text, 1, userId))
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const answerList = await answers.listByQuestionId(1);
        expect(answerList).to.have.length(2);
        expect(answerList[1].id.toNumber()).to.eq(2);
        expect(answerList[1].text).eq(answersData[1].text);
        expect(answerList[1].questionId).eq(answersData[1].questionId);
        expect(answerList[1].userId).eq(answersData[1].userId);
      });
    });
  });

  describe("upvote()", () => {
    describe("Error cases", () => {
      it("should return a validation error if the id is invalid", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.upvote(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });

      it("should return a not found error if the answer does not exist", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.upvote(1);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Answer not found");
      });
    });

    describe("Success cases", () => {
      it("should increment the answer votes by 1", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        await addTx.wait();

        const upvote1Tx = await answers.upvote(1);
        await upvote1Tx.wait();
        const upvote2Tx = await answers.upvote(1);
        await upvote2Tx.wait();

        const answer = await answers.getById(1);
        expect(answer.votes).to.eq(2);
      });

      it("should publish an answerUpvoted event", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        await addTx.wait();

        const upvoteTx = await answers.upvote(1);
        const upvoteTxReceipt = await upvoteTx.wait();

        const events: any[] = upvoteTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).to.eq("answerUpvoted");
        const { answer } = events[0].args;
        expect(answer.text).to.eq(data.text);
        expect(answer.questionId).to.deep.eq(data.questionId);
        expect(answer.userId).to.eq(data.userId);
        expect(answer.votes).to.eq(1);
        expect(new Date(answer.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(answer.updatedAt.toNumber())).to.be.instanceOf(Date);
      });
    });
  });

  describe("downvote()", () => {
    describe("Error cases", () => {
      it("should return a validation error if the id is invalid", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.downvote(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("invalid id");
      });

      it("should return a not found error if the answer does not exist", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        let error: any;
        try {
          await answers.downvote(1);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Answer not found");
      });
    });

    describe("Success cases", () => {
      it("should decrement the answer votes by 1", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        await addTx.wait();

        const upvote1Tx = await answers.downvote(1);
        await upvote1Tx.wait();
        const upvote2Tx = await answers.downvote(1);
        await upvote2Tx.wait();

        const answer = await answers.getById(1);
        expect(answer.votes).to.eq(-2);
      });

      it("should publish an answerDownvoted event", async () => {
        const { topics, users, questions, answers } = await deployContracts();
        await createPrerequiredData(topics, users, questions);
        const [data] = answersData;

        const addTx = await answers.add(
          data.text,
          data.questionId,
          data.userId
        );
        await addTx.wait();

        const upvoteTx = await answers.downvote(1);
        const upvoteTxReceipt = await upvoteTx.wait();

        const events: any[] = upvoteTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).to.eq("answerDownvoted");
        const { answer } = events[0].args;
        expect(answer.text).to.eq(data.text);
        expect(answer.questionId).to.deep.eq(data.questionId);
        expect(answer.userId).to.eq(data.userId);
        expect(answer.votes).to.eq(-1);
        expect(new Date(answer.createdAt.toNumber())).to.be.instanceOf(Date);
        expect(new Date(answer.updatedAt.toNumber())).to.be.instanceOf(Date);
      });
    });
  });
});

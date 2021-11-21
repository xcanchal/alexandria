import { expect } from "chai";
import { ethers } from "hardhat";
import { validateDate } from "./utils";

async function deployContract() {
  const Topics = await ethers.getContractFactory("Topics");
  const topics = await Topics.deploy();
  await topics.deployed();

  return topics;
}

const topicsData = [
  { name: "photography", description: "all about photography" },
  { name: "blockchain", description: "all about blockchain" },
  { name: "pets", description: "all about pets" },
];

describe("Topics", () => {
  describe("add()", () => {
    describe("Error cases", () => {
      it("should throw an error if the caller is not the owner", async () => {
        const topics = await deployContract();
        const [, signer1] = await ethers.getSigners();
        let error: any;
        const [data] = topicsData;
        try {
          await topics.connect(signer1).add(data.name, data.description);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });

      it("should throw an error if the name is shorter than 2", async () => {
        const topics = await deployContract();
        let error: any;
        const [data] = topicsData;
        try {
          const addTx = await topics.add("a", data.description);
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "name should be between 2 and 25 characters long"
        );
      });

      it("should throw an error if the name is longer than 25", async () => {
        const topics = await deployContract();
        let error: any;
        const [data] = topicsData;
        let longName = "";
        for (let i = 0; i < 26; i += 1) {
          longName += "a";
        }
        try {
          const addTx = await topics.add(longName, data.description);
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "name should be between 2 and 25 characters long"
        );
      });

      it("should throw an error if the description length is shorter than 10 characters", async () => {
        const topics = await deployContract();
        let error: any;
        const [data] = topicsData;
        try {
          const addTx = await topics.add(data.name, "Too short");
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "description should be between 10 and 250 characters long"
        );
      });

      it("should throw an error if the description is longer than 250", async () => {
        const topics = await deployContract();
        let error: any;
        const [data] = topicsData;
        let longDescription = "";
        for (let i = 0; i < 251; i += 1) {
          longDescription += "a";
        }
        try {
          const addTx = await topics.add(data.name, longDescription);
          await addTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "description should be between 10 and 250 characters long"
        );
      });

      // TODO: Convert to alias (and store as alias key too) for proper checking
      it("should throw an error if the topic already exists", async () => {
        const topics = await deployContract();
        let error: any;
        const [data] = topicsData;
        try {
          const add1Tx = await topics.add(data.name, data.description);
          await add1Tx.wait();
          const add2Tx = await topics.add(data.name, data.description);
          await add2Tx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(`Topic '${data.name}' already exists`);
      });
    });

    describe("Success cases", () => {
      it("should create a topic", async () => {
        const topics = await deployContract();

        const addTx = await topics.add("blockchain", "all about blockchain");
        await addTx.wait();

        const [topic] = await topics.list();

        expect(topic.id.toNumber()).eql(1);
        expect(topic.name).eq("blockchain");
        expect(topic.description).eq("all about blockchain");
      });

      it("should publish a topicAdded event", async () => {
        const topics = await deployContract();

        const addTx = await topics.add("blockchain", "all about blockchain");
        const addTxReceipt = await addTx.wait();

        const events: any[] = addTxReceipt?.events ?? [];
        expect(events).to.have.length(1);
        expect(events[0].event).eq("topicAdded");
        expect(events[0].args.topic.id).eq(1);
        expect(events[0].args.topic.name).eq("blockchain");
        expect(events[0].args.topic.description).eq("all about blockchain");
      });
    });
  });

  describe("list()", () => {
    describe("Success cases", () => {
      it("should return an empty topic list", async () => {
        const topics = await deployContract();
        expect(await topics.list()).to.have.length(0);
      });

      it("should return a list with existing topics", async () => {
        const topics = await deployContract();
        const addTxs = await Promise.all(
          topicsData.map(({ name, description }) =>
            topics.add(name, description)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));

        const topicList = await topics.list();
        expect(topicList).to.have.length(3);
        expect(topicList[2].id.toNumber()).to.eq(3);
        expect(topicList[2].name).eq(topicsData[2].name);
        expect(topicList[2].description).eq(topicsData[2].description);
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const topics = await deployContract();
        let error: any;
        try {
          await topics.getById(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("invalid id");
      });

      it("should return a not found error if topic does not exist", async () => {
        const topics = await deployContract();
        let error: any;
        try {
          await topics.getById(3);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Topic not found");
      });
    });

    describe("Success cases", () => {
      it("should return an existing topic by id", async () => {
        const topics = await deployContract();
        const addTx = await topics.add("blockchain", "all about blockchain");
        await addTx.wait();

        const topic = await topics.getById(1);
        expect(topic.name).eq("blockchain");
        expect(topic.description).eq("all about blockchain");
        validateDate(new Date(topic.createdAt.toNumber()));
        validateDate(new Date(topic.updatedAt.toNumber()));
      });
    });
  });

  describe("exists()", () => {
    describe("Error cases", () => {
      it("should throw an error if the id is lte 0", async () => {
        const topics = await deployContract();
        let error: any;
        try {
          await topics.exists(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("invalid id");
      });
    });
    describe("Success cases", () => {
      it("should return true if a topic exists", async () => {
        const topics = await deployContract();
        const addTxs = await Promise.all(
          topicsData.map(({ name, description }) =>
            topics.add(name, description)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));
        expect(await topics.exists(1)).eq(true);
      });

      it("should return false if a topic does not exist", async () => {
        const topics = await deployContract();
        const addTxs = await Promise.all(
          topicsData.map(({ name, description }) =>
            topics.add(name, description)
          )
        );
        await Promise.all(addTxs.map((tx) => tx.wait()));
        expect(await topics.exists(5)).eq(false);
      });
    });
  });
});

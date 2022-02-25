import { expect } from "chai";
import { ethers } from "hardhat";
import { generateId } from "../test/utils";
import { TagStore, TagLogic, Alexandria } from "../typechain";
import { deployedAddresses } from "../utils";

let tagStore: TagStore;
let tagLogic: TagLogic;
let alexandria: Alexandria;

// Attach to deployed contracts
(async () => {
  const Alexandria = await ethers.getContractFactory("Alexandria");
  alexandria = await Alexandria.attach(deployedAddresses.alexandria);
  const TagStore = await ethers.getContractFactory("TagStore");
  tagStore = await TagStore.attach(deployedAddresses.tagStore);
  const TagLogic = await ethers.getContractFactory("TagLogic");
  tagLogic = await TagLogic.attach(deployedAddresses.tagLogic);

  const [signer] = await ethers.getSigners();

  try {
    // 1. create a couple of tags
    console.log("Creating tag 1");
    let createTagTx = await alexandria.createTag(
      "blockchain",
      "all about blockchain"
    );
    await createTagTx.wait();
    console.log("Creating tag 2");
    createTagTx = await alexandria.createTag("pets", "all about pets");
    await createTagTx.wait();

    // 2. Retrieve each of them by index and id
    console.log("Get tag by id");
    const tag1 = await alexandria.getTagById(
      generateId(["string"], ["blockchain"])
    );
    console.log("Get tag by index");
    const tag2 = await alexandria.getTagByIndex(1);

    console.log({ tag1, tag2 });

    // 3. Count tags
    console.log("Counts tags");
    const count = await alexandria.countTags();
    console.log("tags count:", count);

    // 4. Create a question in the "blockchain"" tag
    const questionData = {
      title: "Which is the difference between L2s and Sidechains in Ethereum?",
      body: "I've heard a lot about those topics regrding scalability in Ethereum, and I want to know more about them.",
      tags: [tag1.id],
    };
    console.log("Creating a question in 'blockchain' tag");
    const createQuestionTx = await alexandria.createQuestion(
      questionData.title,
      questionData.body,
      questionData.tags
    );
    await createQuestionTx.wait();

    // 5. Retrieve the question by id
    const question = await alexandria.getQuestionById(
      generateId(["string", "address"], [questionData.title, signer.address])
    );
    console.log({ question });
  } catch (e: any) {
    console.log("ERROR!", e);
  }
})();

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

  try {
    // 1. create a couple of tags
    console.log("Creating tag 1");
    let createTx = await alexandria.createTag(
      "blockchain",
      "all about blockchain"
    );
    await createTx.wait();
    console.log("Creating tag 2");
    createTx = await alexandria.createTag("pets", "all about pets");
    await createTx.wait();

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
  } catch (e: any) {
    console.log("ERROR!", e);
  }
})();

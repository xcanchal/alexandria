import { expect } from "chai";
import { ethers } from "hardhat";
import { TagStore, TagLogic, Alexandria } from "../../typechain";
import { generateId } from "../utils";
import {
  deployAlexandria,
  deployTagLogic,
  deployTagStore,
} from "../../utils";

describe("Tag", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    // deploy contracts
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    alexandria = await deployAlexandria(tagLogic.address);
    // update references
    await tagStore.upgradeLogic(tagLogic.address);
    await tagLogic.upgradeAlexandria(alexandria.address);
    await alexandria.upgradeTagLogic(tagLogic.address);
  });

  describe("Create tag", () => {
    describe("Error cases", () => {
      it("should throw a 400 error if tag already exists", async () => {
        let error = null;
        try {
          await alexandria.createTag("blockchain", "all about blockchain");
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
        try {
          await alexandria.createTag("blockchain", "blockchain and web3");
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("400");
      });
    });
    describe("Success cases", () => {
      it("should create a tag and emit TagCreated event", (done) => {
        (async () => {
          const [signer] = await ethers.getSigners();
          const name = "blockchain";
          const description = "all about blockchain";

          const id = generateId(["string"], [name]);

          tagStore.on("TagCreated", (tag) => {
            expect(tag).to.not.eq(null);
            expect(tag.id).to.eq(id);
            expect(tag.name).to.eq(name);
            expect(tag.description).to.eq(description);
            expect(tag.creator).to.eq(signer.address);
            expect(new Date(tag.createdAt.toNumber())).to.be.instanceOf(Date);
            expect(new Date(tag.updatedAt.toNumber())).to.be.instanceOf(Date);
            expect(tag.createdAt.toNumber()).to.eq(tag.updatedAt.toNumber());
            done();
          });

          const addTx = await alexandria.createTag(name, description);
          await addTx.wait();
        })();
      });
    });
  });

  describe("Update tag description", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          const updateTx = await alexandria.updateTagDescription(
            generateId(["string"], ["unexisting-tag"]),
            "new description"
          );
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
    describe("Success cases", () => {
      it("should update the tag description and emit TagUpdated event", (done) => {
        (async () => {
          const [signer] = await ethers.getSigners();
          const createTx = await alexandria.createTag("pets", "all about pets");
          await createTx.wait();
          const name = "blockchain";
          const create2Tx = await alexandria.createTag(
            name,
            "all about blockchain"
          );
          await create2Tx.wait();

          const newDescription = "blockchain and web3";
          const id = generateId(["string"], [name]);

          tagStore.on("TagUpdated", (tag) => {
            expect(tag.id).to.eq(id);
            expect(tag.name).to.eq(name);
            expect(tag.description).to.eq(newDescription);
            expect(tag.creator).to.eq(signer.address);
            expect(new Date(tag.updatedAt.toNumber())).to.be.instanceOf(Date);
            expect(tag.updatedAt.toNumber()).to.be.greaterThan(
              tag.createdAt.toNumber()
            );
            done();
          });

          const updateTx = await alexandria.updateTagDescription(
            id,
            newDescription
          );
          await updateTx.wait();
        })();
      });
    });
  });
});

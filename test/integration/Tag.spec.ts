import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Alexandria,
  TagStore,
  TagLogic,
  QuestionStore,
  QuestionLogic,
} from "../../typechain";
import { generateId } from "../utils";
import {
  deployAlexandria,
  deployTagLogic,
  deployTagStore,
  deployQuestionLogic,
  deployQuestionStore,
} from "../../utils";

describe("Tag", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let questionStore: QuestionStore;
  let questionLogic: QuestionLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    // DEPLOY CONTRACTS
    // Tag
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    // Question
    questionStore = await deployQuestionStore();
    questionLogic = await deployQuestionLogic(questionStore.address);
    // Alexandria
    alexandria = await deployAlexandria(
      tagLogic.address,
      questionLogic.address
    );
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
            done();
          });

          const addTx = await alexandria.createTag(name, description);
          await addTx.wait();
        })();
      });
    });
  });

  describe("Update tag", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          const updateTx = await alexandria.updateTag(
            generateId(["string"], ["unexisting-tag"]),
            "new description"
          );
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });

      it("should return a 403 error if the caller is not the creator", async () => {
        let error = null;
        const [signer1, signer2] = await ethers.getSigners();
        try {
          const title = "blockchain";
          const createTx = await alexandria
            .connect(signer1)
            .createTag(title, "all about blockchain");
          await createTx.wait();
          const updateTx = await alexandria
            .connect(signer2)
            .updateTag(
              generateId(["string"], [title]),
              "all about blockchain and web3"
            );
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("403");
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
            done();
          });

          const updateTx = await alexandria.updateTag(id, newDescription);
          await updateTx.wait();
        })();
      });
    });
  });

  describe("Get tag by id", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          await alexandria.getTagById(
            generateId(["string"], ["unexisting-tag"])
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
    describe("Success cases", () => {
      it("should return the existing tag", async () => {
        const name = "pets";
        const description = "all about pets";

        const createTx = await alexandria.createTag(name, description);
        await createTx.wait();

        const id = generateId(["string"], [name]);

        const tag = await alexandria.getTagById(id);
        expect(tag.id).to.eq(id);
        expect(tag.name).to.eq(name);
        expect(tag.description).to.eq(description);
      });
    });
  });

  describe("Get tag by index", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          await alexandria.getTagByIndex(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
    describe("Success cases", () => {
      it("should return the existing tag", async () => {
        const name = "sports";
        const description = "all about sports";

        const createTx = await alexandria.createTag(name, description);
        await createTx.wait();

        const id = generateId(["string"], [name]);

        const tag = await alexandria.getTagByIndex(0);
        expect(tag.id).to.eq(id);
        expect(tag.name).to.eq(name);
        expect(tag.description).to.eq(description);
      });
    });
  });

  describe("Delete tag by id", () => {
    describe("Error cases", () => {
      it("should return a 404 error if tag does not exist", async () => {
        let error = null;
        try {
          await alexandria.deleteTagById(
            generateId(["string"], ["unexisting-tag"])
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
      it("should return a 403 error if the caller is not the creator", async () => {
        let error = null;
        const [signer1, signer2] = await ethers.getSigners();
        try {
          const title = "blockchain";
          const createTx = await alexandria
            .connect(signer1)
            .createTag(title, "all about blockchain");
          await createTx.wait();
          const updateTx = await alexandria
            .connect(signer2)
            .deleteTagById(generateId(["string"], [title]));
          await updateTx.wait();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("403");
      });
    });
    describe("Success cases", () => {
      it("should delete the tag", async () => {
        let error = null;
        const createTx = await alexandria.createTag("pets", "all about pets");
        await createTx.wait();

        const id = generateId(["string"], ["pets"]);
        await alexandria.deleteTagById(id);

        try {
          await alexandria.getTagById(id);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).contains("404");
      });
    });
  });

  describe("Count tags", () => {
    describe("Success cases", () => {
      it("should return the number of existing tags", async () => {
        let count = await alexandria.countTags();
        expect(count).to.eq(0);
        await alexandria.createTag("pets", "all about pets");
        count = await alexandria.countTags();
        expect(count).to.eq(1);
      });
    });
  });
});

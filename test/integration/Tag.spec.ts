import { expect } from "chai";
import { ethers } from "hardhat";
import { TagStore, TagLogic, Alexandria } from "../../typechain";
import { deployAlexandria, deployTagLogic, deployTagStore } from "../utils";

describe("Tag", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    alexandria = await deployAlexandria();
  });

  describe("addTag()", () => {
    describe("Error cases", () => {
      it("should throw error if no TagLogic address set", async () => {
        let error = null;
        try {
          await alexandria.addTag("blockchain", "all about blockchain");
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "Transaction reverted: function call to a non-contract account"
        );
      });

      it("should throw error if tag already exists", async () => {
        await tagStore.upgradeLogic(tagLogic.address);
        await tagLogic.upgradeAlexandria(alexandria.address);
        await alexandria.upgradeTagLogic(tagLogic.address);

        let error = null;
        const name = "blockchain";
        try {
          await alexandria.addTag(name, "all about blockchain");
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
        try {
          await alexandria.addTag(name, "blockchain etc");
        } catch (e: any) {
          error = e;
        }
        console.log(error.message);
        expect(error.message).to.contain(`Tag '${name}' already exists`);
      });
    });

    describe("Success cases", () => {
      beforeEach(async () => {
        await tagStore.upgradeLogic(tagLogic.address);
        await tagLogic.upgradeAlexandria(alexandria.address);
        await alexandria.upgradeTagLogic(tagLogic.address);
      });

      it("should add a new tag", async () => {
        const name = "blockchain";
        const description = "all about blockchain";
        await alexandria.addTag(name, description);
        const tags = await alexandria.listTags();
        expect(tags.length).to.eq(1);
        expect(tags[0].name).to.eq(name);
        expect(tags[0].description).to.eq(description);
      });

      it("should emit a tagAdded event", (done) => {
        (async () => {
          const [signer] = await ethers.getSigners();
          const name = "blockchain";
          const description = "all about blockchain";

          tagLogic.on("tagAdded", (tag) => {
            expect(tag).to.not.eq(null);
            expect(tag.name).to.eq(name);
            expect(tag.description).to.eq(description);
            expect(tag.creator).to.eq(signer.address);
            expect(new Date(tag.createdAt.toNumber())).to.be.instanceOf(Date);
            done();
          });

          await alexandria.addTag(name, description);
        })();
      });
    });
  });

  describe("listTags()", () => {
    describe("Error cases", () => {
      it("should throw error if no TagLogic address set", async () => {
        let error = null;
        try {
          await alexandria.listTags();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain(
          "Transaction reverted: function call to a non-contract account"
        );
      });
    });

    describe("Success cases", () => {
      it("should list existing tags", async () => {
        await tagStore.upgradeLogic(tagLogic.address);
        await tagLogic.upgradeAlexandria(alexandria.address);
        await alexandria.upgradeTagLogic(tagLogic.address);

        await alexandria.addTag("blockchain", "all about blockchain");
        await alexandria.addTag("ethereum", "talk about Ethereum");
        const tags = await alexandria.listTags();

        expect(tags.length).to.eq(2);
        expect(tags[0].name).to.eq("blockchain");
        expect(tags[1].name).to.eq("ethereum");
      });
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { TagStore, TagLogic, Alexandria } from "../../../typechain";
import { deployAlexandria, deployTagLogic, deployTagStore } from "../../utils";

describe("TagLogic", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    alexandria = await deployAlexandria();
  });

  describe("upgradeAlexandria", () => {
    describe("Error cases", () => {
      it("should throw a 403 if not called by owner", async () => {
        const [, wallet2] = await ethers.getSigners();
        let error = null;
        try {
          await tagLogic.connect(wallet2).upgradeAlexandria(alexandria.address);
        } catch (e: any) {
          console.log(e);
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });
    });

    describe("Success cases", () => {
      it("should upgrade alexandria address without errors", async () => {
        const upgradedAlexandria = await deployAlexandria();
        let error = null;
        try {
          await tagLogic.upgradeAlexandria(upgradedAlexandria.address);
        } catch (e: any) {
          console.log(e);
          error = e;
        }
        expect(error).to.eq(null);
      });
    });
  });

  describe("add()", () => {
    describe("Error cases", () => {
      it("should throw error if not called by Alexandria", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.add(
            signer.address,
            "blockchain",
            "all about blockchain"
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("list()", () => {
    describe("Error cases", () => {
      it("should throw error if not called by Alexandria", async () => {
        let error = null;
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.list();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });
});

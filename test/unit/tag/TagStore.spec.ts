import { expect } from "chai";
import { ethers } from "hardhat";
import { TagStore, TagLogic } from "../../../typechain";
import { deployTagLogic, deployTagStore } from "../../utils";

describe("TagStore", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;

  beforeEach(async () => {
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
  });

  describe("upgradeLogic", () => {
    describe("Error cases", () => {
      it("should throw a 403 if not called by owner", async () => {
        const [, signer2] = await ethers.getSigners();
        let error = null;
        try {
          await tagStore.connect(signer2).upgradeLogic(tagLogic.address);
        } catch (e: any) {
          console.log(e);
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });
    });

    describe("Success cases", () => {
      it("should upgrade tagLogic without errors", async () => {
        const upgradedTagLogic = await deployTagLogic(tagStore.address);
        let error = null;
        try {
          await tagStore.upgradeLogic(upgradedTagLogic.address);
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
      });
    });
  });

  describe("add()", () => {
    describe("Error cases", () => {
      it("should throw error if not called by TagLogic", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        await tagStore.upgradeLogic(tagStore.address);
        try {
          await tagStore.add(
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

  describe("exists()", () => {
    describe("Error cases", () => {
      it("should throw error if not called by TagLogic", async () => {
        let error = null;
        try {
          await tagStore.exists("12345678123456781234567812345678");
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("list()", () => {
    describe("error cases", () => {
      it("should throw error if not called by TagLogic", async () => {
        let error = null;
        try {
          await tagStore.list();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });
});

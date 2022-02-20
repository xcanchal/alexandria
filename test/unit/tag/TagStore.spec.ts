import { expect } from "chai";
import { ethers } from "hardhat";
import { TagStore, TagLogic } from "../../../typechain";
import { deployTagLogic, deployTagStore } from "../../../utils";
import { generateId } from "../../utils";

describe("TagStore", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;

  beforeEach(async () => {
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
  });

  describe("upgradeLogic()", () => {
    describe("Error cases", () => {
      it("should throw a 403 if not called by owner", async () => {
        const [, signer2] = await ethers.getSigners();
        let error = null;
        try {
          await tagStore.connect(signer2).upgradeLogic(tagLogic.address);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });
    });

    describe("Success cases", () => {
      it("should allow the owner to upgrade tagLogic", async () => {
        const updatedTagLogic = await deployTagLogic(tagStore.address);
        let error = null;
        try {
          await tagStore.upgradeLogic(updatedTagLogic.address);
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
      });
    });
  });

  describe("create()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by TagLogic", async () => {
        let error = null;
        await tagStore.upgradeLogic(tagLogic.address);
        const [signer] = await ethers.getSigners();
        try {
          await tagStore.create({
            id: generateId(["string"], ["blockchain"]),
            name: "blockchain",
            description: "all about blockchain",
            creator: signer.address,
            deleted: false,
          });
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("updateDescription()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by TagLogic", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          await tagStore.updateDescription(
            signer.address,
            generateId(["string"], ["blockchain"]),
            "all about blockchain and web3"
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("deleteById()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by TagLogic", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          await tagStore.deleteById(
            signer.address,
            generateId(["string"], ["blockchain"])
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by TagLogic", async () => {
        let error = null;
        try {
          await tagStore.getById(generateId(["string"], ["blockchain"]));
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("getByIndex()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by TagLogic", async () => {
        let error = null;
        try {
          await tagStore.getByIndex(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("count()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by TagLogic", async () => {
        let error = null;
        try {
          await tagStore.count();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });
});

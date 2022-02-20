import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Alexandria,
  TagStore,
  TagLogic,
  QuestionStore,
  QuestionLogic,
} from "../../../typechain";
import {
  deployAlexandria,
  deployTagLogic,
  deployTagStore,
  deployQuestionLogic,
  deployQuestionStore,
} from "../../../utils";
import { generateId } from "../../utils";

describe("TagLogic", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let questionStore: QuestionStore;
  let questionLogic: QuestionLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    questionStore = await deployQuestionStore();
    questionLogic = await deployQuestionLogic(questionStore.address);
    alexandria = await deployAlexandria(
      tagLogic.address,
      questionLogic.address
    );
  });

  describe("upgradeAlexandria()", () => {
    describe("Error cases", () => {
      it("should throw a 403 if not called by owner", async () => {
        const [, wallet2] = await ethers.getSigners();
        let error = null;
        try {
          await tagLogic.connect(wallet2).upgradeAlexandria(alexandria.address);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });
    });

    describe("Success cases", () => {
      it("should upgrade alexandria address without errors", async () => {
        const upgradedAlexandria = await deployAlexandria(
          tagLogic.address,
          questionLogic.address
        );
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

  describe("create()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by Alexandria", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.create(
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

  describe("updateDescription()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by Alexandria", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.updateDescription(
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

  describe("getById()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by Alexandria", async () => {
        let error = null;
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.getById(generateId(["string"], ["blockchain"]));
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("getByIndex()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by Alexandria", async () => {
        let error = null;
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.getByIndex(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("deleteById()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by Alexandria", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.deleteById(
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

  describe("count()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by Alexandria", async () => {
        let error = null;
        await tagLogic.upgradeAlexandria(alexandria.address);
        try {
          await tagLogic.count();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });
});

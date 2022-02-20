import { expect } from "chai";
import { ethers } from "hardhat";
import { QuestionStore, QuestionLogic } from "../../../typechain";
import { deployQuestionLogic, deployQuestionStore } from "../../../utils";
import { generateId } from "../../utils";

describe("QuestionStore", () => {
  let questionStore: QuestionStore;
  let questionLogic: QuestionLogic;

  beforeEach(async () => {
    questionStore = await deployQuestionStore();
    questionLogic = await deployQuestionLogic(questionStore.address);
  });

  describe("upgradeLogic()", () => {
    describe("Error cases", () => {
      it("should throw a 403 if not called by owner", async () => {
        const [, signer2] = await ethers.getSigners();
        let error = null;
        try {
          await questionStore
            .connect(signer2)
            .upgradeLogic(questionLogic.address);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("Ownable: caller is not the owner");
      });
    });

    describe("Success cases", () => {
      it("should allow the owner to upgrade questionLogic", async () => {
        const updatedQuestionLogic = await deployQuestionLogic(
          questionStore.address
        );
        let error = null;
        try {
          await questionStore.upgradeLogic(updatedQuestionLogic.address);
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
      });
    });
  });

  describe("create()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by QuestionLogic", async () => {
        let error = null;
        await questionStore.upgradeLogic(questionLogic.address);
        const [signer] = await ethers.getSigners();
        try {
          const title = "what are L2s in ethereum?";
          await questionStore.create({
            id: generateId(["string", "string"], [title, signer.address]),
            title,
            body: "I recently heard about L2 and I want to know how they work.",
            creator: signer.address,
            deleted: false,
            tags: ["web3", "blockchain", "ethereum"],
          });
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("update()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by QuestionLogic", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          await questionStore.update(
            signer.address,
            generateId(
              ["string", "string"],
              ["what are L2s in ethereum?", signer.address]
            ),
            "Modified title",
            "Modified description",
            ["web3", "blockchain"]
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
      it("should throw 403 error if not called by QuestionLogic", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          await questionStore.deleteById(
            signer.address,
            generateId(
              ["string", "string"],
              ["what are L2s in ethereum?", signer.address]
            )
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
      it("should throw 403 error if not called by QuestionLogic", async () => {
        let error = null;
        const [signer] = await ethers.getSigners();
        try {
          await questionStore.getById(
            generateId(
              ["string", "string"],
              ["what are L2s in ethereum?", signer.address]
            )
          );
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("getByIndex()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by QuestionLogic", async () => {
        let error = null;
        try {
          await questionStore.getByIndex(0);
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });

  describe("count()", () => {
    describe("Error cases", () => {
      it("should throw 403 error if not called by QuestionLogic", async () => {
        let error = null;
        try {
          await questionStore.count();
        } catch (e: any) {
          error = e;
        }
        expect(error.message).to.contain("403");
      });
    });
  });
});

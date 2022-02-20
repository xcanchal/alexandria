import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Alexandria,
  TagStore,
  TagLogic,
  QuestionStore,
  QuestionLogic,
} from "../../typechain";
import {
  deployAlexandria,
  deployTagLogic,
  deployTagStore,
  deployQuestionLogic,
  deployQuestionStore,
} from "../../utils";

describe("Alexandria", () => {
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

  describe("upgradeTagLogic()", () => {
    describe("Error cases", () => {
      it("should throw a 403 if not called by the owner", async () => {
        const [, wallet2] = await ethers.getSigners();
        let error = null;
        try {
          await alexandria.connect(wallet2).upgradeTagLogic(tagLogic.address);
        } catch (e: any) {
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
          await alexandria.upgradeTagLogic(upgradedTagLogic.address);
        } catch (e: any) {
          error = e;
        }
        expect(error).to.eq(null);
      });
    });
  });
});

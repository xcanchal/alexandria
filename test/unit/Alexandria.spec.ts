import { expect } from "chai";
import { ethers } from "hardhat";
import { TagStore, TagLogic, Alexandria } from "../../typechain";
import { deployAlexandria, deployTagLogic, deployTagStore } from "../utils";

describe("Alexandria", () => {
  let tagStore: TagStore;
  let tagLogic: TagLogic;
  let alexandria: Alexandria;

  beforeEach(async () => {
    tagStore = await deployTagStore();
    tagLogic = await deployTagLogic(tagStore.address);
    alexandria = await deployAlexandria();
  });

  describe("upgradeTagLogic() - error cases", () => {
    it("should throw a 403 if not called by owner", async () => {
      const [, wallet2] = await ethers.getSigners();
      let error = null;
      try {
        await alexandria.connect(wallet2).upgradeTagLogic(tagLogic.address);
      } catch (e: any) {
        console.log(e);
        error = e;
      }
      expect(error.message).to.contain("Ownable: caller is not the owner");
    });
  });

  describe("upgradeTagLogic() - success cases", () => {
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

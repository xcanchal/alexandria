"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const utils_1 = require("../utils");
describe("Alexandria", () => {
    let tagStore;
    let tagLogic;
    let alexandria;
    beforeEach(async () => {
        tagStore = await utils_1.deployTagStore();
        tagLogic = await utils_1.deployTagLogic(tagStore.address);
        alexandria = await utils_1.deployAlexandria();
    });
    describe("upgradeTagLogic() - error cases", () => {
        it("should throw a 403 if not called by owner", async () => {
            const [, wallet2] = await hardhat_1.ethers.getSigners();
            let error = null;
            try {
                await alexandria.connect(wallet2).upgradeTagLogic(tagLogic.address);
            }
            catch (e) {
                console.log(e);
                error = e;
            }
            chai_1.expect(error.message).to.contain("Ownable: caller is not the owner");
        });
    });
    describe("upgradeTagLogic() - success cases", () => {
        it("should upgrade tagLogic without errors", async () => {
            const upgradedTagLogic = await utils_1.deployTagLogic(tagStore.address);
            let error = null;
            try {
                await alexandria.upgradeTagLogic(upgradedTagLogic.address);
            }
            catch (e) {
                error = e;
            }
            chai_1.expect(error).to.eq(null);
        });
    });
});

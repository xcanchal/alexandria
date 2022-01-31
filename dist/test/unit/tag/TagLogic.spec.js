"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const utils_1 = require("../../utils");
describe("TagLogic", () => {
    let tagStore;
    let tagLogic;
    let alexandria;
    beforeEach(async () => {
        tagStore = await utils_1.deployTagStore();
        tagLogic = await utils_1.deployTagLogic(tagStore.address);
        alexandria = await utils_1.deployAlexandria();
    });
    describe("upgradeAlexandria", () => {
        describe("Error cases", () => {
            it("should throw a 403 if not called by owner", async () => {
                const [, wallet2] = await hardhat_1.ethers.getSigners();
                let error = null;
                try {
                    await tagLogic.connect(wallet2).upgradeAlexandria(alexandria.address);
                }
                catch (e) {
                    console.log(e);
                    error = e;
                }
                chai_1.expect(error.message).to.contain("Ownable: caller is not the owner");
            });
        });
        describe("Success cases", () => {
            it("should upgrade alexandria address without errors", async () => {
                const upgradedAlexandria = await utils_1.deployAlexandria();
                let error = null;
                try {
                    await tagLogic.upgradeAlexandria(upgradedAlexandria.address);
                }
                catch (e) {
                    console.log(e);
                    error = e;
                }
                chai_1.expect(error).to.eq(null);
            });
        });
    });
    describe("add()", () => {
        describe("Error cases", () => {
            it("should throw error if not called by Alexandria", async () => {
                let error = null;
                const [signer] = await hardhat_1.ethers.getSigners();
                await tagLogic.upgradeAlexandria(alexandria.address);
                try {
                    await tagLogic.add(signer.address, "blockchain", "all about blockchain");
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("403");
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
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("403");
            });
        });
    });
});

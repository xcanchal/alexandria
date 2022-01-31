"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const utils_1 = require("../../utils");
describe("TagStore", () => {
    let tagStore;
    let tagLogic;
    beforeEach(async () => {
        tagStore = await utils_1.deployTagStore();
        tagLogic = await utils_1.deployTagLogic(tagStore.address);
    });
    describe("upgradeLogic", () => {
        describe("Error cases", () => {
            it("should throw a 403 if not called by owner", async () => {
                const [, signer2] = await hardhat_1.ethers.getSigners();
                let error = null;
                try {
                    await tagStore.connect(signer2).upgradeLogic(tagLogic.address);
                }
                catch (e) {
                    console.log(e);
                    error = e;
                }
                chai_1.expect(error.message).to.contain("Ownable: caller is not the owner");
            });
        });
        describe("Success cases", () => {
            it("should upgrade tagLogic without errors", async () => {
                const upgradedTagLogic = await utils_1.deployTagLogic(tagStore.address);
                let error = null;
                try {
                    await tagStore.upgradeLogic(upgradedTagLogic.address);
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error).to.eq(null);
            });
        });
    });
    describe("add()", () => {
        describe("Error cases", () => {
            it("should throw error if not called by TagLogic", async () => {
                let error = null;
                const [signer] = await hardhat_1.ethers.getSigners();
                await tagStore.upgradeLogic(tagStore.address);
                try {
                    await tagStore.add(signer.address, "blockchain", "all about blockchain");
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("403");
            });
        });
    });
    describe("exists()", () => {
        describe("Error cases", () => {
            it("should throw error if not called by TagLogic", async () => {
                let error = null;
                try {
                    await tagStore.exists("12345678123456781234567812345678");
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("403");
            });
        });
    });
    describe("list()", () => {
        describe("error cases", () => {
            it("should throw error if not called by TagLogic", async () => {
                let error = null;
                try {
                    await tagStore.list();
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("403");
            });
        });
    });
});

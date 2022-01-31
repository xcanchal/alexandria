"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const utils_1 = require("../utils");
describe("Tag", () => {
    let tagStore;
    let tagLogic;
    let alexandria;
    beforeEach(async () => {
        tagStore = await utils_1.deployTagStore();
        tagLogic = await utils_1.deployTagLogic(tagStore.address);
        alexandria = await utils_1.deployAlexandria();
    });
    describe("addTag()", () => {
        describe("Error cases", () => {
            it("should throw error if no TagLogic address set", async () => {
                let error = null;
                try {
                    await alexandria.addTag("blockchain", "all about blockchain");
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("Transaction reverted: function call to a non-contract account");
            });
            it("should throw error if tag already exists", async () => {
                await tagStore.upgradeLogic(tagLogic.address);
                await tagLogic.upgradeAlexandria(alexandria.address);
                await alexandria.upgradeTagLogic(tagLogic.address);
                let error = null;
                const name = "blockchain";
                try {
                    await alexandria.addTag(name, "all about blockchain");
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error).to.eq(null);
                try {
                    await alexandria.addTag(name, "blockchain etc");
                }
                catch (e) {
                    error = e;
                }
                console.log(error.message);
                chai_1.expect(error.message).to.contain(`Tag '${name}' already exists`);
            });
        });
        describe("Success cases", () => {
            beforeEach(async () => {
                await tagStore.upgradeLogic(tagLogic.address);
                await tagLogic.upgradeAlexandria(alexandria.address);
                await alexandria.upgradeTagLogic(tagLogic.address);
            });
            it("should add a new tag", async () => {
                const name = "blockchain";
                const description = "all about blockchain";
                await alexandria.addTag(name, description);
                const tags = await alexandria.listTags();
                chai_1.expect(tags.length).to.eq(1);
                chai_1.expect(tags[0].name).to.eq(name);
                chai_1.expect(tags[0].description).to.eq(description);
            });
            it("should emit a tagAdded event", (done) => {
                (async () => {
                    const [signer] = await hardhat_1.ethers.getSigners();
                    const name = "blockchain";
                    const description = "all about blockchain";
                    tagLogic.on("tagAdded", (tag) => {
                        chai_1.expect(tag).to.not.eq(null);
                        chai_1.expect(tag.name).to.eq(name);
                        chai_1.expect(tag.description).to.eq(description);
                        chai_1.expect(tag.creator).to.eq(signer.address);
                        chai_1.expect(new Date(tag.createdAt.toNumber())).to.be.instanceOf(Date);
                        done();
                    });
                    await alexandria.addTag(name, description);
                })();
            });
        });
    });
    describe("listTags()", () => {
        describe("Error cases", () => {
            it("should throw error if no TagLogic address set", async () => {
                let error = null;
                try {
                    await alexandria.listTags();
                }
                catch (e) {
                    error = e;
                }
                chai_1.expect(error.message).to.contain("Transaction reverted: function call to a non-contract account");
            });
        });
        describe("Success cases", () => {
            it("should list existing tags", async () => {
                await tagStore.upgradeLogic(tagLogic.address);
                await tagLogic.upgradeAlexandria(alexandria.address);
                await alexandria.upgradeTagLogic(tagLogic.address);
                await alexandria.addTag("blockchain", "all about blockchain");
                await alexandria.addTag("ethereum", "talk about Ethereum");
                const tags = await alexandria.listTags();
                chai_1.expect(tags.length).to.eq(2);
                chai_1.expect(tags[0].name).to.eq("blockchain");
                chai_1.expect(tags[1].name).to.eq("ethereum");
            });
        });
    });
});

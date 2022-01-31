"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.impersonateAccount = exports.deployTagLogic = exports.deployTagStore = exports.deployAlexandria = void 0;
const hardhat_1 = __importStar(require("hardhat"));
async function deployAlexandria() {
    const Alexandria = await hardhat_1.ethers.getContractFactory("Alexandria");
    const alexandria = await Alexandria.deploy();
    await alexandria.deployed();
    return alexandria;
}
exports.deployAlexandria = deployAlexandria;
async function deployTagStore() {
    const TagStore = await hardhat_1.ethers.getContractFactory("TagStore");
    const tagStore = await TagStore.deploy();
    await tagStore.deployed();
    return tagStore;
}
exports.deployTagStore = deployTagStore;
async function deployTagLogic(tagStoreAddr) {
    const TagLogic = await hardhat_1.ethers.getContractFactory("TagLogic");
    const tagLogic = await TagLogic.deploy(tagStoreAddr);
    await tagLogic.deployed();
    return tagLogic;
}
exports.deployTagLogic = deployTagLogic;
async function impersonateAccount(address) {
    await hardhat_1.default.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address],
    });
}
exports.impersonateAccount = impersonateAccount;

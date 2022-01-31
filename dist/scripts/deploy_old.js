"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const Topics = await hardhat_1.ethers.getContractFactory("Topics");
    const topics = await Topics.deploy();
    await topics.deployed();
    console.log("Topics deployed to:", topics.address);
    const Users = await hardhat_1.ethers.getContractFactory("Users");
    const users = await Users.deploy();
    await users.deployed();
    console.log("Users deployed to:", users.address);
    const Questions = await hardhat_1.ethers.getContractFactory("Questions");
    const questions = await Questions.deploy(topics.address, users.address);
    await questions.deployed();
    console.log("Questions deployed to:", questions.address);
    const Answers = await hardhat_1.ethers.getContractFactory("Answers");
    const answers = await Answers.deploy(questions.address, users.address);
    await answers.deployed();
    console.log("Answers deployed to:", answers.address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

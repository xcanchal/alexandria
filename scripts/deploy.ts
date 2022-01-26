import { ethers } from "hardhat";

async function main() {
  const Topics = await ethers.getContractFactory("Topics");
  const topics = await Topics.deploy();
  await topics.deployed();
  console.log("Topics deployed to:", topics.address);

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();
  console.log("Users deployed to:", users.address);

  const Questions = await ethers.getContractFactory("Questions");
  const questions = await Questions.deploy(topics.address, users.address);
  await questions.deployed();
  console.log("Questions deployed to:", questions.address);

  const Answers = await ethers.getContractFactory("Answers");
  const answers = await Answers.deploy(questions.address, users.address);
  await answers.deployed();
  console.log("Answers deployed to:", answers.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

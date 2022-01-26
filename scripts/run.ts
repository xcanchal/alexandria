import { ethers } from "hardhat";

const categoriesData = [
  { name: "photography", description: "all about photography" },
  { name: "blockchain", description: "all about blockchain" },
  { name: "pets", description: "all about pets" },
];

const usersData = [
  {
    username: "xcanchal",
    bio: "Full stack software engineer",
    avatar: "ipfs://some-avatar.png",
  },
  {
    username: "sdali",
    bio: "Surrealist painter",
    avatar: "ipfs://avatar-url.png",
  },
];

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

  // Create some categories
  const addTxs = await Promise.all(
    categoriesData.map(({ name, description }) => topics.add(name, description))
  );
  await Promise.all(addTxs.map((tx) => tx.wait()));
  console.log(await topics.list());

  // Create a couple of users
  const [, signer1, signer2] = await ethers.getSigners();
  const [user1, user2] = usersData;

  const addUser1Tx = await users
    .connect(signer1)
    .add(user1.username, user1.bio, user1.avatar);
  await addUser1Tx.wait();

  const addUser2Tx = await users
    .connect(signer2)
    .add(user2.username, user2.bio, user2.avatar);
  await addUser2Tx.wait();

  console.log(await users.list());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

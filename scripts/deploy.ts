import { ethers } from "hardhat";

const categoriesData = [
  { name: "photography", description: "all about photography" },
  { name: "blockchain", description: "all about blockchain" },
  { name: "pets", description: "all about pets" },
];

/* const usersData = [
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
]; */

async function main() {
  const Categories = await ethers.getContractFactory("Categories");
  const categories = await Categories.deploy();
  await categories.deployed();
  console.log("Categories deployed to:", categories.address);

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();
  console.log("Users deployed to:", users.address);

  const Questions = await ethers.getContractFactory("Questions");
  const questions = await Questions.deploy(categories.address, users.address);
  await questions.deployed();
  console.log("Questions deployed to:", questions.address);

  // Create some categories
  /* const addCategory1Tx = await categories.add(
    categoriesData[0].name,
    categoriesData[0].description
  );
  await addCategory1Tx.wait();
  const addCategory2Tx = await categories.add(
    categoriesData[1].name,
    categoriesData[1].description
  );
  await addCategory2Tx.wait();
  const addCategory3Tx = await categories.add(
    categoriesData[2].name,
    categoriesData[2].description
  );
  await addCategory3Tx.wait();

  console.log("Created categories:");
  console.log(await categories.list()); */

  // Create a couple of users
  /* const [, signer1, signer2] = await ethers.getSigners();
  const [user1, user2] = usersData;

  const addUser1Tx = await users
    .connect(signer1)
    .add(user1.username, user1.bio, user1.avatar);
  await addUser1Tx.wait();

  const addUser2Tx = await users
    .connect(signer2)
    .add(user2.username, user2.bio, user2.avatar);
  await addUser2Tx.wait();

  console.log(await users.list()); */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

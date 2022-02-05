import { ethers } from "hardhat";
import { deployAlexandria, deployTagStore, deployTagLogic } from "../utils";

async function main() {
  // Deploy contracts
  const tagStore = await deployTagStore();
  console.log("TagStore deployed to:", tagStore.address);

  const tagLogic = await deployTagLogic(tagStore.address);
  console.log("TagLogic deployed to:", tagLogic.address);

  const alexandria = await deployAlexandria(tagLogic.address);
  console.log("Alexandria deployed to:", alexandria.address);

  // Upgrade references
  await alexandria.upgradeTagLogic(tagLogic.address);
  console.log("Alexandria's tagLogic set");

  await tagLogic.upgradeAlexandria(alexandria.address);
  console.log("TagLogic's Alexandria set");

  await tagStore.upgradeLogic(tagLogic.address);
  console.log("TagLogic's TagStore set");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

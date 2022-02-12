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

  const upgradeTx1 = await tagStore.upgradeLogic(tagLogic.address);
  await upgradeTx1.wait();
  console.log("TagLogic address set in TagStore");

  const upgradeTx2 = await tagLogic.upgradeAlexandria(alexandria.address);
  await upgradeTx2.wait();
  console.log("Alexandria address set in TagLogic");

  const upgradeTx3 = await alexandria.upgradeTagLogic(tagLogic.address);
  await upgradeTx3.wait();
  console.log("TagLogic address set in Alexandria");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

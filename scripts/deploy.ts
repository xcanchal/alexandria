import { ethers } from "hardhat";
import { deployAlexandria, deployTagStore, deployTagLogic } from "../utils";

function upgradeLogicInAlexandria() {

}

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy contracts
  const tagStore = await deployTagStore();
  console.log("TagStore deployed to:", tagStore.address);

  const tagLogic = await deployTagLogic(tagStore.address);
  console.log("TagLogic deployed to:", tagLogic.address);

  const alexandria = await deployAlexandria(tagLogic.address);
  console.log("Alexandria deployed to:", alexandria.address);

  // Upgrade references

  const tagStoreInstance = new ethers.Contract(
    tagStore.address,
    ["function upgradeLogic(address _logicAddress) public"],
    signer
  );
  await tagStoreInstance.upgradeLogic(tagLogic.address);
  console.log("Updated TagLogic reference in TagStore", tagLogic.address);

  const tagLogicInstance = new ethers.Contract(
    tagLogic.address,
    ["function upgradeAlexandria(address _alexandriaAddr) public"], // used abi
    signer
  );
  await tagLogicInstance.upgradeAlexandria(alexandria.address);
  console.log("Updated Alexandria reference in TagLogic");

  const alexandriaInstance = new ethers.Contract(
    alexandria.address,
    ["function upgradeTagLogic(address _tagLogicAddr) public"],
    signer
  );
  await alexandriaInstance.upgradeTagLogic(tagLogic.address);
  console.log("Updated TagLogic reference in Alexandria", tagLogic.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

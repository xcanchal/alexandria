import { ethers } from "hardhat";
import { deployTagLogic, deployedAddresses } from "../utils";

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy contract
  const tagLogic = await deployTagLogic(deployedAddresses.tagStore);
  console.log("TagLogic deployed to:", tagLogic.address);

  // Update references
  const alexandriaAbi = [
    "function upgradeTagLogic(address _tagLogicAddr) public",
  ];
  const alexandria = new ethers.Contract(
    deployedAddresses.alexandria,
    alexandriaAbi,
    signer
  );
  await alexandria.upgradeTagLogic(tagLogic.address);
  console.log("Updated TagLogic reference in Alexandria", tagLogic.address);

  const tagStoreAbi = ["function upgradeLogic(address _logicAddress) public"];
  const tagStore = new ethers.Contract(
    deployedAddresses.tagStore,
    tagStoreAbi,
    signer
  );
  await tagStore.upgradeLogic(tagLogic.address);
  console.log("Updated TagLogic reference in TagStore", tagLogic.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

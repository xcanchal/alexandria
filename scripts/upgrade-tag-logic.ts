import { ethers } from "hardhat";
import { deployTagLogic, deployedAddresses } from "../utils";

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy contract
  const tagLogic = await deployTagLogic(deployedAddresses.tagStore);
  console.log("TagLogic deployed to:", tagLogic.address);

  // Update references
  const alexandria = new ethers.Contract(
    deployedAddresses.alexandria,
    ["function upgradeTagLogic(address _tagLogicAddr) public"], // used abi
    signer
  );
  await alexandria.upgradeTagLogic(tagLogic.address);
  console.log("Updated TagLogic reference in Alexandria", tagLogic.address);

  const tagStore = new ethers.Contract(
    deployedAddresses.tagStore,
    ["function upgradeLogic(address _logicAddress) public"], // used abi
    signer
  );
  await tagStore.upgradeLogic(tagLogic.address);
  console.log("Updated TagLogic reference in TagStore", tagLogic.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

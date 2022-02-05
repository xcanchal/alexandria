import { ethers } from "hardhat";
import { deployAlexandria, deployedAddresses } from "../utils";

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy contract
  const alexandria = await deployAlexandria(deployedAddresses.tagLogic);
  console.log("Alexandria deployed to:", alexandria.address);

  // Update references
  const tagLogicAbi = [
    "function upgradeAlexandria(address _alexandriaAddr) public",
  ];
  const tagLogic = new ethers.Contract(
    deployedAddresses.tagLogic,
    tagLogicAbi,
    signer
  );
  await tagLogic.upgradeAlexandria(alexandria.address);
  console.log("Updated Alexandria reference in TagLogic");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

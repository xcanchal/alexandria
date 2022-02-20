import { ethers } from "hardhat";
import { deployAlexandria, deployedAddresses } from "../utils";

async function main() {
  // GET OWNER SIGNER (DEPLOYER)
  const [signer] = await ethers.getSigners();

  // DEPLOY CONTRACT
  const alexandria = await deployAlexandria(
    deployedAddresses.tagLogic,
    deployedAddresses.questionLogic
  );
  console.log("Alexandria deployed to:", alexandria.address);

  // UPDATE REFERENCES

  // Tag
  const tagLogic = new ethers.Contract(
    deployedAddresses.tagLogic,
    ["function upgradeAlexandria(address _alexandriaAddr) public"], // used abi
    signer
  );
  await tagLogic.upgradeAlexandria(alexandria.address);
  console.log("Updated Alexandria reference in TagLogic");

  // Question
  const questionLogic = new ethers.Contract(
    deployedAddresses.questionLogic,
    ["function upgradeAlexandria(address _alexandriaAddr) public"], // used abi
    signer
  );
  await questionLogic.upgradeAlexandria(alexandria.address);
  console.log("Updated Alexandria reference in QuestionLogic");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

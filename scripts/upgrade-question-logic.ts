import { ethers } from "hardhat";
import { deployQuestionLogic, deployedAddresses } from "../utils";

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy contract
  const questionLogic = await deployQuestionLogic(
    deployedAddresses.questionStore
  );
  console.log("QuestionLogic deployed to:", questionLogic.address);

  // Update references
  const alexandria = new ethers.Contract(
    deployedAddresses.alexandria,
    ["function upgradeQuestionLogic(address _questionLogicAddr) public"], // used abi
    signer
  );
  await alexandria.upgradeQuestionLogic(questionLogic.address);
  console.log(
    "Updated QuestionLogic reference in Alexandria",
    questionLogic.address
  );

  const questionStore = new ethers.Contract(
    deployedAddresses.questionStore,
    ["function upgradeLogic(address _logicAddress) public"], // used abi
    signer
  );
  await questionStore.upgradeLogic(questionLogic.address);
  console.log(
    "Updated QuestionLogic reference in TagStore",
    questionLogic.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

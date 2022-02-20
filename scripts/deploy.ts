import { ethers } from "hardhat";
import {
  deployAlexandria,
  deployTagStore,
  deployTagLogic,
  deployQuestionStore,
  deployQuestionLogic,
} from "../utils";

async function main() {
  // GET OWNER SIGNER (deployer)

  const [signer] = await ethers.getSigners();

  // DEPLOY CONTRACTS

  // Tag
  const tagStore = await deployTagStore();
  console.log("TagStore deployed to:", tagStore.address);

  const tagLogic = await deployTagLogic(tagStore.address);
  console.log("TagLogic deployed to:", tagLogic.address);

  // Question
  const questionStore = await deployQuestionStore();
  console.log("QuestionStore deployed to:", questionStore.address);

  const questionLogic = await deployQuestionLogic(questionStore.address);
  console.log("QuestionLogic deployed to:", questionLogic.address);

  // Alexandria
  const alexandria = await deployAlexandria(
    tagLogic.address,
    questionLogic.address
  );
  console.log("Alexandria deployed to:", alexandria.address);

  // UPGRADE REFERENCES

  // Tag
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

  // Question
  const questionStoreInstance = new ethers.Contract(
    questionStore.address,
    ["function upgradeLogic(address _logicAddress) public"],
    signer
  );
  await questionStoreInstance.upgradeLogic(questionLogic.address);
  console.log(
    "Updated QuestionLogic reference in QuestionStore",
    questionLogic.address
  );

  const questionLogicInstance = new ethers.Contract(
    questionLogic.address,
    ["function upgradeAlexandria(address _alexandriaAddr) public"], // used abi
    signer
  );
  await questionLogicInstance.upgradeAlexandria(alexandria.address);
  console.log("Updated Alexandria reference in QuestionLogic");

  // Alexandria
  const alexandriaInstance = new ethers.Contract(
    alexandria.address,
    [
      "function upgradeTagLogic(address _tagLogicAddr) public",
      "function upgradeQuestionLogic(address _questiongLogicAddr) public",
    ],
    signer
  );
  await alexandriaInstance.upgradeTagLogic(tagLogic.address);
  console.log("Updated TagLogic reference in Alexandria", tagLogic.address);
  await alexandriaInstance.upgradeQuestionLogic(questionLogic.address);
  console.log(
    "Updated QuestionLogic reference in Alexandria",
    questionLogic.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import hre, { ethers } from "hardhat";

export const deployedAddresses = {
  // rinkeby
  alexandria: "0x46E367231Efda95953e6f00f4e4fe68fFd6648bB",
  // tag
  tagStore: "0x8B35171D0cD0816F56024F428cB3451324538668",
  tagLogic: "0xaCbD6484E605e1a8b469aD955802b84aDBF997c4",
  // question
  questionStore: "0x8ee83d0D21Ea919d2E01af9adb209b6C9167D780",
  questionLogic: "0x95CE7c10949BFe38f2ebbDc8B1c5C7D1684e2b81",
};

/* Alexandria */

export async function deployAlexandria(
  tagLogicAddr: string,
  questionLogicAddr: string
) {
  const Alexandria = await ethers.getContractFactory("Alexandria");
  const alexandria = await Alexandria.deploy(tagLogicAddr, questionLogicAddr);
  await alexandria.deployed();
  return alexandria;
}

/* Tag */

export async function deployTagStore() {
  const TagStore = await ethers.getContractFactory("TagStore");
  const tagStore = await TagStore.deploy();
  await tagStore.deployed();
  return tagStore;
}

export async function deployTagLogic(tagStoreAddr: string) {
  const TagLogic = await ethers.getContractFactory("TagLogic");
  const tagLogic = await TagLogic.deploy(tagStoreAddr);
  await tagLogic.deployed();
  return tagLogic;
}

/* Question */

export async function deployQuestionStore() {
  const QuestionStore = await ethers.getContractFactory("QuestionStore");
  const questionStore = await QuestionStore.deploy();
  await questionStore.deployed();
  return questionStore;
}

export async function deployQuestionLogic(questionStoreAddr: string) {
  const QuestionLogic = await ethers.getContractFactory("QuestionLogic");
  const questionLogic = await QuestionLogic.deploy(questionStoreAddr);
  await questionLogic.deployed();
  return questionLogic;
}

/* export async function impersonateAccount(address: string) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
} */

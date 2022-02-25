import hre, { ethers } from "hardhat";

export const deployedAddresses = {
  // rinkeby
  alexandria: "0x00C81384C9fc9570FD6826E1ad79E984EDb81A50",
  // tag
  tagStore: "0xEC6A9AAe3929b1D1B3FABA41067B8a274083E5Be",
  tagLogic: "0x570CFb7F6993BA5a065eC055B57cC6686Bb64246",
  // question
  questionStore: "0x54dF42969b0aB4c05f49709e9D5c2B24DEC2785C",
  questionLogic: "0xD5E917d72eECd7b4347F7A953363414B89fBeF9c",
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

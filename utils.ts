import hre, { ethers } from "hardhat";

export const deployedAddresses = {
  // rinkeby
  tagStore: "0x61a41c69a69173a8556B49f39549f2737f24C504",
  tagLogic: "0xEbCA289Aea2119d5dc97C766fd7Dd46EdFc21e70",
  alexandria: "0x12159Bb06B1cBDe6EbA0F420b3Fdbf01fBfB414E",
};

export async function deployAlexandria(tagLogicAddr: string) {
  const Alexandria = await ethers.getContractFactory("Alexandria");
  const alexandria = await Alexandria.deploy(tagLogicAddr);
  await alexandria.deployed();
  return alexandria;
}

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

/* export async function impersonateAccount(address: string) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
} */

import hre, { ethers } from "hardhat";

export async function deployAlexandria() {
  const Alexandria = await ethers.getContractFactory("Alexandria");
  const alexandria = await Alexandria.deploy();
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

export async function impersonateAccount(address: string) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
}

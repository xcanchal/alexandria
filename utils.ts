import hre, { ethers } from "hardhat";

export const deployedAddresses = {
  tagStore: "0x45B971e07794f01A8bFcB77527e4296baE04dB4e",
  tagLogic: "0x4b465d9dD1E7Db1a0195Fb387362e0618edA818B",
  alexandria: "0xb327C5EC72aCc647b1c676747B2ccE10d2481A81",
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

export async function impersonateAccount(address: string) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
}

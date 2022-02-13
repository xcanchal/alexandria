import hre, { ethers } from "hardhat";

export const deployedAddresses = {
  // rinkeby
  tagStore: "0x118FDeA4400CA0512571d2c1EcB082C0a9A7dB3f",
  tagLogic: "0x5B5BEec44CBCBC4EDb7f422969f6067c59255d67",
  alexandria: "0xf48bCd3688dbc1A7757481313C10bc5e4548D464",
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

import hre, { ethers } from "hardhat";

export const deployedAddresses = {
  // rinkeby
  tagStore: "0xd7e452De4012a4a2003FD096779a903568A762fd",
  tagLogic: "0x137875b947B50431A814c3aF1D92fdA928E472af",
  alexandria: "0x443D2003608908BE4DAA6De38b33Eaf60C7D8B77",
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

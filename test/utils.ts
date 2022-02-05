import { ethers } from "hardhat";

export function generateId(params: any[]) {
  return ethers.utils.keccak256(params);
}

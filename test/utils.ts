import { ethers } from "hardhat";

export function generateId(types: any[] = [], values: any[] = []): string {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(types, values)
  );
}

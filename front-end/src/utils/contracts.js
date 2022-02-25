import { ethers } from 'ethers';

import Alexandria from '../abis/Alexandria.json';

export const contracts = {
  alexandria: {
    name: 'alexandria',
    address: '0x46E367231Efda95953e6f00f4e4fe68fFd6648bB',
    abi: Alexandria.abi,
  },
};

export function getContract(name) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const { address, abi } = contracts[name];
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};

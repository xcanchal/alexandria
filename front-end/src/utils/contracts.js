import { ethers } from 'ethers';

import Alexandria from '../abis/Alexandria.json';

export const contracts = {
  alexandria: {
    name: 'alexandria',
    address: '0x443D2003608908BE4DAA6De38b33Eaf60C7D8B77',
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

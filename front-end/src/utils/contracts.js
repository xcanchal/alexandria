import { ethers } from 'ethers';

import Alexandria from '../abis/Alexandria.json';

export const contracts = {
  alexandria: {
    name: 'alexandria',
    address: '0xf48bCd3688dbc1A7757481313C10bc5e4548D464',
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

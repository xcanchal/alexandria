import { useContext } from 'react';

import AccountContext from './context';

const useAccount = () => {
  const account = useContext(AccountContext);
  return account;
};

export default useAccount;

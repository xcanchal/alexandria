import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import AccountContext from './context';

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          console.log('Make sure you have MetaMask!');
          return;
        } else {
          console.log('We have the ethereum object', ethereum);
        }
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (!accounts.length) {
          console.log('No authorized account found');
        } else {
          const [account] = accounts;
          console.log('Found an authorized account:', account);
          setAccount(account);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [account, setAccount]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AccountContext.Provider value={{ account, connectWallet }}>
      {children}
    </AccountContext.Provider>
  );
};

AccountProvider.propTypes = {
  children: PropTypes.node,
};

AccountProvider.defaultProps = {
  children: null,
};

export default AccountProvider;
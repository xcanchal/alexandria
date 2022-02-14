import { useAccount } from '../../context/account';
import { getContract, contracts } from '../../utils/contracts';

import './account-pill.css';

const AccountPill = () => {
  const { account, connectWallet } = useAccount();

  return (
    <div className="account-pill">
    {!account ? (
      <button onClick={connectWallet}>Connect wallet</button>
    ) : (
      <p className="wallet"><a href="/me">{account.substr(0,12)}...</a></p>
    )}
    </div>
  )
};

export default AccountPill;

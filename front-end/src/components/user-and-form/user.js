import { ethers } from 'ethers';

import { useAccount } from '../../context/account';
import { getContract, contracts } from '../../utils/contracts';

const User = () => {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState({});
  const [loadingAdd, setLoadingAdd] = useState(false);

  const getUser = useCallback(async () => {
    const usersContract = getContract(contracts.users.name);
    const user = await usersContract.getByAddress(account);
    if (user) {
      setUser(user);
    }
  }, [account]);

  const addUser = useCallback(async () => {
    const usersContract = getContract(contracts.users.name);
    if (userData.username && userData.bio) {
      const addTx = await usersContract.add(userData.username ?? '', userData.bio ?? '', userData.avatar ?? '');
      setLoadingAdd(true);
      await addTx.wait();
      setLoadingAdd(false);
      getUser();
    }
  }, [account, userData]);

  useEffect(() => {
    (async () => {
      if (account) {
        getUser();
      }
    })();
  }, [account]);

  return (
    <div>
      {user ? (
        <div className="welcome">
          <h1>Welcome {user.username}</h1>
          <p>{user.wallet}</p>
          <p>{user.bio}</p>
        </div>
      ) : (
        <div className="create-user-form">
          {loadingAdd ? <p>transaction pending...</p> : (
            <div>
            <p>You must signup as a user to participate</p>
            <input 
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
            <textarea
              type="text"
              name="bio"
              placeholder="Bio"
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            ></textarea>
            <button onClick={addUser}>Signup</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
};

export default User;
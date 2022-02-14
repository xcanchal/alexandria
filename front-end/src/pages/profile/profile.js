import { usEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate, Link } from 'react-router-dom';

import { useAccount } from '../../context/account';
import { getContract, contracts } from '../../utils/contracts';
import AccountPill from '../../components/account-pill';
import Layout from '../../components/layout';
import './profile.css';

const defaultAvatar = 'https://cryptorobin.es/wp-content/uploads/2021/08/Cool-Cats.jpg';

const Profile = () => {
  const { account } = useAccount();
  const navigate = useNavigate();
  return (
    <div className="profile">
      <Layout>
        <Link to="/home">{'< Home'}</Link>
        <h1>Profile</h1>
        <p>{account}</p>
        <AccountPill />
      </Layout>
    </div>
  );
};

export default Profile;

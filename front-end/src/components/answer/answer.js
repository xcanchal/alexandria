import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getContract, contracts } from '../../utils/contracts';
import './answer.css';

const Answer = ({ answer }) => {
  const { id, text, votes, userId, createdAt, updatedAt } = answer;
  const [user, setUser] = useState({});
  const [tipLoading, setTipLoading] = useState({});
  const [loadingVote, setLoadingVote] = useState({});

  useEffect(() => {
    (async () => {
      if (userId && !user.id) {
        const usersContract = getContract(contracts.users.name);
        const userResult = await usersContract.getById(userId);
        if (userResult) {
          setUser(userResult);
        }
      }
    })();
  }, [userId]);

  const sendTip = useCallback(async (userId) => {
    if (userId) {
      const usersContract = getContract(contracts.users.name);
      const tipTx = await usersContract.sendTip(userId);
      setTipLoading(true);
      await tipTx.wait();
      setTipLoading(false);
    }
  }, [setTipLoading]);

  const upvote = useCallback(async (answerId) => {
    if (answerId) {
      const answersContract = getContract(contracts.answers.name);
      const upvoteTx = await answersContract.upvote(answerId);
      setLoadingVote(true);
      await upvoteTx.wait();
      setLoadingVote(false);
      // getAnswer or listen for answerUpdated event
    }
  }, [setLoadingVote]);
  
  const downvote = useCallback(async (answerId) => {
    if (answerId) {
      const answersContract = getContract(contracts.answers.name);
      const downvoteTx = await answersContract.downvote(answerId);
      setLoadingVote(true);
      await downvoteTx.wait();
      setLoadingVote(false);
      // getAnswer or listen for answerUpdated event
    }
  }, [setLoadingVote]);

  return (
    <div className="answer">
      <div className="votes">
        <div className="upvote" onClick={() => upvote(id)}>+</div>
        <div className="votes">{votes.toNumber()}</div>
        <div className="downvote" onClick={() => downvote(id)}>-</div>
      </div>
      <div className="content">
        <h3 className="text">{text}</h3>
        {user.id && (
          <p>Published by <Link to={`/users/${user.id}`}>{user.username}</Link> on {new Date(createdAt.toNumber()).toLocaleDateString()}, updated on {new Date(updatedAt.toNumber()).toLocaleDateString()}</p>
        )}
        <button className="tip-btn" onClick={() => sendTip(user.id)}>Send tip</button>
      </div>
    </div>
  );
};

Answer.propTypes = {
  answer: PropTypes.shape,
};

Answer.defaultProps = {};

export default Answer;

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../components/layout';
import AccountPill from '../../components/account-pill';
import { contracts, getContract } from '../../utils/contracts';
import './home.css';

const HomePage = () => {
  const [latestTopics, setLatestTopics] = useState(null);
  const [latestQuestions, setLatestQuestions] = useState(null);
  const searchQuestions = useCallback(() => {}, []);

  const getLatestTopics = useCallback(async () => {
    if(!latestTopics) {
      const categoriesContract = getContract(contracts.categories.name);
      const topicList = await categoriesContract.listLatest(10);
      setLatestTopics(topicList);
    }
  }, [latestTopics, setLatestTopics]);

  const getLatestQuestions = useCallback(async () => {
    if(!latestQuestions) {
      const questionContract = getContract(contracts.questions.name);
      const questionList = await questionContract.listLatest(10);
      setLatestQuestions(questionList);
    }
  }, [latestQuestions, setLatestQuestions]);
  
  return (
    <div className="home">
      <Layout>
        <h1>Alexandria</h1>
        <h2>Answer questions, earn rewards.</h2>
        <p> Welcome to a global, open, and decentralized knowledge hub.</p>
        <p><Link to="/tags">Browse tags</Link></p>
        {/* <div className="latest">
          <div className="latest-topics">
            <h2>Latest topics</h2>
            {!!(latestTopics ?? []).length && (
              <ul>
              {latestTopics.map((question) => (
                <li>topic</li>
              ))}
              </ul>
            )}
            <p><Link to="/categories">Browse all</Link></p>
          </div>
          <div className="latest-questions">
            <h2>Latest questions</h2>
             {!!(latestQuestions ?? []).length && (
              <ul>
              {latestQuestions.map((question) => (
                <li>question</li>
              ))}
              </ul>
            )}
            <p><Link to="/questions">Browse all</Link></p>
          </div>
        </div> */}
        <AccountPill />
      </Layout>
    </div>
  );
}

export default HomePage;

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useAccount } from '../../context/account';
import Layout from '../../components/layout';
import AccountPill from '../../components/account-pill';
import Question from '../../components/question';
import { getContract, contracts } from '../../utils/contracts';
import './tag.css';

const TagPage = () => {
  const { account, user } = useAccount();
  const params = useParams();
  const navigate = useNavigate();
  const [tag, setTag] = useState({});
  const alexandria = useMemo(() => getContract(contracts.alexandria.name), []);
  /* const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [loadingAddQuestion, setLoadingAddQuestion] = useState(false);
  const [creator, setCreator] = useState({}); */

  const getTag = useCallback(async (tagId) => {
    const t = await alexandria.getTagById(tagId);
    setTag(t);
  }, []);
  
  /* const getQuestions = useCallback(async (topicId) => {
    const questionsContract = getContract(contracts.questions.name);
    const questionList = await questionsContract.listByTopicId(topicId);
    setQuestions(questionList);
  }, []); */

  /* useEffect(function getCreator() {
    (async () => {
      if (question.id && !creator.id) {
          const usersContract = getContract(contracts.users.name);
          const userResult = await usersContract.getById(question.userId);
          setCreator(userResult);
      }
    })();
  }, [creator, setCreator]); */

  /* const addQuestion = useCallback(async () => {
    const questionsContract = getContract(contracts.questions.name);
    const addTx = await questionsContract.add(
      question.text,
      topic.id,
      user.id, 
      question.tags
    );
    setLoadingAddQuestion(true);
    await addTx.wait();
    setLoadingAddQuestion(false);
    getQuestions(topic.id);
  }, [question, topic, user, setLoadingAddQuestion]); */

  useEffect(() => {
    if (!params.tagId) {
      navigate("/tags");
    } else if (account) {
      getTag(params.tagId);
      // getQuestions(params.topicId);
    }
  }, [params, account, getTag, /* getQuestions,  */navigate]);
  
  return (
    <div className="tag-page">
    <Layout>
      <Link to="/tags">{'< Tags'}</Link>
      {!account ? (
        <div>
          <h1>Account not connected</h1>
          <p>Connect account to browse tags</p>
        </div>
      ) : (
        <div className="tag">
          {!!tag && (
            <div className="summary">
              <h1>{tag.name}</h1>
              <p>{tag.description}</p>
              {tag.createdAt && (
                <p>Created on {new Date(tag.createdAt.toNumber()).toLocaleDateString()} by <Link to={`/users/${tag.creator}`}>{tag.creator}</Link></p>
              )}
              {/* !!questions.length && <p>{questions.length} <span>{questions.length === 1 ? 'question' : 'questions'}</span></p> */}
              <hr />
            </div>
          )}
          {/* !!questions.length ? (
            <div className="questions">
              {questions.map(({ id, text, tags, userId }) => (
                <Question text={text} tags={tags} userId={userId} onClick={() => navigate(`/questions/${id.toNumber()}`)}/>
              ))}
            </div>
          ) : (
            <p>There are no questions on this topic yet.</p>
          ) */}
          <hr />
          {/* <div className="publish-new-question">
              <p>Can't find answers? Publish a new question:</p>
              {loadingAddQuestion ? (
                <p>Publishing question...</p>
              ) : (
                <div className="add-question-form">
                  <textarea
                    name="text"
                    placeholder="Text"
                    onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                  >
                  </textarea>
                  <textarea
                    name="tags"
                    placeholder="Comma separated tags"
                    onChange={(e) => setQuestion({ 
                      ...question, 
                      tags: e.target.value.split(',').map((tag) => tag.trim())
                    })}
                  >
                </textarea>
                <button onClick={addQuestion}>Publish</button>
              </div>
            )}
          </div> */}
          </div>
        )}
      <AccountPill />
      </Layout>
    </div>
  )
};

export default TagPage;

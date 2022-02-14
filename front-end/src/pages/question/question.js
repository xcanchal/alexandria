import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useAccount } from '../../context/account';
import Layout from '../../components/layout';
import AccountPill from '../../components/account-pill';
import Answer from '../../components/answer';
import { getContract, contracts } from '../../utils/contracts';
import './question.css';

const QuestionPage = () => {
  const { account, user } = useAccount();
  const params = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loadingAddAnswer, setLoadingAddAnswer] = useState(false);
  const [category, setCategory] = useState(null);
  const [publisher, setPublisher] = useState(null);

  const getQuestion = useCallback(async (questionId) => {
    if (questionId) {
      const questionsContract = getContract(contracts.questions.name);
      const questionResult = await questionsContract.getById(questionId);
      setQuestion(questionResult);
    }
  }, [setQuestion]);
  
  const getAnswers = useCallback(async (questionId) => {
    if (questionId) {
      const answersContract = getContract(contracts.answers.name);
      const answersList = await answersContract.listByQuestionId(questionId);
      setAnswers(answersList);
    }
  }, [question, setAnswers]);

  useEffect(function getPublisher() {
    (async () => {
      if (question && !publisher) {
          const usersContract = getContract(contracts.users.name);
          const userResult = await usersContract.getById(question.userId);
          setPublisher(userResult);
      }
    })();
  }, [question, publisher, setPublisher]);

  useEffect(function getCategory() {
    (async () => {
      if (question && !category) {
        const categoriesContract = getContract(contracts.categories.name);
        const categoryResult = await categoriesContract.getById(question.categoryId);
        setCategory(categoryResult);
      }
    })();
  }, [question, category, setCategory]);

  const addAnswer = useCallback(async () => {
    const answersContract = getContract(contracts.answers.name);
    const addTx = await answersContract.add(
      answer.text,
      question.id,
      user.id, 
    );
    setLoadingAddAnswer(true);
    await addTx.wait();
    setLoadingAddAnswer(false);
    getAnswers(question.id);
  }, [answer, question, user, setLoadingAddAnswer, getAnswers]);

  useEffect(() => {
    if (!params.questionId) {
      navigate("/not-found");
    } else if (account) {
      if (!question) {
        getQuestion(params.questionId);
      }
      if (!answers) {
        getAnswers(params.questionId);
      }
    }
  }, [params, account, getQuestion, getAnswers]);
  
  return (
    <div className="question-page">
    <Layout>
      {!account ? (
        <div>
          <h1>Account not connected</h1>
          <p>Connect account to see answers</p>
        </div>
      ) : (
        <div className="question">
          {question && (
            <div className="summary">
              {!!category && <Link to={`/categories/${category.id.toNumber()}`}>{'< Questions'}</Link>}
              <h1 className="text">{question.text}</h1>
              {!!(question?.tags ?? []).length && (
                <ul className="tags">{question.tags.map((tag) => <li>{tag}</li>)}</ul>
              )}
              {publisher && category && (
                <p>Published by <Link to={`/users/${publisher.id.toNumber()}`}>{publisher.username}</Link> on <Link to={`/categories/${category.id.toNumber()}`}>{category.name}</Link>, <span>{answers.length} {answers.length === 1 ? 'answer' : 'answers'}</span></p>
              )}
              <hr />
            </div>
          )}
          {answers ? (
            <div className="answers">
              {answers.map((answer) => {
                console.log(answer);
                return <Answer answer={answer} />;
              })}
            </div>
          ) : (
            <p>There are no answers for this question yet.</p>
          )}
          <hr />
          <div className="publish-new-answer">
              
              {loadingAddAnswer ? (
                <p>Publishing answer...</p>
              ) : (
                <div className="add-answer-form">
                  <p>Publish your answer:</p>
                  <textarea
                    name="text"
                    placeholder="Text"
                    onChange={(e) => setAnswer({ ...answer, text: e.target.value })}
                  >
                  </textarea>
                <button onClick={addAnswer}>Publish</button>
              </div>
            )}
          </div>
          </div>
        )}
      <AccountPill />
      </Layout>
    </div>
  )
};

export default QuestionPage;

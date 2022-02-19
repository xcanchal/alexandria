import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

import { useAccount } from '../../context/account';
import Layout from '../../components/layout';
import AccountPill from '../../components/account-pill';
import Question from '../../components/question';
import './tag.css';

const GET_TAG = gql`
  query GetTag($id: String) {
    tag(id: $id) {
      id
      name
      description
      creator
      createdAt
    }
  }
`;

const TagPage = () => {
  const { account } = useAccount();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.tagId) {
      navigate("/tags");
    }
  }, [params, navigate]);

  const {
    data: tagData,
    loading: tagLoading,
    error: tagError,
  } = useQuery(GET_TAG, { variables: { id: params.tagId } });

  console.log({ tagData, tagLoading, tagError });

  const { tag } = tagData ?? {};

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
            {tagLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="summary">
                <h1 className="title">{tag.name}</h1>
                <p className="description">{tag.description}</p>
                {tag.createdAt && (
                  <p>Created {new Date(tag.createdAt * 1000).toLocaleString()} by <Link to={`/profile/${tag.creator}`}>{tag.creator}</Link></p>
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

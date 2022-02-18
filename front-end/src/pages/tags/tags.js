import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

import { useAccount } from '../../context/account';
import Layout from '../../components/layout';
import AccountPill from '../../components/account-pill';
import { getContract, contracts } from '../../utils/contracts';
import './tags.css';

const GET_TAGS_PAGE = gql`
    query Feed($offset: Int, $limit: Int){
      tags(
        orderBy: createdAt
        orderDirection: desc
        limit: 10
        #offset: $offset
        #limit: $limit
      ) {
        id
        name
        description
        creator
        createdAt
      }
    }
  `

const TagsPage = () => {
  const navigate = useNavigate();
  const { account } = useAccount();
  const [tag, setTag] = useState(null);
  const [loadingCreateTag, setLoadingCreateTag] = useState(false);
  const [search, setSearch] = useState('');
  const alexandria = useMemo(() => getContract(contracts.alexandria.name), []);
  // const [page, setPage] = useState(0);

  const {
    loading: loadingTags,
    error,
    data: tagsData,
    refetch: refetchTags,
    // fetchMore: fetchMoreTags
  } = useQuery(GET_TAGS_PAGE, {
    // variables: { limit: 1, offset: page * 1 },
  });

  const { tags = [] } = tagsData ?? {};

  const createTag = useCallback(async () => {
    if (tag.name && tag.description) {
      const addTx = await alexandria.createTag(tag.name ?? '', tag.description ?? '');
      setLoadingCreateTag(true);
      await addTx.wait();
      setLoadingCreateTag(false);
      refetchTags();
    }
  }, [alexandria, tag, refetchTags, setLoadingCreateTag]);

  /* useEffect(() => {
    fetchMoreTags({
      query: GET_TAGS_PAGE,
      variables: { limit: 1, offset: page * 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          feed: [...prev.feed, ...fetchMoreResult.feed]
        });
      }
    });
  }, [page, fetchMoreTags]); */

  console.log({ loadingTags, tags, error });

  return (
    <div className="tags-page">
      <Layout>
        <Link to="/home">{'< Home'}</Link>
        <h1>Latest tags</h1>
        {error && <p style={{ color: 'red', border: '1px solid red', padding: '12px 20px' }}>{error.message}</p>}
        {!!(tags ?? []).length ? (
          <div className="tags-list">
            <div className="search-tags">
              <input type="text" placeholder="Search tag..." onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="tags">
              {tags.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase())).map((tag) => (
                <div className="tag" onClick={() => navigate(`/tags/${tag.id}`)}>
                  <h3 className="name">{tag.name}</h3>
                  <p className="description">{tag.description}</p>
                  <p className="created-at"><small>Created {tag.createdAt} by <Link to={`/profile/${tag.creator}`}>{tag.creator}</Link></small></p>
                  {/* <p className="created-at"><small>Created {new Date(tag.createdAt).toLocaleDateString()} by <Link to={`/profile/${tag.creator}`}>{tag.creator}</Link></small></p> */}
                </div>
              ))}
            </div>
            {/* <button onClick={() => setPage(page + 1)}>Load more</button> */}
          </div>
        ) : (
          <p>{loadingTags ? 'Loading...' : 'No tags created yet.'}</p>
        )}
        <hr />
        {account ? (
          <div className="unexisting-tag">
            {loadingCreateTag ? (
              <p>publishing tag...</p>
            ) : (
              <>
                <p>Can't find a particular tag? submit one!</p>
                <div className="add-tag-form">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={(e) => setTag({ ...tag, name: e.target.value })}
                  />
                  <textarea
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={(e) => setTag({ ...tag, description: e.target.value })}
                  ></textarea>
                  <button onClick={createTag}>Publish tag</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p>Can't find a particular tag? <b>Connect your wallet</b> and you will be able to submit a new one</p>
        )}
        <AccountPill />
      </Layout>
    </div >
  );
};

export default TagsPage;
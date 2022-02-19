import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery } from 'react-apollo';

import { useAccount } from '../../context/account';
import Layout from '../../components/layout';
import AccountPill from '../../components/account-pill';
import { getContract, contracts } from '../../utils/contracts';
import './tags.css';

const GET_LATEST_TAGS = gql`
  query Feed($offset: Int, $limit: Int){
    tags(
      orderBy: createdAt
      orderDirection: desc
      limit: 10
      where: { deleted: false }
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
`;

const SEARCH_TAGS = gql`
  query SearchTags($text: String!) {
    tagSearch(text: $text, where: { deleted: false }) {
      id
      name
      description
      creator
      createdAt
    }
  }
`;

const TagsPage = () => {
  const navigate = useNavigate();
  const { account } = useAccount();
  const [tag, setTag] = useState(null);
  const [loadingCreateTag, setLoadingCreateTag] = useState(false);
  const [search, setSearch] = useState('');
  const alexandria = useMemo(() => getContract(contracts.alexandria.name), []);
  // const [page, setPage] = useState(0);

  const {
    loading: getTagsLoading,
    error: getTagsError,
    data: latestTags,
    refetch: getTagsRefetch,
    // fetchMore: fetchMoreTags
  } = useQuery(GET_LATEST_TAGS, {
    // variables: { limit: 1, offset: page * 1 },
  });

  const [searchTags, {
    loading: searchTagsLoading,
    error: searchTagsError,
    data: searchResults,
  }] = useLazyQuery(SEARCH_TAGS);

  const createTag = useCallback(async () => {
    if (tag.name && tag.description) {
      const addTx = await alexandria.createTag(tag.name ?? '', tag.description ?? '');
      setLoadingCreateTag(true);
      await addTx.wait();
      setLoadingCreateTag(false);
      getTagsRefetch();
    }
  }, [alexandria, tag, getTagsRefetch, setLoadingCreateTag]);

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

  useEffect(() => {
    if (search.length) {
      console.log('SEARCHING...');
      searchTags({ variables: { text: search } });
    }/*  else {
      console.log('REFETCHING TAGS...');
      getTagsRefetch();
    } */
  }, [search, searchTags, getTagsRefetch]);

  const error = searchTagsError || getTagsError;

  let tags = [];
  if (search) {
    tags = searchResults?.tagSearch ?? {};
  } else {
    tags = latestTags?.tags ?? {}
  }

  console.log(tags);

  return (
    <div className="tags-page">
      <Layout>
        <Link to="/home">{'< Home'}</Link>
        <h1>Tags</h1>
        <h2>{!!search.length ? 'Search results' : 'Latest tags'}</h2>
        {error && <p style={{ color: 'red', border: '1px solid red', padding: '12px 20px' }}>{error.message}</p>}
        <div className="search-tags">
          <input
            type="text"
            placeholder="Search all tags"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!!(tags ?? []).length && (
          <div className="tags">
            {tags.map((tag) => (
              <div className="tag" onClick={() => navigate(`/tags/${tag.id}`)} key={tag.name}>
                <h3 className="name">{tag.name}</h3>
                <p className="description">{tag.description}</p>
                <p className="created-at">
                  <small>Created {new Date(tag.createdAt * 1000).toLocaleString()} by <Link to={`/profile/${tag.creator}`}>{tag.creator}</Link></small>
                </p>
                {tag.creator === account && (
                  <ul className="tag-actions">
                    <li><button>edit</button></li>
                    <li><button>delete</button></li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {(!search.length && !tags.length) && <p>{getTagsLoading ? 'Loading...' : 'No tags created yet.'}</p>}
        {(!!search.length && !tags.length) && <p>{searchTagsLoading ? 'Searching...' : `No tags found with "${search}"`}</p>}
        {/* <button onClick={() => setPage(page + 1)}>Load more</button> */}
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

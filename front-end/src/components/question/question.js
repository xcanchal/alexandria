import React from 'react';
import PropTypes from 'prop-types';

const Question = ({ text, tags = [], onClick }) => (
  <div className="question" onClick={onClick}>
    <h3 className="text">{text}</h3>
    {!!tags.length && (
      <ul className="tags">{tags.map((tag) => <li>{tag}</li>)}</ul>
    )}
    <p>Published by: ... | on: ...</p>
    <div className="stats"></div>
  </div>
);

Question.propTypes = {
  text: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
};

Question.defaultProps = {};

export default Question;

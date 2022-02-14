import React from 'react';

import './layout.css';

const Layout = ({ children }) => (
  <div className="layout">
    <div className="container">
      {children}
    </div>
  </div>
);

export default Layout;

import React, { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/home';
import TagsPage from './pages/tags';
import TagPage from './pages/tag';
/*  import QuestionPage from './pages/question';*/
import ProfilePage from './pages/profile';
import NotFoundPage from './pages/not-found';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<TagsPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/tags/:tagId" element={<TagPage />} />
      <Route path="/profile/:profileId" element={<ProfilePage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
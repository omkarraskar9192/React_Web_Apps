import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './Layout.jsx';
import { Content, Team, About, Home } from './components/index.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="content" element={<Content />} />
      <Route path="projects" element={<Content />} />
      <Route path="team" element={<Team />} />
    </Route>
  ),
  { basename: import.meta.env.BASE_URL }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

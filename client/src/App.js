

import React, { Fragment, useEffect } from 'react';
import NotFound from './components/layout/NotFound';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/layout/Register';
import Login from './components/layout/Login';
import Dashboard from './components/dashboard/dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';

import Posts from './components/posts/Posts';
import Alert from './components/layout/AlertComponent';
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation'
import Post from './components/post/Post';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const SectionWrapper = () => {
  return (
    <section className="container">
      <Alert />
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="create-profile" element={<PrivateRoute><CreateProfile /></PrivateRoute>} />
        <Route path="edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="add-experience" element={<PrivateRoute><AddExperience /></PrivateRoute>} />
        <Route path="add-education" element={<PrivateRoute><AddEducation /></PrivateRoute>} />
        <Route path="edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
        <Route path="posts/:id" element={<PrivateRoute><Post /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </section>
  );
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path='/*' element={<SectionWrapper />} />


          </Routes>
        </Fragment>
      </Router>
    </Provider>
  )
}





export default App;


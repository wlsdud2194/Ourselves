import React from 'react';
import { Helmet } from 'react-helmet';
import Login from '../components/Login/Login';

const login = () => {
  return (
    <>
      <Helmet>
        <title>선생님 로그인</title>
        <link rel="stylesheet" href="//cdn.rawgit.com/hiun/NanumSquare/master/nanumsquare.css" />
      </Helmet>
      <Login />
    </>
  );
};

export default login;
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../containers/Layout';

const location = () => {
  return (
    <>
      <Helmet>
        <title>우리끼리-선생님 콘솔</title>
        <link rel="stylesheet" href="//cdn.rawgit.com/hiun/NanumSquare/master/nanumsquare.css" />
      </Helmet>
      <Layout type={"location"}/>
    </>
  );
};

export default location;
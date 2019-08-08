import React from 'react';
import Nav from '../components/Nav/Nav';
import Header from '../components/Header/Header';
import Content from '../containers/Content';

const Layout = ({ type }) => {
  return (
    <>
      <Nav />
      <Header />
      <Content 
        type={type}
      />
    </>
  );
};

export default Layout;
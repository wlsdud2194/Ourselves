import React from 'react';
import { Provider } from 'mobx-react';
import mobxStore from '../stores';
import '../assets/index.scss';

const OnlyUs = ({ Component }) => {
  return (
    <>
      <Provider store={mobxStore}>
        <Component />
      </Provider>
    </>
  );
};

export default OnlyUs;
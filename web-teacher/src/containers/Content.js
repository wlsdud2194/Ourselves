import React from 'react';
import StudyList from '../components/StudyList/StudyList';
import LocationList from '../components/LocationList/LocationList';

const Content = ({ type }) => {
  return (
    (type === 'study') ? 
      <StudyList /> : (type === 'location') ? <LocationList /> : 'asd'
  );
};

export default Content;
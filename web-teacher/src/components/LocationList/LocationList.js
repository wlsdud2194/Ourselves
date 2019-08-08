import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import Location from './Location/Location';
import '../StudyList/StudyList.scss';

const LocationList = ({ store }) => {
  useEffect(() => {
    store.Location.getLocation();
  }, []);

  let locations;
  const locationList = store.Location.LocationList;
  if (Array.isArray(locationList) || locationList.length > 0) {
    locations = locationList.map((location) => <Location data={location}/>);
  }
  console.log(locationList);

  return (
    <div className={'studyContent'}>
      <div className={'study-main'}>
        <div className={'study-head'}>
          <h2>스터디 장소 관리</h2>
        </div>
        <div className={'study-body'}>
          {locations}
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(LocationList));
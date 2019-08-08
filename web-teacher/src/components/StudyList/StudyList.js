import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import Study from './Study/Study';
import './StudyList.scss';

const StudyList = ({ store }) => {
  useEffect(() => {
    store.Study.getStudies();
  }, []);

  let studies;
  const studyList = store.Study.studyList;
  if (Array.isArray(studyList) || studyList.length > 0) {
    studies = studyList.map((study) => <Study key={study.idx} data={study}/>);
  }

  return (
    <div className={'studyContent'}>
      <div className={'study-main'}>
        <div className={'study-head'}>
          <h2>스터디 목록</h2>
        </div>
        <div className={'study-body'}>
          {studies}
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(StudyList));
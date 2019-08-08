import { observable, action } from 'mobx';
import Router  from 'next/router';
import Swal from 'sweetalert2';
import { getStudyList } from '../api';

class Study {
  static instance = null;
  static getInstance() {
    if (Study.instance === null)
      Study.instance = new Study();
    return this.instance;
  }

  @observable.ref studyList = [];

  @action getStudies = async () => {
    try {
      this.studyList = await getStudyList();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        type: 'error',
        title: '스터디 목록 조회 실패',
        text: '잠시후에 다시 시도 해주세요',
      });
    }
  };
}

export default Study.getInstance();
import { observable, action } from 'mobx';
// import Router  from 'next/router';
import Swal from 'sweetalert2';
import { getLocationApi } from '../api';

class Location {
  static instance = null;
  static getInstance() {
    if (Location.instance === null)
      Location.instance = new Location();
    return this.instance;
  }

  @observable.ref LocationList = [];

  @action getLocation = async () => {
    try {
      const { data: { data } } = await getLocationApi();
      this.LocationList = data;
    } catch (error) {
      console.error(error);
      await Swal.fire({
        type: 'error',
        title: '위치 목록 조회 실패',
        text: '잠시후에 다시 시도 해주세요',
      });
    }
  };
}

export default Location.getInstance();
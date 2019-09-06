import { observable, action } from 'mobx';
import Router  from 'next/router';
import Swal from 'sweetalert2';
import { loginApi } from '../api';

class User {
  static instance = null;
  static getInstance() {
    if (User.instance === null)
      User.instance = new User();
    return this.instance;
  }

  @observable.ref token = '';
  @observable.ref refreshToken = null;
  @observable.ref myInfo = {};

  @action login = async (id, pw) => {
    console.log('asd', id, pw);
    try {
      const { data: { status, data } } = await loginApi(id, pw);
      console.log(data);
      if (status === 200) {
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.myInfo = data.info;
        console.log('info: ', this.myInfo);

        localStorage.setItem('user', data);
        localStorage.setItem('token', data.token);

        await Swal.fire({
          type: 'success',
          title: '로그인 성공',
          text: '환영합니다',
        });

        Router.push({
          pathname: '/',
        });
      } else {
        await Swal.fire({
          type: 'error',
          title: '로그인 실패',
          text: '아이디, 비밀번호를 다시 확인해주세요',
        });
      }
    } catch (error) {
      console.error(error.response);
      await Swal.fire({
        type: 'error',
        title: '로그인 실패',
        text: '잠시후에 다시 시도 해주세요',
      });
    }
  };

  @action logout = async () => {
    this.token = '';
    this.refreshToken = '';
    this.myInfo = {};

    await Swal.fire({
      type: 'success',
      title: '로그아웃',
      text: '수고하셨습니다',
    });

    Router.push({
      pathname: '/login',
    });
  }
}

export default User.getInstance();

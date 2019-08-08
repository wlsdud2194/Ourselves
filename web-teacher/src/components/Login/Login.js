import React, { useCallback } from 'react';
import Swal from 'sweetalert2';
import { observer, inject } from 'mobx-react';
import { useInput } from '../../lib/method';

import './Login.scss';

const Login = ({ store }) => {
  const id = useInput('');
  const pw = useInput('');

  const onLogin = useCallback((e) => {
    e.preventDefault();

    if (!id.value || !pw.value) {
      Swal.fire({
        type: 'error',
        title: '로그인 실패',
        text: '양식을 완성해주세요',
      });
      return;
    }

    store.User.login(id.value, pw.value);
  }, [id.value, pw.value]);

  return (
    <div className={'login middle'}>
      <div className={'login-wrap'}>
        <div className={'login-header middle'}>
          <div className={'login-round middle'}>
            <img className={'login-logo'} src={'https://ano-community.s3.ap-northeast-2.amazonaws.com/logo.png'} alt={'logo'} />
          </div>
        </div>

        <div className={'login-body'}>
          <form className={'middle'}>
            <div className={'login-input-wrap'}>
              <input {...id} className={'login-input'} type='text' placeholder="ID"/>
            </div>
            <div className={'login-input-wrap'}>
              <input {...pw} className={'login-input'} type='password' placeholder="비밀번호"/>
            </div>
            <div className={'login-input-wrap'}>
              <div className={'login-found'}>
                비밀번호를 잊으셨습니요?
              </div>
            </div>
            <div>
              <button className={'login-btn'} type="submit" onClick={onLogin}>로그인</button>
            </div>
          </form>
        </div>

        <div className={'login-foot'}>
          계정이 없으신가요? <span className={'login-foot-registar'}>회원가입</span>
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Login));
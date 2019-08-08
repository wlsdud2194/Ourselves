import React from 'react';
import Link from 'next/link';
import { useRouter }  from 'next/router';
import classnames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import { IoIosCalendar } from 'react-icons/io';
import { FaWrench, FaGraduationCap } from 'react-icons/fa'
import style from './Nav.scss';

const cx = classnames.bind(style);

const Nav = ({ store }) => {
  const router = useRouter();
  const path = router.pathname;
  const { name, group, profileImg, school } = store.User.myInfo;

  return (
    <div className={'nav'}>
      <div className={'nav-wrap'}>
        <div className={'nav-userInfo'}>
          <div className={'nav-userInfo_item'}>
            <img src={profileImg ? profileImg : 'https://ano-community.s3.ap-northeast-2.amazonaws.com/default-image.png'}/>
          </div>
          <div className={'nav-userInfo_item'}><b>{name}</b> 선생님</div>
          <div className={'nav-userInfo_item group'}>{school} - {group}</div>
        </div>

        <div className={'nav-menu'}>
          <Link href="/">
            <div className={cx('nav-menu_item',{'activeNav': '/' === path})}>
              <div className={'nav-menu_icon middle'}><IoIosCalendar /></div>
              <div className={'nav-menu_name'}>스터디 목록</div>
            </div>
          </Link>

          <Link href="/location">
            <div className={cx('nav-menu_item',{'activeNav': '/location' === path})}>
              <div className={'nav-menu_icon middle'}><FaWrench /></div>
              <div className={'nav-menu_name'}>스터디 장소 관리</div>
            </div>
          </Link>

          <Link href="/student">
            <div className={cx('nav-menu_item',{'activeNav': '/student' === path})}>
              <div className={'nav-menu_icon middle'}><FaGraduationCap /></div>
              <div className={'nav-menu_name'}>학생 관리</div>
            </div>
          </Link>


        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Nav));

import React from 'react';
import { observer, inject } from 'mobx-react';
import { FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import './Header.scss';

const Header = ({ store }) => {
  const onLogout = (e) => {
    store.User.logout();
  }

  return (
    <div className={'header'}>
      <div className={'header-search'}>
        <div className={'middle search'}><IoIosSearch /></div>
        <div className={'middle'}>
          <input type='text' className={'header-search_input'} placeholder="검색 ..."/>
        </div>
      </div>
      <div className={'header-icon'}>
        <div className={'header-icon_item middle'}><FaBell /></div>
        <div className={'header-icon_item middle'}><FaCog /></div>
        <div onClick={onLogout} className={'header-icon_item middle'}><FaSignOutAlt /></div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Header));

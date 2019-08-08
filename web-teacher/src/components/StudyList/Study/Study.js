import React from 'react';
import { IoIosPerson, IoIosPin, IoIosCalculator } from 'react-icons/io';
import './Study.scss';

const Study = ({ data }) => {
  console.log(data);
  return (
    <>
      <div className={'study'}>
        <div className={'study-img middle'}>
          <img src={data.imgs[0] ? data.imgs[0] : 'https://ano-community.s3.ap-northeast-2.amazonaws.com/paper-pin.jpg'} alt={"img"} />
        </div>
        <div className={'study-info'}>
          
          <div className={'study-info_item'}>
            <div className={'study-info_item_title'}>{data.title}</div>
          </div>
          
          <div className={'study-info_item'}>
            <div className={'study-info_item_icon middle'}><IoIosPerson /></div>
            <div className={'study-info_item_name'}>{data.currentPerson} / {data.personnel}</div>
          </div>

          <div className={'study-info_item'}>
            <div className={'study-info_item_icon middle'}><IoIosCalculator /></div>
            <div className={'study-info_item_name'}>{data.startTerm} ~ {data.endTerm}</div>
          </div>

          <div className={'study-info_item'}>
            <div className={'study-info_item_icon middle'}><IoIosPin /></div>
            <div className={'study-info_item_name'}>{data.location}</div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Study;

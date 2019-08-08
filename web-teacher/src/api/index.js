import axios from 'axios';
import server from '../config/server';

const { ip } = server;

export const loginApi = (id, pw) => {
  console.log(`${ip}/auth/login`);
  try {
    return axios.post(`${ip}/auth/login`, {
      id,
      pw,
    });
  } catch (error) {
    throw error;
  }
}

export const getStudyList = async () => {
  try {
    return await axios.get(`${ip}/study`, {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    }).then(async (result) => {
      // console.log(result);
      const { data: studyList } = result.data;
      // console.log(studyList);
      if(Array.isArray(studyList)) {
        for (let i = 0; i<studyList.length; i++) {
          const { data: { data: studyMember } } = await axios.get(`${ip}/member/study/${studyList[i].idx}`, {
            headers: {
              'x-access-token': localStorage.getItem('token'),
            },
          });
          // console.log(studyMember);

          studyList[i].memberList = studyMember;
        }
      }
      return studyList;
    });
  } catch (error) {
    throw error;
  }
}

export const getLocationApi = () => {
  try {
    return axios.get(`${ip}/location`, {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    });
  } catch (error) {
    throw error;
  }
}

import axios from 'axios';

export const addRoutine = async (
  rtn_nm,
  rtn_set,
  rtn_reps,
  rtn_sdate,
  rtn_day,
  rtn_tag,
) => {
  try {
    const response = await axios.post('http://10.0.2.2:8000/routines', {
      rtn_nm,
      rtn_set,
      rtn_reps,
      rtn_sdate,
      rtn_day,
      rtn_tag,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      // 서버 응답이 있는 경우만 출력
      console.error(error.response);
    }
  }
};
import axios from 'axios';

const formattedDate = new Date().toISOString(); // 2023-10-17T12:34:56.000Z 형식의 문자열

export const addRoutine = async (
  rtn_nm,
  rtn_set,
  rtn_reps,
  rtn_tag,
  rtn_day,
  rtn_sdate,
  rtn_time,
) => {
  try {
    const data = {
      rtn_nm: String(rtn_nm), // 루틴명
      rtn_set: rtn_set, // 1일 반복 횟수
      rtn_reps: rtn_reps, // 1일 반복 갯수
      rtn_tag: String(rtn_tag), // 태그
      rtn_day: String(rtn_day),
      rtn_sdate: rtn_sdate,
      rtn_time: rtn_time,
    };

    const response = await axios.post('http://10.0.2.2:8000/routines', data);
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      console.error(error.response.data); // 서버 응답 데이터 출력
    }
  }
};

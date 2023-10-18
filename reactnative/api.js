import axios from 'axios';

const formattedDate = new Date().toISOString(); // 2023-10-17T12:34:56.000Z 형식의 문자열

export const addRoutine = async (
  rtn_nm,
  rtn_set,
  rtn_reps,
  rtn_tag,
  rtn_day,
  rtn_sdate = selectedDate,
  rtn_time,
) => {
  try {
    //유효성검사
    //if (!rtn_nm || !rtn_set || !rtn_reps || !rtn_tag || !rtn_time) {
    //throw new Error('필수 필드를 모두 입력하세요.');
    //}

    const data = {
      rtn_nm: String(rtn_nm), // 루틴명
      rtn_set: rtn_set, // 1일 반복 횟수
      rtn_reps: rtn_reps, // 1일 반복 갯수
      rtn_tag: String(rtn_tag), // 태그
      rtn_day: String(rtn_day), //반복요일
      rtn_sdate: rtn_sdate, //날짜
      rtn_time: rtn_time, //시간
    };

    const response = await axios.post('http://10.0.2.2:8000/routines', data);
    // 나중에 dpv_webserver주소변경 현재 http://10.0.2.2:8000 개발머신의 애뮬레이터 네트워크 상에서 10.0.2.2로 사용
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      console.error(error.response.data); // 서버 응답 데이터 출력
    }
  }
};

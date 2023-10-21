import axios from 'axios';

///// 기타페이지에서 입력된 값 DB로 전송하기
export const addRoutine = async (
  ertn_nm,
  ertn_set,
  ertn_reps,
  ertn_tag,
  ertn_day,
  ertn_sdate = selectedDate,
  ertn_time,
) => {
  try {
    // const notificationEnabled = false;
    // const ertn_alram = notificationEnabled ? 1 : 0;
    const data = {
      ertn_nm: String(ertn_nm), // 루틴명
      ertn_set: ertn_set, // 1일 반복 횟수
      ertn_reps: ertn_reps, // 1일 반복 갯수
      ertn_tag: String(ertn_tag), // 태그
      ertn_day: String(ertn_day), //반복요일
      ertn_sdate: ertn_sdate, //날짜
      ertn_time: ertn_time, //시간
      ertn_mem: 'psh_light@google.com',
      ertn_id: 'phs_light@ge0000001',
      ertn_cat: '기타',
      ertn_alram: 1,
      ertn_edate: '',
    };
    // ertn_alram: ertn_alram, // Pass 0 or 1
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

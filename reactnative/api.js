import axios from 'axios';

///// 영양페이지에서 입력된 값 DB로 전송하기
export const PaddRoutine = async (
  prtn_nm,
  prtn_set,
  prtn_reps,
  prtn_tag,
  prtn_day,
  prtn_sdate = selectedDate,
  prtn_time,
) => {
  try {
    // const notificationEnabled = false;
    // const ertn_alram = notificationEnabled ? 1 : 0;
    const data = {
      prtn_nm: String(ertn_nm), // 루틴명
      prtn_set: ertn_set, // 1일 반복 횟수
      prtn_reps: ertn_reps, // 1일 반복 갯수
      prtn_tag: String(ertn_tag), // 태그
      prtn_day: String(ertn_day), //반복요일
      prtn_sdate: ertn_sdate, //날짜
      prtn_time: ertn_time, //시간
      prtn_mem: 'abc123@gmail.com',
      prtn_id: 'abdb@ge00012',
      prtn_cat: '영양',
      prtn_alram: 1,
      prtn_edate: '',
    };
    // ertn_alram: ertn_alram, // Pass 0 or 1
    const response = await axios.post('http://10.0.2.2:8000/p_routines', data);
    // 나중에 dpv_webserver주소변경 현재 http://10.0.2.2:8000 개발머신의 애뮬레이터 네트워크 상에서 10.0.2.2로 사용
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      console.error(error.response.data); // 서버 응답 데이터 출력
    }
  }
};

///// 기타페이지에서 입력된 값 DB로 전송하기
export const EaddRoutine = async (
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
      ertn_mem: 'abc123@gmail.com',
      ertn_id: 'abdb@ge00012',
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

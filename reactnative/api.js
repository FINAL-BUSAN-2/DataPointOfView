import axios from 'axios';

////건강-입력된 값 DB로 전송
export const HaddRoutine = async (
  hrtn_nm,
  hrtn_set,
  hrtn_reps,
  hrtn_day,
  hrtn_sdate = selectedDate,
  hrtn_time = selectedTime,
  hrtn_alram = notificationEnabled,
) => {
  try {
    const data = {
      hrtn_nm: String(hrtn_nm), // 루틴명
      hrtn_set: hrtn_set, // 1일 반복 횟수
      hrtn_reps: hrtn_reps, // 1일 반복 갯수
      hrtn_tag: '', // 태그
      hrtn_day: String(hrtn_day), //반복요일
      hrtn_sdate: hrtn_sdate, //날짜
      hrtn_time: hrtn_time, //시간
      hrtn_mem: 'phs_light@google.com', //로그안아이디필요
      hrtn_id: '',
      hrtn_cat: '건강',
      hrtn_alram: 1,
      hrtn_edate: '',
    };
    const response = await axios.post('http://10.0.2.2:8000/h_routines', data);
    //http://43.200.178.131:3344
    // http://10.0.2.2:8000 개발머신의 애뮬레이터 네트워크 상에서 10.0.2.2로 사용
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      console.error(error.response.data); // 서버 응답 데이터 출력
    }
  }
};

///// 영양-입력된 값 DB로 전송
export const PaddRoutine = async (
  prtn_nm,
  prtn_set,
  prtn_reps,
  prtn_day,
  prtn_sdate = selectedDate,
  prtn_time = selectedTime,
  prtn_alram = notificationEnabled,
) => {
  try {
    const data = {
      prtn_nm: String(prtn_nm), // 루틴명
      prtn_set: prtn_set, // 1일 반복 횟수
      prtn_reps: prtn_reps, // 1일 반복 갯수
      prtn_tag: '', // 태그
      prtn_day: String(prtn_day), //반복요일
      prtn_sdate: prtn_sdate, //날짜
      prtn_time: prtn_time, //시간
      prtn_mem: 'phs_light@google.com', //로그안아이디필요
      prtn_id: '',
      prtn_cat: '영양',
      prtn_alram: 1,
      prtn_edate: '',
    };
    // ertn_alram: ertn_alram, // Pass 0 or 1
    const response = await axios.post('http://10.0.2.2:8000/p_routines', data);
    // http://10.0.2.2:8000 개발머신의 애뮬레이터 네트워크 상에서 10.0.2.2로 사용
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      console.error(error.response.data); // 서버 응답 데이터 출력
    }
  }
};

///// 기타-입력된 값 DB로 전송
export const EaddRoutine = async (
  ertn_nm,
  ertn_set,
  ertn_reps,
  ertn_day,
  ertn_sdate = selectedDate,
  ertn_time = selectedTime,
  ertn_alram = notificationEnabled,
) => {
  try {
    const data = {
      ertn_nm: String(ertn_nm), // 루틴명
      ertn_set: ertn_set, // 1일 반복 횟수
      ertn_reps: ertn_reps, // 1일 반복 갯수
      ertn_tag: '', // 태그 String(ertn_tag)
      ertn_day: String(ertn_day), //반복요일
      ertn_sdate: ertn_sdate, //날짜
      ertn_time: ertn_time, //시간
      ertn_mem: 'aaa123@gmail.com', //로그안아이디필요
      ertn_id: '',
      ertn_cat: '기타',
      ertn_alram: ertn_alram,
      ertn_edate: '',
    };
    // ertn_alram: ertn_alram, // Pass 0 or 1
    const response = await axios.post('http://10.0.2.2:8000/routines', data);
    // http://10.0.2.2:8000 개발머신의 애뮬레이터 네트워크 상에서 10.0.2.2로 사용
    console.log(response.data);
  } catch (error) {
    console.error(error.message); // 기본적인 오류 메시지
    if (error.response) {
      console.error(error.response.data); // 서버 응답 데이터 출력
    }
  }
};

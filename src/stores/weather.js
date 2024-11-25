import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';
import axios from 'axios';

const API_URL = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;
const times = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

export const useWeatherStore = defineStore('weather', () => {
  // 날씨 정보 받아오기
  const getWeather = function (lat, lon, startDate) {
    const grid = dfs_xy_conv('toXY', lat, lon); // 좌표 변환
    const currentDate = new Date().toISOString();
    const baseDate = formatDateToYYYYMMDD(currentDate); // 날짜 포맷
    const baseTime = roundToNearestTime(currentDate); // 가장 가까운 시간대 계산

    // axios를 사용한 API 요청
    return axios
      .get(API_URL, {
        params: {
          serviceKey: import.meta.env.VITE_WEATHER_API_KEY,
          pageNo: 1,
          numOfRows: 600, // 데이터 600개
          dataType: 'json',
          base_date: baseDate,
          base_time: baseTime,
          nx: grid.x,
          ny: grid.y,
        },
      })
      .then((response) => {
        // 응답이 정상적인 경우
        if (response.status === 200 && response.data) {
          // 날씨 데이터 정리
          console.log(response.data);
          weather_data(response.data, startDate);
        } else {
          // 응답이 비정상적인 경우
        }
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
      });
  };

  // 날짜 데이터 정리하기
  function weather_data(data, startDate) {
    const forecastItems = data.response.body.items.item;

    let closestDate = null;
    let closestTime = null;
    let minDiff = Number.MAX_VALUE;

    // startDate를 Date 객체로 변환
    const startDateObj = new Date(startDate);

    // 각 날씨 항목을 순회하며 가장 가까운 날짜와 시간 찾기
    forecastItems.forEach((weatherData) => {
      const fcstDate = weatherData.fcstDate; // 날짜
      const fcstTime = weatherData.fcstTime; // 시간

      // fcstDate와 fcstTime을 Date 객체로 변환
      const forecastDateTime = new Date(
        `${fcstDate.slice(0, 4)}-${fcstDate.slice(4, 6)}-${fcstDate.slice(
          6,
          8
        )}T${fcstTime.slice(0, 2)}:${fcstTime.slice(2, 4)}:00`
      );

      const diff = Math.abs(startDateObj - forecastDateTime);

      if (diff < minDiff) {
        minDiff = diff;
        closestDate = fcstDate;
        closestTime = fcstTime;
      }
    });

    // 가장 가까운 날짜가 하루 이상 차이 나는지 확인
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 하루를 밀리초로 변환
    const isFartherThanOneDay = minDiff >= oneDayInMillis;

    if (isFartherThanOneDay) {
      console.log(
        'Warning: The closest weather data is more than a day apart from the startDate.'
      );
    } else {
      console.log('The closest weather data is:', closestDate, closestTime);
    }

    return { closestDate, closestTime, isFartherThanOneDay }; // 반환 값에 추가
  }

  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)

  // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
  function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    var rs = {};
    if (code == 'toXY') {
      rs['lat'] = v1;
      rs['lng'] = v2;
      var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs['x'] = v1;
      rs['y'] = v2;
      var xn = v1 - XO;
      var yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) -ra;
      var alat = Math.pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) -theta;
        } else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
    }
    return rs;
  }

  // 날짜 변경
  function formatDateToYYYYMMDD(date) {
    const dateForm = new Date(date);
    const hours = dateForm.getHours();

    // 시간 (02:00보다 작으면 하루 전날 날짜 반환)
    if (hours < 2) {
      // 하루 전날로 날짜 변경
      dateForm.setDate(dateForm.getDate() - 1);
    }

    const year = dateForm.getFullYear(); // 연도 (4자리)
    const month = (dateForm.getMonth() + 1).toString().padStart(2, '0'); // 월 (2자리)
    const day = dateForm.getDate().toString().padStart(2, '0'); // 일 (2자리)

    // 'YYYYMMDD' 형식으로 반환
    return `${year}${month}${day}`;
  }

  // 가장 가까운 시간대로 변경
  function roundToNearestTime(targetTime) {
    // 가장 가까운 시간대들 (24시간 형식, 4자리 숫자)
    const timeSlots = [
      '0200',
      '0500',
      '0800',
      '1100',
      '1400',
      '1700',
      '2000',
      '2300',
    ];

    // targetTime을 Date 객체로 변환
    const targetDate = new Date(targetTime); // ISO string을 Date 객체로 변환
    const targetMinutes = targetDate.getHours() * 60 + targetDate.getMinutes(); // targetTime의 총 분 수

    // 가장 가까운 시간대를 찾기 (입력된 시간보다 작은 값 중에서)
    let closestTime = '2300'; // 기본값은 2300
    let minDiff = Number.MAX_VALUE;

    // 각 시간대와 비교하여 가장 가까운 시간대 찾기
    for (let time of timeSlots) {
      const timeMinutes =
        parseInt(time.slice(0, 2)) * 60 + parseInt(time.slice(2, 4));

      if (timeMinutes <= targetMinutes) {
        const diff = targetMinutes - timeMinutes;
        if (diff < minDiff) {
          closestTime = time;
          minDiff = diff;
        }
      }
    }

    return closestTime;
  }

  // 시간을 'HH:mm' 형식의 문자열로 받아서 분 단위로 변환하는 함수
  function timeToMinutes(time) {
    const hours = parseInt(time.slice(0, 2));
    const minutes = parseInt(time.slice(2, 4));
    return hours * 60 + minutes;
  }

  return {
    getWeather,
  };
});

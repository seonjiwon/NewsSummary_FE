import axios from "axios";

// 환경에 따른 API 기본 URL 설정
const DEV_URL = "http://localhost:8080"; // 개발 환경
const PROD_URL = "https://newssummarybe-production.up.railway.app"; // 프로덕션 환경

// 환경 변수에서 API URL을 가져오거나, 현재 환경에 따라 기본값 사용
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? DEV_URL : PROD_URL);

console.log("현재 환경:", import.meta.env.MODE);
console.log("API 기본 URL:", BASE_URL);

// 일반적인 요청에 대한 타임아웃 (20초)
const DEFAULT_TIMEOUT = 20000;

// 무거운 작업(요약 생성 등)에 대한 타임아웃 (60초)
const LONG_TIMEOUT = 60000;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // 기본 타임아웃 설정 (20초로 증가)
  timeout: DEFAULT_TIMEOUT,
  // withCredentials 설정 변경
  withCredentials: false,
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    console.log("API 요청:", config.method.toUpperCase(), config.url);

    // 뉴스 요약과 같은 무거운 작업은 타임아웃 시간 증가
    if (
      config.url?.includes("/news-summary") ||
      config.url?.includes("/admin/news/summarize")
    ) {
      console.log(`타임아웃 설정: ${LONG_TIMEOUT}ms (긴 작업용)`);
      config.timeout = LONG_TIMEOUT;
    } else {
      console.log(`타임아웃 설정: ${config.timeout}ms`);
    }

    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem("token");
    if (token) {
      console.log("인증 토큰 첨부됨");
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("인증 토큰 없음");
    }

    console.log("요청 헤더:", config.headers);
    if (config.data) {
      console.log("요청 데이터:", config.data);
    }
    if (config.params) {
      console.log("요청 파라미터:", config.params);
    }
    return config;
  },
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    console.log("API 응답 상태:", response.status);
    console.log("API 응답 헤더:", response.headers);
    console.log("API 응답 데이터:", response.data);
    return response;
  },
  (error) => {
    console.error("API 응답 오류:", error.response?.status, error.message);

    // 401 Unauthorized 오류 처리
    if (error.response && error.response.status === 401) {
      console.error("인증 오류: 토큰이 유효하지 않거나 만료됨");
      // 로컬 저장소의 토큰 및 사용자 정보 제거
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }

    if (error.response) {
      console.error("오류 응답 데이터:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// 사용자 관련 API
export const userApi = {
  // 인증 관련
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users", userData),

  // 사용자 관심 주제 및 키워드 관련
  updateKeywords: (userId, preferences) =>
    api.put(`/users/${userId}/keywords`, preferences),
  getKeywords: (userId) => api.get(`/users/${userId}/keywords`),

  // 뉴스 관련
  getNews: (userId, page = 1) =>
    api.get(`/users/${userId}/news`, { params: { page } }),
  getNewsSummary: (userId) => api.get(`/users/${userId}/news-summary`),
};

// 관리자용 뉴스 API
export const newsApi = {
  // 뉴스 수집
  fetchNews: (topic) => api.post("/admin/news/fetch", { topic }),

  // 뉴스 요약 생성
  summarizeNews: () => api.post("/admin/news/summarize"),

  // 뉴스 발송
  sendNews: (method = "email") => api.post("/admin/news/send", { method }),
};

export default api;

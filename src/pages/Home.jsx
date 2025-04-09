import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

export default function Home() {
  const { userId } = useUserStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl">
        {/* 헤더 섹션 */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            AI 뉴스 요약 서비스
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            매일 아침, 관심 분야의 최신 뉴스를 GPT가 요약해서 전달해 드립니다.
          </p>
        </div>

        {/* 소개 섹션 */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              서비스 소개
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  키워드 설정
                </h3>
                <p className="text-gray-600 text-center">
                  관심 있는 주제와 키워드를 설정하여 맞춤형 뉴스를 받아보세요.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI 요약
                </h3>
                <p className="text-gray-600 text-center">
                  인공지능이 최신 뉴스를 분석하고 핵심 내용만 요약해 드립니다.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  시간 절약
                </h3>
                <p className="text-gray-600 text-center">
                  매일 뉴스를 읽는 시간을 줄이고 중요한 정보만 빠르게
                  파악하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 행동 유도 섹션 */}
        <div className="mb-12">
          {userId ? (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                뉴스를 확인해보세요
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/news"
                  className="btn btn-primary py-3 px-8 text-lg rounded-md"
                >
                  뉴스 보기
                </Link>
                <Link
                  to="/keywords"
                  className="btn btn-secondary py-3 px-8 text-lg rounded-md"
                >
                  키워드 설정
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                지금 시작해보세요
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="btn btn-primary py-3 px-8 text-lg rounded-md"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="btn btn-secondary py-3 px-8 text-lg rounded-md"
                >
                  회원가입
                </Link>
              </div>
              <p className="mt-4 text-gray-600">
                계정을 만들고 나만의 뉴스 피드를 설정하세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

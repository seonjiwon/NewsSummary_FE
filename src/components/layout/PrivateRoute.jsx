import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";

export default function PrivateRoute({ children }) {
  const userId = useUserStore((state) => state.userId);

  // 로그인하지 않은 경우 로그인 필요 메시지 표시
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-indigo-500 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 mb-8">
            이 페이지를 보기 위해서는 로그인이 필요합니다. 로그인 페이지로
            이동하여 계정 정보를 입력해주세요.
          </p>
          <Link
            to="/login"
            className="btn btn-primary flex items-center justify-center mx-auto w-48"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  // 로그인한 경우 해당 페이지 표시
  return children;
}

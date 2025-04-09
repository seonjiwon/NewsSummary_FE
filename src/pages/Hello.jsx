import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Hello() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("API 요청: /api/hello (프록시 사용)");

        // 프록시를 통한 요청
        const response = await axios.get("/api/hello", {
          headers: {
            Accept: "application/json",
          },
        });

        console.log("응답 상태:", response.status);

        const data = response.data;
        console.log("응답 데이터:", data);
        setResponseData(data);

        // 명시적으로 데이터 확인 후 상태 업데이트
        if (data && data.message) {
          console.log("메시지 설정:", data.message);
          setMessage(data.message);
        } else {
          console.error("응답에 message 필드가 없음:", data);
          setError("응답에 message 필드가 없습니다");
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
        setError(error.message || "알 수 없는 오류");
        toast.error("서버 응답을 받아오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tryDirectAccess = () => {
    const url = "http://localhost:8080/hello";
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin h-16 w-16 text-indigo-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      </div>
    );
  }

  // className에 text-transparent가 있어서 텍스트가 보이지 않았을 수 있음
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] slide-up">
      <div className="text-center max-w-xl mx-auto px-4">
        {message ? (
          <>
            <h1 className="text-7xl font-bold mb-4 animate-pulse bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {message}
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              연결 중 오류 발생
            </h1>
            <p className="text-gray-600 text-xl">서버에 연결할 수 없습니다</p>
          </>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">오류 발생:</p>
            <pre className="text-red-500 text-xs mt-2 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-12 flex justify-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary flex items-center"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            새로고침
          </button>

          <button
            onClick={tryDirectAccess}
            className="btn btn-secondary flex items-center"
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            직접 API 호출
          </button>
        </div>
      </div>
    </div>
  );
}

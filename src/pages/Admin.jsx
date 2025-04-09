import { useState } from "react";
import { toast } from "react-hot-toast";
import { newsApi } from "../api/axios";
import useUserStore from "../store/userStore";
import { Navigate } from "react-router-dom";

const topics = ["경제", "정치", "사회", "문화", "과학", "IT", "스포츠"];

export default function Admin() {
  const isAdmin = useUserStore((state) => state.isAdmin);
  const [selectedTopic, setSelectedTopic] = useState("경제");
  const [loading, setLoading] = useState({
    fetch: false,
    summarize: false,
    send: false,
  });
  const [result, setResult] = useState({
    fetchedCount: 0,
    summarizedCount: 0,
    sentCount: 0,
  });

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleFetchNews = async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const response = await newsApi.fetchNews(selectedTopic);
      setResult((prev) => ({ ...prev, fetchedCount: response.data.count }));
      toast.success(`${response.data.count}개의 뉴스를 수집했습니다.`);
    } catch (error) {
      toast.error("뉴스 수집에 실패했습니다.");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const handleSummarizeNews = async () => {
    setLoading((prev) => ({ ...prev, summarize: true }));
    try {
      const response = await newsApi.summarizeNews();
      setResult((prev) => ({ ...prev, summarizedCount: response.data.count }));
      toast.success(`${response.data.count}개의 뉴스를 요약했습니다.`);
    } catch (error) {
      toast.error("뉴스 요약에 실패했습니다.");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, summarize: false }));
    }
  };

  const handleSendNews = async () => {
    setLoading((prev) => ({ ...prev, send: true }));
    try {
      const response = await newsApi.sendNews("email");
      setResult((prev) => ({ ...prev, sentCount: response.data.count }));
      toast.success(
        `${response.data.count}명의 사용자에게 뉴스를 발송했습니다.`
      );
    } catch (error) {
      toast.error("뉴스 발송에 실패했습니다.");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, send: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          관리자 페이지
        </h2>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">뉴스 수집</h3>
            <div className="flex gap-4">
              <select
                className="input flex-1"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={handleFetchNews}
                disabled={loading.fetch}
              >
                {loading.fetch ? "수집 중..." : "뉴스 수집"}
              </button>
            </div>
            {result.fetchedCount > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {result.fetchedCount}개의 뉴스가 수집되었습니다.
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">뉴스 요약</h3>
            <button
              className="btn btn-primary w-full"
              onClick={handleSummarizeNews}
              disabled={loading.summarize}
            >
              {loading.summarize ? "요약 중..." : "뉴스 요약 생성"}
            </button>
            {result.summarizedCount > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {result.summarizedCount}개의 뉴스가 요약되었습니다.
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">뉴스 발송</h3>
            <button
              className="btn btn-primary w-full"
              onClick={handleSendNews}
              disabled={loading.send}
            >
              {loading.send ? "발송 중..." : "뉴스 발송"}
            </button>
            {result.sentCount > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {result.sentCount}명의 사용자에게 뉴스가 발송되었습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

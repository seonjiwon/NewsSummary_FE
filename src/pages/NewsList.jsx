import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { userApi } from "../api/axios";
import useUserStore from "../store/userStore";
import Pagination from "../components/Pagination";
import NewsSummary from "../components/NewsSummary";

function NewsCard({ news }) {
  return (
    <div className="card mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
      <div
        className="text-gray-600 mb-4"
        dangerouslySetInnerHTML={{ __html: news.description }}
      />
      <div className="flex justify-between items-center text-sm text-gray-500">
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          원본 기사 보기
        </a>
        <span>{new Date(news.pubDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default function NewsList() {
  const token = useUserStore((state) => state.token);
  const userId = useUserStore((state) => state.userId);
  const [newsData, setNewsData] = useState({ popular: [], topic: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular"); // 'popular' 또는 'topic'

  // AI 요약 관련 상태
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(0); // 프론트엔드는 0 기반, 백엔드는 1 기반
  const [totalItems, setTotalItems] = useState({ popular: 0, topic: 0 });
  const itemsPerPage = 10; // 백엔드에서 기본값으로 10개씩 제공한다고 가정

  // 뉴스 데이터 불러오기 (페이지 번호 포함)
  const fetchNews = async (page) => {
    setLoading(true);
    try {
      // 백엔드는 1부터 시작하는 페이지 번호를 사용하므로 +1
      const backendPage = page + 1;
      console.log(`${activeTab} 뉴스 요청, 페이지: ${backendPage}`);

      const response = await userApi.getNews(userId, backendPage);
      console.log("뉴스 데이터 응답 받음:", response.data);

      // 현재 탭의 데이터만 업데이트
      setNewsData((prev) => ({
        ...prev,
        [activeTab]: response.data[activeTab] || [],
      }));

      // 백엔드에서 총 페이지 수를 제공하지 않으므로 항상 최소 3페이지로 가정
      // 실제 데이터가 더 많거나 적을 수 있지만, 페이지네이션 UI를 위해 임시로 설정
      setTotalItems((prev) => ({
        ...prev,
        [activeTab]: 30, // 3페이지 × 10개 항목
      }));
    } catch (error) {
      console.error("뉴스 데이터 요청 오류:", error);
      console.error("오류 상세:", error.response?.data || error.message);
      toast.error("뉴스를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // AI 요약 생성 요청
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);

    try {
      // 요약 생성 API 호출
      const response = await userApi.getNewsSummary(userId);

      // 응답 상태 확인
      if (response && response.status === 200) {
        // 성공 시 바로 응답 데이터로 summary 업데이트
        setSummary(response.data);
        toast.success("뉴스가 성공적으로 요약되었습니다.");
      } else {
        throw new Error("서버 응답이 유효하지 않습니다.");
      }
    } catch (error) {
      console.error("뉴스 요약 생성 오류:", error);
      toast.error("뉴스 요약 생성에 실패했습니다.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // 초기 데이터 로딩 (처음 렌더링 시)
  useEffect(() => {
    if (token && userId) {
      console.log("초기 뉴스 데이터 로딩");
      fetchNews(currentPage);
    } else if (!userId) {
      console.warn("사용자 ID가 없음, 뉴스 요청 생략");
      setLoading(false);
    } else if (!token) {
      console.warn("토큰이 없음, 뉴스 요청 생략");
      setLoading(false);
    }
  }, [token, userId]);

  // 페이지 또는 탭이 변경될 때마다 데이터 다시 로딩
  useEffect(() => {
    if (token && userId) {
      fetchNews(currentPage);
    }
  }, [currentPage, activeTab]);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(0); // 탭 변경 시 첫 페이지로 초기화
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && newsData[activeTab]?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (newsData.popular.length === 0 && newsData.topic.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            아직 받은 뉴스가 없습니다.
          </h2>
          <p className="mt-2 text-gray-600">
            곧 첫 뉴스 요약이 도착할 예정입니다!
          </p>
        </div>
      </div>
    );
  }

  // 현재 탭의 뉴스 목록
  const currentNews = newsData[activeTab] || [];

  // 총 페이지 수 계산 - 항상 최소 3페이지로 가정
  const totalPages = Math.max(
    3,
    Math.ceil(totalItems[activeTab] / itemsPerPage)
  );

  // 현재 페이지 표시 항목 인덱스 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(
    startIndex + currentNews.length,
    totalItems[activeTab]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          나의 뉴스 피드
        </h2>

        {/* AI 뉴스 요약 섹션 */}
        <div className="mb-2 flex justify-end">
          <button
            onClick={handleGenerateSummary}
            disabled={summaryLoading}
            className={`flex items-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              summaryLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <span className="mr-1">✨</span>
            {summaryLoading ? "요약 생성 중..." : "AI 뉴스 요약"}
          </button>
        </div>
        <NewsSummary summary={summary} loading={summaryLoading} />

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-8 border-b">
          <button
            onClick={() => handleTabChange("popular")}
            className={`py-3 px-6 text-center border-b-2 font-medium text-lg ${
              activeTab === "popular"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            🔥 인기 뉴스
          </button>
          <button
            onClick={() => handleTabChange("topic")}
            className={`py-3 px-6 text-center border-b-2 font-medium text-lg ${
              activeTab === "topic"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📰 관심 주제
          </button>
        </div>

        {/* 로딩 인디케이터 (탭 변경 또는 페이지 변경 시) */}
        {loading && newsData[activeTab]?.length > 0 && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">로딩 중...</span>
          </div>
        )}

        {/* 현재 페이지 표시 */}
        <div className="text-center mb-4 text-gray-500">
          총 {totalItems[activeTab]}개 항목 중 {startIndex + 1}-{endIndex} 표시
        </div>

        {/* 뉴스 목록 */}
        {currentNews.length > 0 ? (
          <div className="space-y-6">
            {currentNews.map((item, index) => (
              <NewsCard
                key={`${activeTab}-${startIndex + index}`}
                news={item}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            해당 섹션의 뉴스가 없습니다.
          </p>
        )}

        {/* 페이지네이션 - 항상 표시 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

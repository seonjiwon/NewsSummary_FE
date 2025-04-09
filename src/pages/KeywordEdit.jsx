import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { userApi } from "../api/axios";
import useUserStore from "../store/userStore";

// 사전 정의된 주제 목록
const PREDEFINED_TOPICS = [
  "경제",
  "정치",
  "사회",
  "문화",
  "과학",
  "IT",
  "스포츠",
];

export default function KeywordEdit() {
  const userId = useUserStore((state) => state.userId);
  const [currentTopic, setCurrentTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [currentKeywords, setCurrentKeywords] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        // 사용자의 주제와 키워드 가져오기
        const response = await userApi.getKeywords(userId);
        console.log("사용자 설정 응답:", response.data);

        // API 응답에서 주제와 키워드를 가져와 상태에 저장
        // 가정: 응답은 { topic: "경제", keywords: ["주식", "부동산"] } 형태
        const { topic = "", keywords = [] } = response.data;
        setCurrentTopic(topic);
        setSelectedTopic(topic);

        // 키워드 배열을 쉼표로 구분된 문자열로 변환
        const keywordsString = Array.isArray(keywords)
          ? keywords.join(", ")
          : "";
        setKeywords(keywordsString);
        setCurrentKeywords(keywordsString);
      } catch (error) {
        console.error("사용자 설정 로딩 오류:", error);
        toast.error("설정을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPreferences();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // 주제 선택 핸들러
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
  };

  // 키워드 변경 핸들러
  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  // 저장 핸들러
  const handleSave = async () => {
    // 주제가 선택되었는지 확인
    if (!selectedTopic) {
      toast.error("주제를 선택해주세요.");
      return;
    }

    // 키워드 처리 (쉼표로 구분된 문자열을 배열로 변환)
    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k !== "");

    // 변경사항이 없는 경우 저장 불필요
    if (selectedTopic === currentTopic && keywords === currentKeywords) {
      toast.info("변경된 사항이 없습니다.");
      return;
    }

    setSaving(true);

    try {
      // 백엔드에 업데이트 요청
      const response = await userApi.updateKeywords(userId, {
        topic: selectedTopic,
        keywords: keywordArray,
      });

      // 응답 상태 확인
      if (response && response.status === 200) {
        // 상태 업데이트
        setCurrentTopic(selectedTopic);
        setCurrentKeywords(keywords);
        toast.success("설정이 성공적으로 반영되었습니다.");
      } else {
        throw new Error("서버 응답이 유효하지 않습니다.");
      }
    } catch (error) {
      console.error("설정 저장 오류:", error);
      toast.error("설정 저장에 실패했습니다.");
      // 저장 실패 시 선택된 값을 원래대로 복원
      setSelectedTopic(currentTopic);
      setKeywords(currentKeywords);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 변경 사항이 있는지 확인
  const hasChanges =
    selectedTopic !== currentTopic || keywords !== currentKeywords;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          관심 설정
        </h2>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 주제 선택 섹션 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              관심 주제 선택 (하나만 선택 가능)
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {PREDEFINED_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleSelectTopic(topic)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${
                      selectedTopic === topic
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              선택한 주제: {selectedTopic || "(선택 안됨)"}
            </p>
          </div>

          {/* 키워드 입력 섹션 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              관심 키워드 입력
            </h3>
            <div>
              <textarea
                value={keywords}
                onChange={handleKeywordsChange}
                disabled={saving}
                placeholder="키워드를 쉼표(,)로 구분하여 입력하세요. 예: 주식, 부동산, 금리"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                원하는 키워드를 자유롭게 입력하세요. 쉼표(,)로 구분합니다.
              </p>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                hasChanges
                  ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? "저장 중..." : "변경사항 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

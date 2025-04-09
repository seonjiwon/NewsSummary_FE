import React, { useState } from "react";

function NewsSummary({ summary, loading }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-8 border-l-4 border-blue-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">✨</span>
          관심 분야 AI 뉴스 요약
        </h2>
        <button
          onClick={toggleExpand}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          {expanded ? "접기" : "펼치기"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">
            AI가 뉴스를 요약하고 있습니다...
          </span>
        </div>
      ) : (
        <div className={`text-gray-700 ${expanded ? "" : "line-clamp-4"}`}>
          {summary ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: summary.replace(/\n/g, "<br/>"),
              }}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              요약 내용이 없습니다.
            </p>
          )}
        </div>
      )}

      {!loading && summary && !expanded && (
        <div className="text-center mt-2">
          <button
            onClick={toggleExpand}
            className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700"
          >
            더 보기
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default NewsSummary;

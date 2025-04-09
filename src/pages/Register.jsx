import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userApi } from "../api/axios";
import useUserStore from "../store/userStore";

const topics = ["경제", "정치", "사회", "문화", "과학", "IT", "스포츠"];

export default function Register() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    preferredTopic: "경제",
    keywords: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("회원가입 시도:", formData.email);
    console.log("선호 주제:", formData.preferredTopic);
    console.log("키워드:", formData.keywords);

    try {
      const userData = {
        ...formData,
        keywords: formData.keywords.split(",").map((k) => k.trim()),
      };
      console.log("회원가입 요청 데이터:", userData);

      const response = await userApi.register(userData);
      console.log("회원가입 응답:", response.data);

      // 회원가입 성공 - userId만 확인
      const { userId } = response.data;

      console.log("회원가입 성공, 사용자 ID:", userId);

      toast.success("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");

      // 회원가입 성공 시 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 1500); // 1.5초 후 이동하여 사용자가 성공 메시지를 볼 수 있게 함
    } catch (error) {
      console.error("회원가입 실패:", error);
      console.error("오류 상세:", error.response?.data || error.message);

      // 오류 메시지 상세화
      if (error.response?.data?.error) {
        toast.error(`회원가입 실패: ${error.response.data.error}`);
      } else {
        toast.error("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          뉴스 요약 서비스 회원가입
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input mt-1"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                className="input mt-1"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700"
              >
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="input mt-1"
                value={formData.nickname}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="preferredTopic"
                className="block text-sm font-medium text-gray-700"
              >
                선호 주제
              </label>
              <select
                id="preferredTopic"
                name="preferredTopic"
                className="input mt-1"
                value={formData.preferredTopic}
                onChange={handleChange}
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700"
              >
                관심 키워드 (쉼표로 구분)
              </label>
              <input
                id="keywords"
                name="keywords"
                type="text"
                required
                className="input mt-1"
                placeholder="예: AI, 주식, 부동산"
                value={formData.keywords}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="w-full btn btn-primary">
              가입하기
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center btn btn-secondary"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { create } from "zustand";

const useUserStore = create((set) => {
  console.log("userStore 초기화, localStorage에서 사용자 정보 확인");
  const savedUserId = localStorage.getItem("userId");
  const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
  const savedToken = localStorage.getItem("token");
  console.log(
    "저장된 사용자 ID:",
    savedUserId,
    "관리자 여부:",
    savedIsAdmin,
    "토큰 존재:",
    !!savedToken
  );

  return {
    userId: savedUserId || null,
    isAdmin: savedIsAdmin || false,
    token: savedToken || null,
    setUser: (userId, isAdmin = false, token) => {
      console.log(
        "사용자 정보 설정:",
        "ID:",
        userId,
        "관리자 여부:",
        isAdmin,
        "토큰:",
        token ? "존재" : "없음"
      );
      localStorage.setItem("userId", userId);
      localStorage.setItem("isAdmin", isAdmin);
      if (token) {
        localStorage.setItem("token", token);
      }
      set({ userId, isAdmin, token });
    },
    clearUser: () => {
      console.log("사용자 정보 삭제");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");
      set({ userId: null, isAdmin: false, token: null });
    },
    getToken: () => {
      return localStorage.getItem("token");
    },
  };
});

export default useUserStore;

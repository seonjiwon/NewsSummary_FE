# AI 뉴스 요약 서비스 (Frontend)

이 프로젝트는 사용자의 관심 주제와 키워드에 맞춰 뉴스를 수집하고, AI를 활용하여 요약 정보를 제공하는 개인화된 뉴스 요약 서비스의 프론트엔드 부분입니다.

> 이 프로젝트는 [Cursor](https://cursor.sh) IDE와 Claude AI를 활용하여 개발되었습니다.

## 주요 기능

1. **사용자 인증**

   - 회원가입: 이메일, 비밀번호, 닉네임 등록
   - 로그인: 사용자 인증 및 토큰 발급

2. **관심 분야 설정**

   - 주제 선택: 경제, 정치, 사회, 문화, 과학, IT, 스포츠 중 하나 선택
   - 키워드 입력: 사용자가 관심 있는 키워드를 쉼표로 구분하여 입력

3. **뉴스 피드**

   - 인기 뉴스: 일반적인 인기 뉴스 제공
   - 관심 주제 뉴스: 사용자의 관심 주제와 키워드에 맞춘 뉴스 제공
   - 페이지네이션: 페이지 단위로 뉴스 데이터 로드

4. **AI 뉴스 요약**
   - 요약 생성: 사용자의 관심 주제와 키워드에 맞춘 뉴스를 AI로 요약
   - 요약 표시: 축약된 형태로 표시하고 펼치기/접기 기능 제공

## 기술 스택

- React: 프론트엔드 프레임워크
- React Router: 페이지 라우팅
- Axios: HTTP 클라이언트
- Zustand: 상태 관리
- React-Hot-Toast: 토스트 알림
- Tailwind CSS: UI 스타일링

## 프로젝트 구조

```
src/
├── api/
│   └── axios.js        # API 요청 설정 및 엔드포인트
├── components/
│   ├── NewsSummary.jsx # 뉴스 요약 컴포넌트
│   ├── Pagination.jsx  # 페이지네이션 컴포넌트
│   └── layout/         # 레이아웃 관련 컴포넌트
├── pages/
│   ├── Admin.jsx       # 관리자 페이지
│   ├── Hello.jsx       # 소개 페이지
│   ├── KeywordEdit.jsx # 관심 주제/키워드 설정 페이지
│   ├── Login.jsx       # 로그인 페이지
│   ├── NewsList.jsx    # 뉴스 피드 페이지
│   └── Register.jsx    # 회원가입 페이지
└── store/
    └── userStore.js    # 사용자 정보 저장소
```

## API 명세서

### 사용자 인증 API

#### 로그인

- **URL**: `/users/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "userId": 123,
    "isAdmin": false,
    "token": "jwt_token_here"
  }
  ```

#### 회원가입

- **URL**: `/users`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "nickname": "사용자",
    "preferredTopic": "경제",
    "keywords": ["주식", "부동산", "금리"]
  }
  ```
- **Response**:
  ```json
  {
    "userId": 123
  }
  ```

### 사용자 설정 API

#### 관심 주제 및 키워드 가져오기

- **URL**: `/users/{userId}/keywords`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "topic": "경제",
    "keywords": ["주식", "부동산", "금리"]
  }
  ```

#### 관심 주제 및 키워드 업데이트

- **URL**: `/users/{userId}/keywords`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "topic": "경제",
    "keywords": ["주식", "부동산", "금리"]
  }
  ```
- **Response**: HTTP 200 OK

### 뉴스 API

#### 뉴스 목록 가져오기

- **URL**: `/users/{userId}/news`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: 페이지 번호 (1부터 시작)
- **Response**:
  ```json
  {
    "popular": [
      {
        "title": "뉴스 제목",
        "description": "뉴스 내용",
        "link": "https://example.com/news",
        "pubDate": "2023-04-08T10:00:00"
      }
    ],
    "topic": [
      {
        "title": "관심 주제 뉴스 제목",
        "description": "뉴스 내용",
        "link": "https://example.com/news",
        "pubDate": "2023-04-08T10:00:00"
      }
    ]
  }
  ```

#### 뉴스 요약 가져오기

- **URL**: `/users/{userId}/news-summary`
- **Method**: `GET`
- **Response**: 요약된 뉴스 텍스트 (String)

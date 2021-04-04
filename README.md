# Uber Eats - Clone

  Typescript로 작성된 Nest.js 기반의 백엔드 서버 입니다.
  GraphQL로 통신하고 있으며 GraphQL Subscription을 사용, 웹소켓으로 실시간 통신이 구현 되어있습니다.
  PostgreSQL을 사용했으며 Typeorm으로 작성, migration설정이 되어 있습니다.

  구글 MAP API 를 사용하여 지도, 네비게이션을 구현하였고
  AWS S3 Storage에 Static image를 저장하고 있습니다. (테스트 베포된 웹에는 미적용)

  React도 Typescript로 작성되었으며, tailwind, autofixer, postcss를 적용했습니다.
  Paddle을 사용하여 결제서비스를 구현하였고, Mailgun 서비스로 메일인증 과정을 추가하였습니다. (테스트 배포된 웹에는 미적용)


## Main Function / 주요 기능

* 회원가입
* 로그인 ( JWT 토큰 사용 인증 )
  
* Client
  * 음식점 검색
  * 음식 주문
  * 주문 확인
  
* Owner
  * 음식점 생성
  * 메뉴 추가
    * 메뉴 하위 메뉴 추가
  * Promotion 결제

* Delivery
  * 딜리버리 가능 확인
  * 구글 맵 - 현재위치, 음식점, 고객 위치 확인
  * 구글 맵 - 경로 확인

* 모든 주문 리얼타임으로 조회 가능

## used libraries

```
- Server (BackEnd)
  - @nestjs/graphql graphql-tools graphql apollo-server-express
  - class-validator class-transformer
  - @nestjs/typeorm typeorm
  - @nestjs/config
  - cross-env
  - joi (env validator)
  - bcrypt
  - @types/bcrypt -D
  - jsonwebtoken
  - @types/jsonwebtoken -D
  - got
  - form-data
  - graphql-subscriptions
  - @nestjs/schedule
  - aws-sdk

- View (Front End)
  - @apollo/client
  - apollo (global also!)
  - react-hook-form
  - postcss
  - autofixer
  - tailwind
  - tailwindcss
  - rimraf
  - react-helmet (yarn add react-helmet-async) (bc of warning)
  - mock-apollo-client
  - subscriptions-transport-ws
  - google-map-react / @types
  - @types/googlemaps -d
  ```

## Deployed Web | 배포된 페이지

### 로그인
![메인 로그인](https://user-images.githubusercontent.com/58277160/113515741-54d61b80-95b1-11eb-9322-abd22716dd2b.png)

### 로그인 - 모바일
![메인로그인- 모바일 화면](https://user-images.githubusercontent.com/58277160/113515770-78996180-95b1-11eb-87e8-f1dcf5420ee6.png)

### 메인 - Client
![client - 메인 화면](https://user-images.githubusercontent.com/58277160/113515773-7b945200-95b1-11eb-8fbe-38aca774daa3.png)

### 음식점 메인 - Client 
![client - 움식점 메인](https://user-images.githubusercontent.com/58277160/113515780-7f27d900-95b1-11eb-8181-9b3d77a97611.png)

### 음식점 메인 - 모바일 - Client 
![client - 움식점 메인 - 모바일](https://user-images.githubusercontent.com/58277160/113515779-7e8f4280-95b1-11eb-9a1e-8ea6676678c0.png)

### 음식점 검색 - 카테고리
![client - 카테고리 별](https://user-images.githubusercontent.com/58277160/113515783-82bb6000-95b1-11eb-93c6-49e035830ea8.png)

### 음식 주문 - A) 메뉴 선택
![주문1](https://user-images.githubusercontent.com/58277160/113515848-e180d980-95b1-11eb-86a0-fb620d298053.png)

### 음식 주문 - B) 주문 확인
![주문 2](https://user-images.githubusercontent.com/58277160/113515847-e0e84300-95b1-11eb-8366-48be6d60e9e0.png)

### 음식 주문 - C) 배달원 확인
![주문3](https://user-images.githubusercontent.com/58277160/113515850-e2197000-95b1-11eb-89ab-ef5aa86f21a4.png)

### 음식 주문 - D) 배달 완료
![주문5](https://user-images.githubusercontent.com/58277160/113515845-e04fac80-95b1-11eb-853e-f21ef802e313.png)



## Acknowledgments / 감사의 말

* Thank you for coming here

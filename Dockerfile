# 실습용 예제이므로 빌드와 실행을 한 이미지에서 처리하는 단순한 구성을 사용합니다.
FROM node:22-alpine

# 컨테이너 내부 작업 디렉터리를 /app으로 통일합니다.
WORKDIR /app

# package manifest를 먼저 복사해 의존성 설치 레이어 캐시를 최대한 재사용합니다.
COPY package*.json ./
RUN npm ci

# 프로젝트 전체를 복사한 뒤 NestJS 애플리케이션을 빌드합니다.
COPY . .
RUN npm run build

# 컨테이너 외부에서도 접근할 수 있도록 기본 실행 주소와 포트를 지정합니다.
ENV HOST=0.0.0.0
ENV PORT=3000

# 애플리케이션이 컨테이너 내부에서 사용하는 포트를 문서화합니다.
EXPOSE 3000

# 빌드된 NestJS 애플리케이션을 실행합니다.
CMD ["npm", "run", "start:dev"]

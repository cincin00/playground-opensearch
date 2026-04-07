# playground-opensearch

![opensearch-dashboard](image.png)

NestJS와 OpenSearch를 함께 실습하기 위한 예제 프로젝트입니다.

## 시작하기

```bash
docker compose up --build
```

`app` 서비스는 파일 변경 감지가 활성화된 개발 모드로 실행되므로, 소스 코드를 수정하면 컨테이너 내부에 자동으로 반영됩니다.

## 로컬 접속 주소

`docker compose up --build` 실행 후 아래 주소로 각 서비스에 접속할 수 있습니다.

| 서비스 | URL | 용도 |
| --- | --- | --- |
| Nginx 진입점 | `http://localhost` | `80` 포트로 노출되는 기본 진입점입니다. 요청은 Nest 앱으로 프록시됩니다. |
| Nginx 경유 Swagger | `http://localhost/docs` | Nginx를 통해 노출되는 Swagger API 문서 화면입니다. |
| Nest 앱 직접 접속 | `http://localhost:3000` | Nginx를 거치지 않고 Nest 애플리케이션에 직접 접속합니다. |
| Swagger 직접 접속 | `http://localhost:3000/docs` | API 엔드포인트를 테스트하고 문서를 확인할 수 있는 Swagger UI입니다. |
| OpenSearch Dashboards | `http://localhost:5601` | 인덱스 확인, 검색, 대시보드 탐색 등에 사용하는 OpenSearch Dashboards 화면입니다. |
| OpenSearch API | `http://localhost:9200` | 인덱스 생성, 문서 저장, 검색, 클러스터 조회 등에 사용하는 OpenSearch REST API 엔드포인트입니다. |
| OpenSearch 클러스터 상태 | `http://localhost:9200/_cluster/health` | OpenSearch 클러스터의 현재 상태를 빠르게 확인하는 헬스 체크 주소입니다. |

Docker 없이 로컬 Node.js 환경에서 실행하려면:

```bash
npm install
npm run start:dev
```

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run build` | Nest 애플리케이션을 빌드하여 `dist` 디렉터리에 실행 파일을 생성합니다. |
| `npm run start` | 기본 모드로 Nest 애플리케이션을 실행합니다. |
| `npm run start:dev` | 파일 변경을 감지하는 개발 모드로 애플리케이션을 실행합니다. |
| `npm run start:prod` | 빌드된 `dist/main` 파일을 기준으로 운영 모드로 애플리케이션을 실행합니다. |
| `npm run test` | Jest를 사용해 단위 테스트를 실행합니다. |
| `npm run test:e2e` | `test/jest-e2e.json` 설정을 사용해 e2e 테스트를 실행합니다. |
| `npm run lint` | ESLint로 `src`, `test` 경로의 코드 스타일과 문법 오류를 검사합니다. |

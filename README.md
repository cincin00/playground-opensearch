# playground-opensearch

![opensearch-dashboard](image.png)

NestJS와 OpenSearch를 함께 실습하기 위한 예제 프로젝트입니다.

## 프로젝트 개요

- MySQL에 저장된 상품 데이터를 NestJS API로 관리합니다.
- OpenSearch 클라이언트를 NestJS에 연동해 검색 엔진 실습 환경을 구성합니다.
- OpenSearch Dashboards를 개발용 무인증 구성으로 실행해 인덱스와 문서를 바로 확인할 수 있습니다.
- Docker Compose로 `app`, `nginx`, `mysql`, `opensearch`, `opensearch-dashboards`를 함께 실행합니다.

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 상품 CRUD API | 상품 조회, 생성, 수정, 삭제 기능을 제공합니다. |
| 상태 확인 API | 루트(`/`)와 헬스 체크(`/health`)로 서비스 상태를 확인할 수 있습니다. |
| OpenSearch 연동 | 클러스터 정보 조회, 헬스 체크, bulk 적재 API를 제공합니다. |
| MySQL -> OpenSearch 이관 | 상품 데이터를 지정한 OpenSearch 인덱스로 bulk 적재할 수 있습니다. |
| Swagger 문서 | Nest Swagger UI를 통해 API를 테스트할 수 있습니다. |

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Backend | NestJS 11, TypeScript |
| Database | MySQL, TypeORM |
| Search Engine | OpenSearch, `nestjs-opensearch`, `@opensearch-project/opensearch` |
| Documentation | Swagger |
| Container | Docker Compose, Nginx |

## 시작하기

먼저 `.env.example` 파일을 참고해 `.env` 파일을 준비한 뒤 아래 명령어를 실행합니다.

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

## 환경 변수

| 변수명 | 설명 |
| --- | --- |
| `MYSQL_HOST` | MySQL 호스트 주소입니다. Docker Compose에서는 `mysql-service`를 사용합니다. |
| `MYSQL_ROOT_PASSWORD` | MySQL root 계정 비밀번호입니다. |
| `MYSQL_DATABASE` | 사용할 MySQL 데이터베이스 이름입니다. |
| `MYSQL_USER` | 애플리케이션에서 사용할 MySQL 사용자 계정입니다. |
| `MYSQL_PASSWORD` | 애플리케이션에서 사용할 MySQL 사용자 비밀번호입니다. |
| `MYSQL_DB_PORT` | 호스트에 노출할 MySQL 포트입니다. |
| `OPENSEARCH_NODE` | Nest 애플리케이션이 접속할 OpenSearch 주소입니다. |

## 주요 API

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/` | 서비스 기본 상태 정보를 반환합니다. |
| `GET` | `/health` | 서비스 헬스 체크 정보를 반환합니다. |
| `GET` | `/product` | 전체 상품 목록을 조회합니다. |
| `GET` | `/product/:product_id` | 특정 상품 상세 정보를 조회합니다. |
| `POST` | `/product` | 상품을 생성합니다. |
| `PUT` | `/product/:product_id` | 상품 정보를 수정하고 수정 결과를 반환합니다. |
| `DELETE` | `/product/:product_id` | 상품을 삭제합니다. |
| `GET` | `/opensearch` | OpenSearch 클러스터 정보를 조회합니다. |
| `GET` | `/opensearch/health` | OpenSearch 클러스터 상태를 조회합니다. |
| `POST` | `/opensearch/bulk/:index` | MySQL 상품 데이터를 지정한 OpenSearch 인덱스로 bulk 적재합니다. |

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

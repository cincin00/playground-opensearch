# playground-opensearch

![opensearch-dashboard](image.png)

NestJS와 OpenSearch를 함께 실습하기 위한 예제 프로젝트입니다. MySQL의 상품 데이터를 API로 관리하고, 이를 OpenSearch에 색인한 뒤 검색 API와 Dashboards에서 확인할 수 있습니다.

## 프로젝트 개요

- MySQL에 저장된 상품 데이터를 NestJS API로 관리합니다.
- OpenSearch 클라이언트를 NestJS에 연동해 검색 엔진 실습 환경을 구성합니다.
- MySQL의 샘플 상품 데이터를 OpenSearch 인덱스로 bulk 적재한 뒤 검색 API로 조회할 수 있습니다.
- OpenSearch Dashboards를 개발용 무인증 구성으로 실행해 인덱스와 문서를 바로 확인할 수 있습니다.
- Docker Compose로 `app`, `nginx`, `mysql`, `opensearch`, `opensearch-dashboards`를 함께 실행합니다.

## 실행 흐름

1. `mysql/init.sql`이 실행되면서 `products` 테이블과 샘플 상품 10건이 생성됩니다.
2. `POST /opensearch/bulk/products_search`를 호출하면 MySQL 상품 데이터를 OpenSearch로 bulk 적재합니다.
3. `GET /search`와 `GET /search/:search_id`는 OpenSearch 인덱스 `products_search`를 조회합니다.
4. OpenSearch Dashboards에서 `products_search` 인덱스와 문서를 시각적으로 확인할 수 있습니다.

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 상품 CRUD API | 상품 조회, 생성, 수정, 삭제 기능을 제공합니다. |
| 상태 확인 API | 루트(`/`)와 헬스 체크(`/health`)로 서비스 상태를 확인할 수 있습니다. |
| OpenSearch 연동 | 클러스터 정보 조회, 헬스 체크, bulk 적재 API를 제공합니다. |
| MySQL -> OpenSearch 이관 | 상품 데이터를 지정한 OpenSearch 인덱스로 bulk 적재할 수 있습니다. |
| OpenSearch 검색 API | `products_search` 인덱스에 대한 조회, 생성, 수정, 삭제 API를 제공합니다. |
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

### 사전 준비

- Docker Engine 또는 Docker Desktop
- Docker Compose Plugin
- 선택 사항: Docker 없이 앱만 로컬에서 실행할 경우 Node.js 22 권장

먼저 `.env.example` 파일을 참고해 `.env` 파일을 준비합니다.

```bash
cp .env.example .env
```

예시:

```env
MYSQL_HOST=127.0.0.1
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=playground
MYSQL_USER=playground
MYSQL_PASSWORD=playground
MYSQL_DB_PORT=3306
OPENSEARCH_NODE=http://localhost:9200
```

그다음 아래 명령어를 실행합니다.

```bash
docker compose up --build
```

`app` 서비스는 파일 변경 감지가 활성화된 개발 모드로 실행되므로, 소스 코드를 수정하면 컨테이너 내부에 자동으로 반영됩니다.

## 빠르게 확인하기

기동 직후에는 MySQL 샘플 데이터만 준비되어 있고, OpenSearch 검색용 인덱스는 아직 비어 있습니다. 아래 순서로 확인하면 전체 흐름을 빠르게 검증할 수 있습니다.

```bash
# 1) 앱 상태 확인
curl http://localhost/health

# 2) MySQL 상품 데이터를 OpenSearch 검색 인덱스(products_search)로 적재
curl -X POST http://localhost/opensearch/bulk/products_search

# 3) OpenSearch 검색 API 조회
curl "http://localhost/search?page=1&limit=10"

# 4) 상품명으로 검색
curl "http://localhost/search?page=1&limit=10&product_name=마우스"
```

`/search` 계열 API는 내부적으로 `products_search` 인덱스를 고정 사용합니다. 따라서 `/opensearch/bulk/:index`를 다른 인덱스 이름으로 호출하면 `/search`에서는 해당 데이터를 조회할 수 없습니다.

샘플 데이터를 완전히 초기화하고 다시 적재하려면 볼륨까지 정리한 뒤 재기동해야 합니다.

```bash
docker compose down -v
docker compose up --build
```

## OpenSearch 인덱스 매핑

`products_search` 인덱스를 OpenSearch의 자동 생성 매핑에 맡기지 않고, 자동완성 분석기와 필드 타입을 직접 제어하고 싶다면 bulk 적재 전에 아래 명령을 먼저 실행하면 됩니다. OpenSearch Dashboards Dev Tools 또는 OpenSearch REST API에서 사용할 수 있습니다.

```http
PUT /products_search
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete_index": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        },
        "autocomplete_search": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "product_id": {
        "type": "keyword"
      },
      "product_name": {
        "type": "text",
        "fields": {
          "raw": {
            "type": "keyword"
          },
          "autocomplete": {
            "type": "text",
            "analyzer": "autocomplete_index",
            "search_analyzer": "autocomplete_search"
          }
        }
      },
      "product_price": {
        "type": "scaled_float",
        "scaling_factor": 100
      },
      "created_at": {
        "type": "date",
        "format": "strict_date_optional_time||yyyy-MM-dd HH:mm:ss"
      },
      "updated_at": {
        "type": "date",
        "format": "strict_date_optional_time||yyyy-MM-dd HH:mm:ss"
      },
      "suggest": {
        "type": "completion"
      }
    }
  }
}
```

이 매핑을 적용한 뒤에는 아래 bulk API를 호출해 MySQL 상품 데이터를 `products_search` 인덱스로 적재하면 됩니다.

```bash
curl -X POST http://localhost/opensearch/bulk/products_search
```

## 로컬 접속 주소

`docker compose up --build` 실행 후 아래 주소로 각 서비스에 접속할 수 있습니다.

| 서비스 | URL | 용도 |
| --- | --- | --- |
| Nginx 진입점 | `http://localhost` | `80` 포트로 노출되는 기본 진입점입니다. 요청은 Nest 앱으로 프록시됩니다. |
| Nginx 경유 Swagger | `http://localhost/docs` | Nginx를 통해 노출되는 Swagger API 문서 화면입니다. |
| Nest 앱 직접 접속 | `http://localhost:3000` | Nginx를 거치지 않고 Nest 애플리케이션에 직접 접속합니다. |
| Swagger 직접 접속 | `http://localhost:3000/docs` | API 엔드포인트를 테스트하고 문서를 확인할 수 있는 Swagger UI입니다. |
| MySQL | `127.0.0.1:${MYSQL_DB_PORT}` | 로컬에서 MySQL 클라이언트로 샘플 상품 데이터를 직접 조회할 때 사용하는 주소입니다. |
| OpenSearch Dashboards | `http://localhost:5601` | 인덱스 확인, 검색, 대시보드 탐색 등에 사용하는 OpenSearch Dashboards 화면입니다. |
| OpenSearch API | `http://localhost:9200` | 인덱스 생성, 문서 저장, 검색, 클러스터 조회 등에 사용하는 OpenSearch REST API 엔드포인트입니다. |
| OpenSearch 클러스터 상태 | `http://localhost:9200/_cluster/health` | OpenSearch 클러스터의 현재 상태를 빠르게 확인하는 헬스 체크 주소입니다. |

## 환경 변수

Docker Compose로 전체 스택을 띄울 때 `app` 컨테이너는 내부 네트워크 주소를 사용합니다.

- `MYSQL_HOST=mysql-service`
- `MYSQL_DB_PORT=3306`
- `OPENSEARCH_NODE=http://opensearch-service:9200`

따라서 `.env` 파일은 주로 MySQL 계정 정보, 호스트 포트 노출값, 그리고 Docker 없이 로컬 Node.js로 실행할 때 사용할 접속 정보를 채우는 용도로 생각하면 됩니다.

| 변수명 | 설명 |
| --- | --- |
| `MYSQL_HOST` | 로컬 Node.js 실행 시 사용할 MySQL 호스트 주소입니다. Docker Compose의 `app` 컨테이너 안에서는 `mysql-service`를 사용합니다. |
| `MYSQL_ROOT_PASSWORD` | MySQL root 계정 비밀번호입니다. |
| `MYSQL_DATABASE` | 사용할 MySQL 데이터베이스 이름입니다. |
| `MYSQL_USER` | 애플리케이션에서 사용할 MySQL 사용자 계정입니다. |
| `MYSQL_PASSWORD` | 애플리케이션에서 사용할 MySQL 사용자 비밀번호입니다. |
| `MYSQL_DB_PORT` | 로컬 Node.js에서는 MySQL 접속 포트이고, Docker Compose에서는 호스트에 노출할 MySQL 포트입니다. `app` 컨테이너 내부에서는 항상 `3306`을 사용합니다. |
| `OPENSEARCH_NODE` | 로컬 Node.js 실행 시 Nest 애플리케이션이 접속할 OpenSearch 주소입니다. Docker Compose의 `app` 컨테이너 안에서는 `http://opensearch-service:9200`을 사용합니다. |

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
| `GET` | `/search` | OpenSearch 인덱스 `products_search`의 상품 문서를 페이지 단위로 조회합니다. |
| `GET` | `/search/:search_id` | `search_id`로 OpenSearch 상품 문서를 조회합니다. |
| `POST` | `/search` | OpenSearch 인덱스 `products_search`에 상품 문서를 생성합니다. |
| `PUT` | `/search/:search_id` | OpenSearch 상품 문서를 수정합니다. |
| `DELETE` | `/search/:search_id` | OpenSearch 상품 문서를 삭제합니다. |

`GET /search`는 아래 쿼리 파라미터를 지원합니다.

| 파라미터 | 필수 | 설명 |
| --- | --- | --- |
| `page` | 예 | 페이지 번호입니다. |
| `limit` | 예 | 페이지 크기입니다. |
| `product_name` | 아니오 | 상품명 match 검색 조건입니다. |
| `sortField` | 아니오 | `createdAt`, `updatedAt` 중 하나를 지정할 수 있습니다. |
| `orderBy` | 아니오 | `ASC`, `DESC` 중 하나를 지정할 수 있습니다. 기본값은 `DESC`입니다. |

예시:

```bash
curl "http://localhost/search?page=1&limit=20&sortField=createdAt&orderBy=DESC"
curl "http://localhost/search?page=1&limit=20&product_name=키보드"
```

## Docker 없이 로컬 Node.js 환경에서 실행

이 경우 MySQL과 OpenSearch는 별도로 먼저 실행되어 있어야 합니다. 가장 간단한 방법은 저장소의 Compose 설정으로 인프라만 띄우고 앱은 호스트에서 실행하는 것입니다.

```bash
docker compose up -d mysql-service opensearch-service opensearch-dashboards
```

그 후 `.env`에 로컬 접속값을 채운 뒤 앱을 실행합니다.

```bash
npm install
npm run start:dev
```

예를 들어 위 방식이라면 `.env`를 아래처럼 둘 수 있습니다.

```env
MYSQL_HOST=127.0.0.1
MYSQL_DB_PORT=3306
OPENSEARCH_NODE=http://127.0.0.1:9200
```

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run build` | Nest 애플리케이션을 빌드하여 `dist` 디렉터리에 실행 파일을 생성합니다. |
| `npm run format` | Prettier로 `src`, `test` 경로의 파일 포맷을 정리합니다. |
| `npm run start` | 기본 모드로 Nest 애플리케이션을 실행합니다. |
| `npm run start:dev` | 파일 변경을 감지하는 개발 모드로 애플리케이션을 실행합니다. |
| `npm run start:debug` | 디버거 연결이 가능한 watch 모드로 애플리케이션을 실행합니다. |
| `npm run start:prod` | 빌드된 `dist/main` 파일을 기준으로 운영 모드로 애플리케이션을 실행합니다. |
| `npm run test` | Jest를 사용해 단위 테스트를 실행합니다. |
| `npm run test:watch` | Jest 테스트를 watch 모드로 실행합니다. |
| `npm run test:cov` | Jest 테스트 커버리지를 측정합니다. |
| `npm run test:debug` | Jest 테스트를 Node.js 디버거와 함께 실행합니다. |
| `npm run test:e2e` | `test/jest-e2e.json` 설정을 사용해 e2e 테스트를 실행합니다. |
| `npm run lint` | ESLint로 `src`, `test` 경로의 코드 스타일과 문법 오류를 검사합니다. |

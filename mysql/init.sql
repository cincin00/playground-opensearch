SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  product_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '상품순번',
  product_name VARCHAR(255) NOT NULL COMMENT '상품명',
  product_price DECIMAL(10, 2) NOT NULL COMMENT '상품가격',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (product_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (product_name, product_price)
VALUES
  ('무선 마우스', 25900.00),
  ('기계식 키보드', 89000.00),
  ('27인치 모니터', 219000.00),
  ('USB-C 허브', 34900.00),
  ('노트북 거치대', 29900.00),
  ('외장 SSD 1TB', 149000.00),
  ('블루투스 스피커', 57900.00),
  ('웹캠', 45900.00),
  ('게이밍 헤드셋', 69900.00),
  ('모니터 받침대', 18900.00);

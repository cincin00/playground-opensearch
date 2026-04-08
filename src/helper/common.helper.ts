import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * camelCase 또는 PascalCase 문자열을 snake_case로 변환합니다.
 *
 * @param str 변환할 대상 문자열
 * @returns snake_case로 변환된 문자열
 */
export function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * SHA-256 해시 생성 공통 Helper
 * @param payload 문자열 또는 객체
 * @returns SHA-256 해시값 (hex)
 */
export function generateHash(payload: string | object): string {
  const value =
    typeof payload === 'string'
      ? payload
      : JSON.stringify(sortObjectKeys(payload));

  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * 객체 key 정렬 (JSON 직렬화 표준화)
 */
function sortObjectKeys<T extends Record<string, any>>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys) as unknown as T;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key as keyof T] = sortObjectKeys(obj[key as keyof T]);
        return acc;
      }, {} as T);
  }
  return obj;
}

/**
 * 업데이트용 DTO를 기존 엔티티에 병합하는 공통 Helper
 *
 * - DTO에 값이 하나도 없으면 BadRequestException 발생
 * - undefined / null은 무시하고 기존 값 유지
 *
 * @param existing 기존 엔티티
 * @param updateDto 업데이트 DTO (Partial)
 * @param entityName 에러 메시지용 엔티티 이름
 * @returns 병합된 엔티티
 */
export function mergeUpdateFields<T extends object>(
  existing: T,
  updateDto: Partial<T>,
  entityName = '데이터',
): T {
  const keys = Object.keys(updateDto) as (keyof T)[];

  const hasUpdateValue = keys.some(
    (k) => updateDto[k] !== undefined && updateDto[k] !== null,
  );
  if (!hasUpdateValue) {
    throw new BadRequestException(
      `최소 한 개 이상의 ${entityName} 수정 값이 필요합니다.`,
    );
  }

  keys.forEach((k) => {
    const value = updateDto[k];
    if (value !== undefined && value !== null) {
      existing[k] = value;
    }
  });

  return existing;
}

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FormDataToArrayPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    // 배열 필드 목록
    const arrayFields = ['tags', 'para_member', 'outside_member', 'date'];

    for (const field of arrayFields) {
      if (value[field] && typeof value[field] === 'string') {
        try {
          // JSON 문자열로 전송된 경우
          value[field] = JSON.parse(value[field]);
        } catch {
          // 쉼표로 구분된 문자열로 전송된 경우
          value[field] = value[field].split(',').map((item) => item.trim());
        }
      }
    }

    // date 필드는 Date 객체로 변환
    if (value.date) {
      value.date = value.date.map((date: string) => new Date(date));
    }

    return value;
  }
}

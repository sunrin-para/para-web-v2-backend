import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiProperty({
    description: '앨범 제목',
    example: '2024 선린 축제',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: '앨범 설명',
    example: '2024년도 선린인터넷고등학교 축제 사진 모음',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '앨범 날짜',
    example: '2024-05-20T00:00:00.000Z',
    required: false,
  })
  date?: Date;

  @ApiProperty({
    description: '삭제할 사진 인덱스 배열',
    example: [0, 1, 2],
    required: false,
    isArray: true,
  })
  deletedPhotoIndexes?: number[];
}

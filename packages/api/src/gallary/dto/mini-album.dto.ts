import { ApiProperty } from '@nestjs/swagger';

export class MonoAlbumDto {
  @ApiProperty({
    description: '앨범 제목',
    example: '2024 선린 축제',
  })
  title: string;

  @ApiProperty({
    description: '앨범 날짜',
    example: '2024-05-20T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: '앨범 썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnailUrl: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({
    description: '앨범 제목',
    example: '2024 선린 축제',
  })
  title: string;

  @ApiProperty({
    description: '앨범 설명',
    example: '2024년도 선린인터넷고등학교 축제 사진 모음',
  })
  description: string;

  @ApiProperty({
    description: '앨범 날짜',
    example: '2024-05-20T00:00:00.000Z',
  })
  date: Date;
}

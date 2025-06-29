import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '앨범 제목',
    example: '2024 선린 축제',
    required: false,
  })
  title?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '앨범 설명',
    example: '2024년도 선린인터넷고등학교 축제 사진 모음',
    required: false,
  })
  description?: string

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: '앨범 사진 URL 목록',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
    items: { type: 'string' },
  })
  photos: string[]

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    description: '앨범 날짜',
    example: '2024-05-20T00:00:00.000Z',
    required: false,
  })
  date?: Date
}

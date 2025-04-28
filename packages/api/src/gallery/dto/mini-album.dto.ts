import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class MonoAlbumDto {
  @IsNumber()
  @ApiProperty({
    description: '앨범 ID',
    example: 1,
  })
  id: string

  @IsString()
  @ApiProperty({
    description: '앨범 제목',
    example: '2024 선린 축제',
  })
  title: string

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: '앨범 날짜',
    example: '2024-05-20T00:00:00.000Z',
  })
  date: Date

  @IsString()
  @ApiProperty({
    description: '앨범 썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnailUrl: string
}

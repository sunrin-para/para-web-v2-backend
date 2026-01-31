import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, ValidateNested } from 'class-validator'
import { CreatePortfolioDto } from './create-portfolio.dto'
import { UpdatePortfolioDto } from './update-portfolio.dto'

export class PortfolioBatchUpdateItemDto {
  @ApiProperty({ description: '포트폴리오 ID' })
  @Type(() => Number)
  @IsInt()
  id: number

  @ApiProperty({ description: '수정할 포트폴리오 데이터', type: UpdatePortfolioDto })
  @ValidateNested()
  @Type(() => UpdatePortfolioDto)
  data: UpdatePortfolioDto
}

export class BatchUpsertPortfolioDto {
  @ApiProperty({
    description: '생성할 포트폴리오 목록',
    type: CreatePortfolioDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioDto)
  createItems: CreatePortfolioDto[]

  @ApiProperty({
    description: '수정할 포트폴리오 목록',
    type: PortfolioBatchUpdateItemDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioBatchUpdateItemDto)
  updateItems: PortfolioBatchUpdateItemDto[]
}

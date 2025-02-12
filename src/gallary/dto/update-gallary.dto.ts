import { PartialType } from '@nestjs/swagger';
import { CreateGallaryDto } from './create-gallary.dto';

export class UpdateGallaryDto extends PartialType(CreateGallaryDto) {}

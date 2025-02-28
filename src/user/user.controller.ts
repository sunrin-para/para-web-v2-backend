import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("User")
@Controller('user')
export class UserController {
    constructor (private readonly configService: ConfigService) {}
}

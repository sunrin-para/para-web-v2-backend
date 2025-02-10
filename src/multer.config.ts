import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { BadRequestException } from '@nestjs/common';

const env = process.env;
const DOWNLOAD_ROOT = env.DOWNLOAD_ROOT_DIR;

export const multerConfig = {
  members: {
    dest: `${DOWNLOAD_ROOT}/members/`,
  },
  portfolio: {
    dest: `${DOWNLOAD_ROOT}/portfolios/`,
  },
  gallary: {
    dest: `${DOWNLOAD_ROOT}/gallary/`,
  },
  applicants: {
    dest: `${DOWNLOAD_ROOT}/apply/`,
  },
};

Object.values(multerConfig).forEach(({ dest }) => {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
});

export const multerOptions = (
  fileType: 'members' | 'portfolio' | 'gallary' | 'applicants',
) => ({
  storage: diskStorage({
    destination: multerConfig[fileType].dest,
    filename: (req, file, cb) => {
      const fileName = `${uuid()}${extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(exe|js|dmg|py|sh|bat)$/)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'exe, js, dmg, py, sh, bat 형식의 파일은 업로드할 수 없습니다.',
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

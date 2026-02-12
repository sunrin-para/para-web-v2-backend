/// <reference types="dotenv" />

import {
  PrismaClient,
  Permission as PrismaPermission,
} from '@sunrin-para/database';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

function getDatabaseUrlFromArg() {
  const prefixedArg = process.argv.find((arg) => arg.startsWith('--db-url='));
  if (prefixedArg) {
    const databaseUrl = prefixedArg.slice('--db-url='.length);
    if (!databaseUrl) {
      throw new Error('`--db-url=` 뒤에 DB 연결 URL을 입력해주세요.');
    }
    return databaseUrl;
  }

  const dbUrlFlagIndex = process.argv.findIndex((arg) => arg === '--db-url');
  if (dbUrlFlagIndex !== -1) {
    const databaseUrl = process.argv[dbUrlFlagIndex + 1];
    if (!databaseUrl || databaseUrl.startsWith('--')) {
      throw new Error('`--db-url` 뒤에 DB 연결 URL을 입력해주세요.');
    }
    return databaseUrl;
  }

  return undefined;
}

async function main() {
  const databaseUrl = getDatabaseUrlFromArg();
  const prisma = databaseUrl
    ? new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
    : new PrismaClient();

  try {
    await prisma.$connect();

    const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PW, SALT_ROUND } = process.env;
    if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PW || !SALT_ROUND) {
      throw new Error(
        '기본 관리자 계정을 생성하기 위한 정보가 입력되지 않았습니다.',
      );
    }
    const saltRound = Number.parseInt(SALT_ROUND, 10);
    if (Number.isNaN(saltRound)) {
      throw new Error('SALT_ROUND는 숫자여야 합니다.');
    }

    const salt = await bcrypt.genSalt(saltRound);
    const encryptedPassword = await bcrypt.hash(DEFAULT_ADMIN_PW, salt);
    await prisma.user.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        name: 'PARA Default Admin',
        permission: PrismaPermission.SUPER,
        password: encryptedPassword,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch();

export class PortfolioDto {
  title: string;
  summary: string;
  description?: string;
  tags: string[];
  para_member: string[];
  outside_member: string[];
  date: Date[];
  link?: string;
  github?: string;
  thumbnail: string;
  filePath: string;
}

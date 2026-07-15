/**
 * 工作经历数据
 *
 * 改这里就能更新 /work 页面。
 * 
 * 字段说明：
 *   - id:           唯一标识（用于锚点）
 *   - company:      公司名
 *   - role:         职位
 *   - startDate:    开始日期 (YYYY-MM)
 *   - endDate:      结束日期 (YYYY-MM)，null = 至今
 *   - location:     城市（可选）
 *   - description:  一两句话概述
 *   - tech:         技术栈标签数组
 *   - highlights:   关键成就（可选，bullet list）
 *   - link:         公司/项目链接（可选）
 *   - logo:         公司 logo 路径（可选，相对于 /public）
 */

export type WorkEntry = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location?: string;
  description: string;
  tech: string[];
  highlights?: string[];
  link?: string;
  logo?: string;
};

export const workExperience: WorkEntry[] = [
  {
    id: 'current-role',
    company: '当前公司（示例）',
    role: '高级前端工程师',
    startDate: '2023-01',
    endDate: null,
    location: '上海',
    description: '负责核心业务线的前端架构设计与核心功能开发，参与跨团队协作推动工程化建设。',
    tech: ['React', 'TypeScript', 'Node.js', 'Astro', 'Vite'],
    highlights: [
      '主导 XX 系统从 0 到 1 搭建，支撑日活 10w+',
      '将首屏 LCP 从 4s 优化到 1.2s',
      '推进团队从 JS 迁移到 TS，覆盖率 90%+',
    ],
  },
  {
    id: 'prev-role',
    company: '上一家公司（示例）',
    role: '前端工程师',
    startDate: '2020-06',
    endDate: '2022-12',
    location: '杭州',
    description: '做 B 端 SaaS 产品，参与中后台框架设计与组件库建设。',
    tech: ['Vue', 'Webpack', 'Node.js', 'MongoDB'],
    highlights: [
      '封装 30+ 通用业务组件，被 5 个业务线复用',
      '搭建 CI/CD 流程，发布效率提升 3 倍',
    ],
  },
  {
    id: 'first-role',
    company: '第一家公司（示例）',
    role: '初级前端工程师',
    startDate: '2018-07',
    endDate: '2020-05',
    location: '北京',
    description: '做 H5 营销活动页和小程序，从切图仔开始入门。',
    tech: ['JavaScript', 'Vue', '小程序'],
  },
];

/**
 * 格式化日期范围
 *   2023-01 ~ null      -> "2023 - 至今"
 *   2020-06 ~ 2022-12   -> "2020.06 - 2022.12"
 */
export function formatDateRange(start: string, end: string | null): string {
  const startFmt = start.replace('-', '.');
  if (!end) return `${startFmt} - 至今`;
  const endFmt = end.replace('-', '.');
  return `${startFmt} - ${endFmt}`;
}

/**
 * 计算工作时长（粗略，几个月）
 */
export function durationText(start: string, end: string | null): string {
  const [sy, sm] = start.split('-').map(Number);
  const now = end ? end.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const [ey, em] = now;
  const months = (ey - sy) * 12 + (em - sm);
  if (months < 12) return `${months} 个月`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} 年 ${rest} 个月` : `${years} 年`;
}

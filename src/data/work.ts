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
 *
 * 注意：不要把手机号、邮箱等敏感信息放这里（这是公开页面）。
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
  // ===== 杭州端点 4 个独立项目 =====
  {
    id: 'duandian-agent',
    company: '杭州端点网络科技有限公司',
    role: '高级前端开发工程师',
    startDate: '2025-10',
    endDate: '2026-04',
    location: '杭州',
    description:
      '可视化 AI Agent 编排平台（AI 管理驾驶舱），与 Trantor 2.0 并行推进。',
    tech: ['React Flow', 'SSE', 'DSL 引擎', 'AI Ops'],
    highlights: [
      '基于 React Flow 实现多 Agent 流程拖拽编排',
      '设计 DSL 双向转换引擎，支持 50+ 字段 Agent 配置面板与 SSE 流式对话',
      '串联 4 种后端资源类型，自动处理跨资源数据同步与技能合并',
      '实现 AI Ops 可观测性模块，支持实时监控与异常告警',
    ],
  },
  {
    id: 'duandian-trantor-2',
    company: '杭州端点网络科技有限公司',
    role: '高级前端开发工程师',
    startDate: '2024-01',
    endDate: '2026-04',
    location: '杭州',
    description:
      'Trantor 2.0 Console 企业级软件构建平台前端架构设计与核心功能开发。',
    tech: ['React', 'TypeScript', 'TanStack Query', 'React Flow', 'CodeMirror 6', 'Vite'],
    highlights: [
      '开发企业级可视化服务编排引擎，支持 40+ 节点类型（流程控制/数据操作/AI/LLM/脚本/HTTP/审批/通知）',
      '基于 React Flow 自定义有向流程图渲染，支持普通/分支/独占/并行/Switch/Loop 等结构',
      '集成 CodeMirror 6 脚本编辑器与 AI 辅助流程生成',
      '实现可视化调试面板，显著降低配置门槛',
    ],
  },
  {
    id: 'duandian-trantor-1',
    company: '杭州端点网络科技有限公司',
    role: '前端工程师 → 高级前端工程师',
    startDate: '2018-06',
    endDate: '2023-12',
    location: '杭州',
    description:
      'Trantor 1.0 企业低代码平台前端研发，主导核心运行时引擎与组件库建设。',
    tech: ['React', 'TypeScript', 'MobX', 'Lerna', 'Monorepo'],
    highlights: [
      'Lerna Monorepo 管理 14 个子包、3500+ TypeScript 文件，制定多包协作规范',
      '设计 nusi-engine 低代码运行时引擎，AST 解析 XML 配置驱动页面渲染与动作执行',
      '构建基于 MobX 的响应式状态管理体系（shell / sider / route 等全局 store）',
      '开发 21+ 可复用数据容器组件（Table / Form / Tree / Detail 等），支持字段配置/校验/国际化',
      '实现动态路由系统与多标签页 keep-alive 缓存，支撑企业多应用导航场景',
    ],
  },
  {
    id: 'duandian-lazada',
    company: '杭州端点网络科技有限公司',
    role: '前端开发工程师',
    startDate: '2017-10',
    endDate: '2018-04',
    location: '杭州',
    description:
      '阿里主导的 Lazada 全平台重构项目（Voyager），东南亚电商。',
    tech: ['React', 'Weex', '灰度切流'],
    highlights: [
      '覆盖客户端 / 搜索 / 中台端到端全链路，协同超 300 名技术人员，负责 PC 端商品详情页核心模块',
      'Weex 完成移动端充值页跨端开发，一套代码覆盖 iOS / Android',
      '参与新加坡 / 泰国 / 马来西亚等 6 国灰度割接，每次含 100+ 步骤 / 200+ 张表数据迁移',
      '上线后当年 Birthday 大促 DAU 与 GMV 双双实现 200% 增长',
    ],
  },
];

/**
 * 格式化日期范围
 *   2023-01 ~ null      -> "2023.01 - 至今"
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

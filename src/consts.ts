export const SITE_TITLE = "Jose's Site";
export const SITE_DESCRIPTION =
  '写代码、读书、折腾各种东西。这里有我的博客、工作经历和一些杂七杂八。';
export const SITE_AUTHOR = 'Jose';
export const SITE_URL = 'https://ok-jose.github.io';

// "现在在做什么" 状态条
export const CURRENT_STATUS = {
  emoji: '🔨',
  label: '现在在写',
  text: 'Astro 博客搭建教程',
  href: '/blog',
};

// 社交链接
export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'rss' | 'email' | 'twitter';
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/ok-jose', icon: 'github' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  { label: 'Email', href: 'mailto:lg282923166@gmail.com', icon: 'email' },
];

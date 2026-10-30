export interface FriendLink {
  name: string;
  url: string;
}

export interface AboutMe {
  nickname: string;
  location: string;
  hobbies: string;
  qq: string;
}

// 友情链接（RSS 订阅链接按要求放在友情链接列表内）
export const friendLinks: FriendLink[] = [
  { name: '学校主页', url: 'https://example-school.edu.cn' },
  { name: '班级论坛', url: 'https://example-class.com' },
  { name: '电脑爱好者', url: 'https://example-cfan.com' },
  { name: '网易同学录', url: 'https://example-netease.com' },
  { name: 'RSS 订阅', url: '/rss.xml' },
];

// 关于我
export const aboutMe: AboutMe = {
  nickname: '小飞侠',
  location: '湖南·长沙',
  hobbies: '电脑、漫画、足球',
  qq: '12345678',
};

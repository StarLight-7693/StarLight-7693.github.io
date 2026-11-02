import { FRIEND_LINKS } from '@/data/friends';

// 友情链接：本地 webp 图标 + devicon CDN 图标混用，一律 lazy。
export default function FriendLinks() {
  return (
    <ul className="friend-grid">
      {FRIEND_LINKS.map((link) => (
        <li key={link.url}>
          <a className="friend-card" href={link.url} target="_blank" rel="noopener noreferrer">
            <img
              className="friend-icon"
              src={link.icon}
              alt=""
              width="36"
              height="36"
              loading="lazy"
              decoding="async"
            />
            <span className="friend-body">
              <span className="friend-name">{link.name}</span>
              <span className="friend-desc">{link.desc}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

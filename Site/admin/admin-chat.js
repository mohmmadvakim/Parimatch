// Admin Chat Manage — sample data (replace with Firebase later)
const chats = [
  {
    id: 'u101',
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    avatar: 'RK',
    lastMessage: 'Sir, mera deposit confirm nahi ho raha hai.',
    lastTime: '10:45 AM',
    unread: 2,
    status: 'online',
    messages: [
      { from: 'them', text: 'Hello sir, mera deposit confirm nahi ho raha hai.', time: '10:30 AM' },
      { from: 'me', text: 'Hello Rajesh ji, aapka transaction ID kya hai?', time: '10:35 AM' },
      { from: 'them', text: 'TXN123456789 hai sir.', time: '10:40 AM' },
      { from: 'them', text: 'Sir, mera deposit confirm nahi ho raha hai.', time: '10:45 AM' }
    ]
  },
  {
    id: 'u102',
    name: 'Priya Sharma',
    mobile: '+91 87654 32109',
    avatar: 'PS',
    lastMessage: 'Withdrawal kab tak aayega?',
    lastTime: '11:20 AM',
    unread: 0,
    status: 'offline',
    messages: [
      { from: 'them', text: 'Hi, withdrawal request submit ki thi.', time: '11:00 AM' },
      { from: 'me', text: 'Priya ji, aapka withdrawal process ho raha hai.', time: '11:05 AM' },
      { from: 'them', text: 'Withdrawal kab tak aayega?', time: '11:20 AM' }
    ]
  },
  {
    id: 'u103',
    name: 'Amit Singh',
    mobile: '+91 76543 21098',
    avatar: 'AS',
    lastMessage: 'Bonus nahi mila hai.',
    lastTime: '12:15 PM',
    unread: 1,
    status: 'online',
    messages: [
      { from: 'them', text: 'Sir, bonus nahi mila hai.', time: '12:10 PM' },
      { from: 'me', text: 'Amit ji, check karke batate hain.', time: '12:12 PM' },
      { from: 'them', text: 'Bonus nahi mila hai.', time: '12:15 PM' }
    ]
  },
  {
    id: 'u104',
    name: 'Neha Gupta',
    mobile: '+91 65432 10987',
    avatar: 'NG',
    lastMessage: 'KYC document upload kar diya hai.',
    lastTime: '02:30 PM',
    unread: 3,
    status: 'offline',
    messages: [
      { from: 'them', text: 'Hello, KYC document upload kar diya hai.', time: '02:15 PM' },
      { from: 'me', text: 'Neha ji, document verify ho raha hai.', time: '02:20 PM' },
      { from: 'them', text: 'KYC document upload kar diya hai.', time: '02:30 PM' }
    ]
  },
  {
    id: 'u105',
    name: 'Vikram Yadav',
    mobile: '+91 54321 09876',
    avatar: 'VY',
    lastMessage: 'Bank statement chahiye.',
    lastTime: '04:05 PM',
    unread: 0,
    status: 'online',
    messages: [
      { from: 'them', text: 'Sir, bank statement chahiye.', time: '03:50 PM' },
      { from: 'me', text: 'Vikram ji, email par bhej diya hai.', time: '03:55 PM' },
      { from: 'them', text: 'Bank statement chahiye.', time: '04:05 PM' }
    ]
  }
];

function renderChatList(filter = '') {
  const list = document.getElementById('chatList');
  const countBadge = document.getElementById('chatCount');

  const filtered = chats.filter(c => {
    const q = filter.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.mobile.includes(q);
  });

  countBadge.textContent = filtered.length;

  list.innerHTML = filtered.map(c => {
    const unreadBadge = c.unread > 0
      ? `<div class="chat-unread">${c.unread}</div>`
      : '';
    const statusDot = c.status === 'online'
      ? `<span class="badge success sm" style="font-size:0.62rem;display:flex;align-items:center;gap:4px;"><span class="dot" style="background:var(--yes);width:6px;height:6px;border-radius:50%;"></span>Online</span>`
      : `<span class="badge neutral sm" style="font-size:0.62rem;">Offline</span>`;

    return `
      <a href="chat.html?id=${c.id}" class="chat-item">
        <div class="chat-avatar">${c.avatar}</div>
        <div class="chat-info">
          <div class="chat-name">${escapeHtml(c.name)}</div>
          <div class="chat-preview">${escapeHtml(c.lastMessage)}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
            <div class="chat-time">${c.lastTime}</div>
            ${statusDot}
          </div>
        </div>
        ${unreadBadge}
      </a>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  renderChatList();

  const search = document.getElementById('chatSearch');
  search.addEventListener('input', (e) => {
    renderChatList(e.target.value);
  });

  // Theme toggle
  const toggle = document.querySelector('.theme-toggle');
  toggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });
});

// Admin Chat Detail — load one user's chat
const chats = [
  {
    id: 'u101',
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    avatar: 'RK',
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
    status: 'online',
    messages: [
      { from: 'them', text: 'Sir, bank statement chahiye.', time: '03:50 PM' },
      { from: 'me', text: 'Vikram ji, email par bhej diya hai.', time: '03:55 PM' },
      { from: 'them', text: 'Bank statement chahiye.', time: '04:05 PM' }
    ]
  }
];

function initChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const c = chats.find(x => x.id === id);

  if (!c) {
    document.getElementById('chatUserName').textContent = 'Not found';
    return;
  }

  document.getElementById('chatUserName').textContent = c.name;
  const statusEl = document.getElementById('chatUserStatus');
  statusEl.querySelector('.dot').style.background = c.status === 'online' ? 'var(--yes)' : '#9aa1b2';
  statusEl.querySelector('span:last-child').textContent = c.status.charAt(0).toUpperCase() + c.status.slice(1);

  const container = document.getElementById('chatMessages');
  container.innerHTML = `<div class="msg-date">Today</div>`;

  c.messages.forEach(m => {
    const div = document.createElement('div');
    div.className = `msg ${m.from}`;
    div.innerHTML = `
      <div>${escapeHtml(m.text)}</div>
      <div class="msg-time">${m.time}</div>
    `;
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;

  // Send message
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const div = document.createElement('div');
    div.className = 'msg me';
    div.innerHTML = `<div>${escapeHtml(text)}</div><div class="msg-time">${time}</div>`;
    container.appendChild(div);
    input.value = '';
    container.scrollTop = container.scrollHeight;
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initChat);

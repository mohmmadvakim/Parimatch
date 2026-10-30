// Admin-Parimatch — Sample complaint data (demo)
// Replace this with real Firebase/Firestore data later.
const complaints = [
  {
    id: 'c101',
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    password: '••••••••',
    type: 'Deposit',
    amount: '₹2,500',
    date: 'Today',
    time: '10:15 AM',
    status: 'pending',
    image: null,
    details: {
      userName: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      email: 'rajesh.kumar@example.com',
      setPassword: '••••••••',
      depositAmount: '₹2,500',
      paymentImage: 'Uploaded'
    }
  },
  {
    id: 'c102',
    name: 'Priya Sharma',
    mobile: '+91 87654 32109',
    email: 'priya.s@example.com',
    password: '••••••••',
    type: 'Withdrawal',
    amount: '₹5,000',
    date: 'Today',
    time: '11:30 AM',
    status: 'pending',
    image: null,
    details: {
      userName: 'Priya Sharma',
      mobile: '+91 87654 32109',
      email: 'priya.s@example.com',
      setPassword: '••••••••',
      depositAmount: '₹5,000',
      paymentImage: 'Uploaded'
    }
  },
  {
    id: 'c103',
    name: 'Amit Singh',
    mobile: '+91 76543 21098',
    email: 'amit.s@example.com',
    password: '••••••••',
    type: 'Bonus',
    amount: '₹1,000',
    date: 'Today',
    time: '12:45 PM',
    status: 'resolved',
    image: null,
    details: {
      userName: 'Amit Singh',
      mobile: '+91 76543 21098',
      email: 'amit.s@example.com',
      setPassword: '••••••••',
      depositAmount: '₹1,000',
      paymentImage: 'Not uploaded'
    }
  },
  {
    id: 'c104',
    name: 'Neha Gupta',
    mobile: '+91 65432 10987',
    email: 'neha.g@example.com',
    password: '••••••••',
    type: 'KYC',
    amount: '—',
    date: 'Today',
    time: '02:10 PM',
    status: 'pending',
    image: null,
    details: {
      userName: 'Neha Gupta',
      mobile: '+91 65432 10987',
      email: 'neha.g@example.com',
      setPassword: '••••••••',
      depositAmount: '—',
      paymentImage: 'Not uploaded'
    }
  },
  {
    id: 'c105',
    name: 'Vikram Yadav',
    mobile: '+91 54321 09876',
    email: 'vikram.y@example.com',
    password: '••••••••',
    type: 'Bank Statement',
    amount: '—',
    date: 'Today',
    time: '03:55 PM',
    status: 'pending',
    image: null,
    details: {
      userName: 'Vikram Yadav',
      mobile: '+91 54321 09876',
      email: 'vikram.y@example.com',
      setPassword: '••••••••',
      depositAmount: '—',
      paymentImage: 'Uploaded'
    }
  },
  {
    id: 'c106',
    name: 'Sonal Mehta',
    mobile: '+91 43210 98765',
    email: 'sonal.m@example.com',
    password: '••••••••',
    type: 'Unlock Withdrawal',
    amount: '₹3,000',
    date: 'Today',
    time: '04:20 PM',
    status: 'resolved',
    image: null,
    details: {
      userName: 'Sonal Mehta',
      mobile: '+91 43210 98765',
      email: 'sonal.m@example.com',
      setPassword: '••••••••',
      depositAmount: '₹3,000',
      paymentImage: 'Not uploaded'
    }
  }
];

const typeColors = {
  'Deposit': '#dbeafe',
  'Withdrawal': '#fef3c7',
  'Bonus': '#e0e7ff',
  'KYC': '#fce7f3',
  'Bank Statement': '#f0fdf4',
  'Unlock Withdrawal': '#fff1f2'
};

const typeText = {
  'Deposit': '#1e40af',
  'Withdrawal': '#92400e',
  'Bonus': '#1e3a8a',
  'KYC': '#9c1c1c',
  'Bank Statement': '#14532d',
  'Unlock Withdrawal': '#991b1b'
};

function initHome() {
  const list = document.getElementById('userList');
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statResolved = document.getElementById('stat-resolved');

  const today = complaints.filter(c => c.date === 'Today');
  const pending = today.filter(c => c.status === 'pending').length;
  const resolved = today.filter(c => c.status === 'resolved').length;

  statTotal.textContent = today.length;
  statPending.textContent = pending;
  statResolved.textContent = resolved;

  list.innerHTML = today.map(c => {
    const initials = c.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const bg = typeColors[c.type] || '#f3f4f6';
    const color = typeText[c.type] || '#6b7280';
    const statusDot = c.status === 'pending' ? 'var(--warning)' : 'var(--success)';

    return `
      <a href="complaint-detail.html?id=${c.id}" class="user-card">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="user-name">${escapeHtml(c.name)}</div>
          <div class="user-type">
            <span class="badge" style="background:${bg};color:${color};border-color:${bg}">${escapeHtml(c.type)}</span>
          </div>
          <div class="user-meta">
            <span>📱 ${escapeHtml(c.mobile)}</span>
            <span>•</span>
            <span>🕒 ${escapeHtml(c.time)}</span>
          </div>
        </div>
        <div style="width:10px;height:10px;border-radius:50%;background:${statusDot};flex-shrink:0;"></div>
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
  const page = document.body.dataset.page || 'home';
  if (page === 'home') initHome();
});

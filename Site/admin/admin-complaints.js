// Admin All Complains — sample data (same as Home page)
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
    status: 'pending'
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
    status: 'pending'
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
    status: 'resolved'
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
    status: 'pending'
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
    status: 'pending'
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
    status: 'resolved'
  },
  {
    id: 'c107',
    name: 'Kavita Rao',
    mobile: '+91 32109 87654',
    email: 'kavita.r@example.com',
    password: '••••••••',
    type: 'Deposit',
    amount: '₹1,200',
    date: 'Yesterday',
    time: '05:40 PM',
    status: 'pending'
  },
  {
    id: 'c108',
    name: 'Rohit Verma',
    mobile: '+91 21098 76543',
    email: 'rohit.v@example.com',
    password: '••••••••',
    type: 'Withdrawal',
    amount: '₹4,500',
    date: 'Yesterday',
    time: '06:15 PM',
    status: 'resolved'
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

function renderComplaints(filterType = 'all', search = '') {
  const list = document.getElementById('complaintList');
  const countBadge = document.getElementById('complaintCount');

  const q = search.toLowerCase();
  const filtered = complaints.filter(c => {
    const matchType = filterType === 'all' || c.type === filterType;
    const matchSearch = c.name.toLowerCase().includes(q) ||
                        c.mobile.includes(q) ||
                        c.type.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  countBadge.textContent = filtered.length;

  list.innerHTML = filtered.map(c => {
    const initials = c.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const bg = typeColors[c.type] || '#f3f4f6';
    const color = typeText[c.type] || '#6b7280';
    const statusColor = c.status === 'pending' ? 'var(--warn)' : 'var(--yes)';
    const statusLabel = c.status === 'pending' ? 'Pending' : 'Resolved';

    return `
      <a href="complaint-detail.html?id=${c.id}" class="chat-item" style="padding:14px 16px;">
        <div class="chat-avatar" style="background:linear-gradient(135deg,${color},${color});">${initials}</div>
        <div class="chat-info">
          <div class="chat-name">${escapeHtml(c.name)}</div>
          <div class="chat-preview" style="color:var(--text);font-weight:600;">${escapeHtml(c.type)} · ${escapeHtml(c.amount)}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
            <div class="chat-time" style="font-size:0.75rem;">${escapeHtml(c.date)} · ${escapeHtml(c.time)}</div>
            <span class="badge ${c.status === 'pending' ? 'warning' : 'success'} sm" style="font-size:0.62rem;padding:3px 8px;">${statusLabel}</span>
          </div>
        </div>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--muted);flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
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
  renderComplaints();

  const search = document.getElementById('compSearch');
  const filter = document.getElementById('compFilter');

  search.addEventListener('input', (e) => {
    renderComplaints(filter.value, e.target.value);
  });

  filter.addEventListener('change', (e) => {
    renderComplaints(e.target.value, search.value);
  });

  // Theme toggle
  const toggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  toggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });
});

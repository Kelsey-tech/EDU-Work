// ─── EDU-Work API Client ──────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:5000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
function saveAuth(token, user) {
  localStorage.setItem('edu_token', token);
  localStorage.setItem('edu_user', JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem('edu_token');
}

function getUser() {
  const u = localStorage.getItem('edu_user');
  return u ? JSON.parse(u) : null;
}

function logout() {
  localStorage.removeItem('edu_token');
  localStorage.removeItem('edu_user');
  window.location.href = 'Login.html';
}

function isLoggedIn() {
  return !!getToken();
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
const auth = {
  async register(firstName, lastName, email, password, role) {
    const data = await request('POST', '/auth/register', { firstName, lastName, email, password, role });
    saveAuth(data.token, data.user);
    return data;
  },
  async login(email, password) {
    const data = await request('POST', '/auth/login', { email, password });
    saveAuth(data.token, data.user);
    return data;
  }
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
const jobs = {
  getAll(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/jobs${qs ? '?' + qs : ''}`);
  },
  getMyJobs() {
    return request('GET', '/jobs/company/my-jobs');
  },
  post(jobData) {
    return request('POST', '/jobs', jobData);
  },
  update(jobId, jobData) {
    return request('PUT', `/jobs/${jobId}`, jobData);
  },
  close(jobId) {
    return request('PUT', `/jobs/${jobId}/close`);
  }
};

// ─── Applications ─────────────────────────────────────────────────────────────
const applications = {
  apply(jobId, coverLetter) {
    return request('POST', '/applications', { jobId, coverLetter });
  },
  getMyApplications() {
    return request('GET', '/applications/my-applications');
  },
  getByJob(jobId) {
    return request('GET', `/applications/job/${jobId}`);
  },
  updateStatus(applicationId, status) {
    return request('PUT', `/applications/${applicationId}/status`, { status });
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────
const admin = {
  getDashboard() {
    return request('GET', '/admin/dashboard');
  },
  getUsers() {
    return request('GET', '/users');
  },
  deactivate(userId) {
    return request('PUT', `/admin/users/${userId}/deactivate`);
  },
  activate(userId) {
    return request('PUT', `/admin/users/${userId}/activate`);
  }
};

// ─── Route guard — call on pages that require login ───────────────────────────
function requireAuth(allowedRoles = []) {
  if (!isLoggedIn()) {
    window.location.href = 'Login.html';
    return null;
  }
  const user = getUser();
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    alert('Access denied.');
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

// ─── Update navbar based on login state ──────────────────────────────────────
function updateNav() {
  const user = getUser();
  const navBtns = document.querySelector('.nav-btns');
  if (!navBtns) return;

  if (user) {
    let dashLink = 'index.html';
    if (user.role === 'student') dashLink = 'StudentDashboard.html';
    if (user.role === 'company') dashLink = 'CompanyDashboard.html';
    if (user.role === 'admin') dashLink = 'AdminDashboard.html';

    navBtns.innerHTML = `
      <a href="${dashLink}" class="btn login-btn">Dashboard</a>
      <button onclick="logout()" class="btn getStarted-btn" style="border:none;cursor:pointer;">Logout</button>
    `;
  }
}
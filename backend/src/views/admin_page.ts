export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dorabox Admin Portal - Quản Trị Mạng Xã Hội</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0A0E17;
      --surface: #141C2E;
      --surface-light: #1C273E;
      --gold: #FFC837;
      --blue: #0084FF;
      --red: #FF3B30;
      --text: #F8FAFC;
      --muted: #8A95A5;
      --border: rgba(255, 255, 255, 0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 24px; min-height: 100vh; }
    .container { max-width: 1100px; margin: 0 auto; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo-badge { width: 40px; height: 40px; background: var(--surface); border: 2px solid var(--gold); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    h1 { font-size: 24px; font-weight: 800; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
    .stat-label { font-size: 13px; color: var(--muted); margin-bottom: 6px; }
    .stat-value { font-size: 28px; font-weight: 800; color: var(--gold); }
    .section { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; margin-bottom: 24px; }
    .section-title { font-size: 18px; font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 14px; font-size: 13px; color: var(--muted); border-bottom: 1px solid var(--border); }
    td { padding: 14px; font-size: 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar-mini { width: 34px; height: 34px; border-radius: 50%; background: var(--blue); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: white; }
    .verified-icon { color: var(--blue); margin-left: 4px; font-size: 15px; }
    .btn { padding: 7px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
    .btn-verify { background: rgba(0, 132, 255, 0.15); color: var(--blue); border: 1px solid var(--blue); }
    .btn-unverify { background: rgba(255, 200, 55, 0.15); color: var(--gold); border: 1px solid var(--gold); }
    .btn-delete { background: rgba(255, 59, 48, 0.15); color: var(--red); border: 1px solid var(--red); }
    .btn:hover { opacity: 0.85; transform: scale(0.98); }
    .tag { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
    .tag-pending { background: rgba(255, 200, 55, 0.2); color: var(--gold); }
    .tag-reviewed { background: rgba(16, 185, 129, 0.2); color: #10B981; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">
        <div class="logo-badge">🐱</div>
        <div>
          <h1>Dorabox Admin Portal</h1>
          <p style="font-size: 13px; color: var(--muted);">Quản trị thành viên, cấp tích xanh & kiểm duyệt mạng xã hội</p>
        </div>
      </div>
      <button class="btn btn-verify" onclick="loadAllData()">🔄 Làm mới</button>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Tổng Thành Viên</div>
        <div class="stat-value" id="stat-users">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Thành Viên Tích Xanh</div>
        <div class="stat-value" id="stat-verified" style="color: var(--blue)">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Báo Cáo Chờ Duyệt</div>
        <div class="stat-value" id="stat-reports" style="color: var(--red)">0</div>
      </div>
    </div>

    <!-- 1. Quản lý Thành Viên & Duyệt Tích Xanh -->
    <div class="section">
      <div class="section-title">👥 Quản Lý Thành Viên & Cấp Tích Xanh (Verified Badge)</div>
      <table>
        <thead>
          <tr>
            <th>Thành viên</th>
            <th>Tên tài khoản</th>
            <th>Trạng thái</th>
            <th>Hành động Quản trị</th>
          </tr>
        </thead>
        <tbody id="users-table-body">
          <tr><td colspan="4" style="text-align: center; color: var(--muted);">Đang tải dữ liệu...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 2. Quản lý Báo Cáo Vi Phạm -->
    <div class="section">
      <div class="section-title">🚨 Danh Sách Báo Cáo Vi Phạm (Reports)</div>
      <table>
        <thead>
          <tr>
            <th>Người báo cáo</th>
            <th>Lý do vi phạm</th>
            <th>Loại nội dung</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody id="reports-table-body">
          <tr><td colspan="5" style="text-align: center; color: var(--muted);">Chưa có báo cáo vi phạm nào.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    async function loadAllData() {
      try {
        // Tải danh sách user
        const userRes = await fetch('/api/admin/users').then(r => r.json());
        if (userRes.success) {
          renderUsers(userRes.users || []);
        }

        // Tải danh sách report
        const repRes = await fetch('/api/admin/reports').then(r => r.json());
        if (repRes.success) {
          renderReports(repRes.reports || []);
        }
      } catch (e) {
        console.error(e);
      }
    }

    function renderUsers(users) {
      document.getElementById('stat-users').innerText = users.length;
      document.getElementById('stat-verified').innerText = users.filter(u => u.is_verified).length;

      const tbody = document.getElementById('users-table-body');
      if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--muted);">Chưa có thành viên nào đăng ký.</td></tr>';
        return;
      }

      tbody.innerHTML = users.map(user => {
        const isVerified = user.is_verified;
        const initial = (user.display_name || 'U').charAt(0).toUpperCase();

        return \`<tr>
          <td>
            <div class="user-cell">
              <div class="avatar-mini">\${initial}</div>
              <div>
                <strong>\${user.display_name}</strong>
                \${isVerified ? '<span class="verified-icon">✓</span>' : ''}
              </div>
            </div>
          </td>
          <td style="color: var(--muted);">@\${user.username || 'user'}</td>
          <td>
            \${isVerified 
              ? '<span class="tag" style="background: rgba(0, 132, 255, 0.2); color: var(--blue);">Đã Xác Minh ✓</span>' 
              : '<span class="tag" style="background: rgba(255,255,255,0.06); color: var(--muted);">Chưa Xác Minh</span>'}
          </td>
          <td>
            <button class="btn \${isVerified ? 'btn-unverify' : 'btn-verify'}" onclick="toggleVerify('\${user.id}', \${!isVerified})">
              \${isVerified ? 'Gỡ Tích Xanh' : 'Cấp Tích Xanh ✓'}
            </button>
          </td>
        </tr>\`;
      }).join('');
    }

    function renderReports(reports) {
      const pendingCount = reports.filter(r => r.status === 'pending').length;
      document.getElementById('stat-reports').innerText = pendingCount;

      const tbody = document.getElementById('reports-table-body');
      if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--muted);">Không có báo cáo vi phạm nào.</td></tr>';
        return;
      }

      tbody.innerHTML = reports.map(r => {
        return \`<tr>
          <td>\${r.profiles ? r.profiles.display_name : 'Người dùng'}</td>
          <td style="color: var(--gold); font-weight: 600;">\${r.reason}</td>
          <td>\${r.target_type}</td>
          <td><span class="tag tag-\${r.status}">\${r.status}</span></td>
          <td>
            <button class="btn btn-delete" onclick="deleteViolatingPost('\${r.target_id}')">Xóa Bài Vi Phạm</button>
          </td>
        </tr>\`;
      }).join('');
    }

    async function toggleVerify(userId, newStatus) {
      const res = await fetch(\`/api/admin/users/\${userId}/toggle-verify\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: newStatus })
      }).then(r => r.json());

      if (res.success) {
        loadAllData();
      } else {
        alert('Lỗi: ' + res.error);
      }
    }

    async function deleteViolatingPost(postId) {
      if (!confirm('Bạn có chắc chắn muốn xóa bài viết vi phạm này?')) return;
      const res = await fetch(\`/api/admin/posts/\${postId}\`, { method: 'DELETE' }).then(r => r.json());
      if (res.success) {
        alert('Đã xóa bài viết vi phạm thành công!');
        loadAllData();
      } else {
        alert('Lỗi: ' + res.error);
      }
    }

    // Tự động load dữ liệu khi vào trang
    loadAllData();
  </script>
</body>
</html>`;
}

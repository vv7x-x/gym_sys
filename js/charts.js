export async function createRevenueChart(canvasId, payments) {
  if (!window.Chart || !canvasId) return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = Array(12).fill(0);
  (payments || []).forEach(p => {
    const d = new Date(p.paid_at);
    data[d.getMonth()] += Number(p.amount);
  });

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } }
      }
    }
  });
}

export async function createDoughnutChart(canvasId, labels, data, colors) {
  if (!window.Chart || !canvasId) return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors || ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { size: 11 } } }
      }
    }
  });
}

export async function createBarChart(canvasId, labels, data) {
  if (!window.Chart || !canvasId) return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Value',
        data,
        backgroundColor: 'rgba(59,130,246,0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } }
      }
    }
  });
}

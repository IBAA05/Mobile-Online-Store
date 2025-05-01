document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const contentWrapper = document.querySelector(".content-wrapper");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar-show");
      contentWrapper.classList.toggle("content-wrapper-expanded");
    });
  }

  // Initialize charts
  initCharts();
});

function initCharts() {
  // Sales Chart
  const salesCtx = document.getElementById("salesChart");
  if (salesCtx) {
    const salesChart = new Chart(salesCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Sales",
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Months",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
            title: {
              display: true,
              text: "Revenue",
            },
          },
        },
      },
    });

    // Example of updating the chart dynamically
    setTimeout(() => {
      salesChart.data.datasets[0].data = [
        15000, 20000, 18000, 27000, 24000, 32000,
      ];
      salesChart.update();
    }, 5000);
  }

  // Category Chart
  const categoriesCtx = document.getElementById("categoriesChart");
  console.log(categoriesCtx);
  if (categoriesCtx) {
    const categoriesChart = new Chart(categoriesCtx, {
      type: "doughnut",
      data: {
        labels: ["Smartphones", "Laptops", "Tablets", "Accessories"],
        datasets: [
          {
            data: [35, 25, 20, 20],
            backgroundColor: ["#0ea5e9", "#22c55e", "#a855f7", "#eab308"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `${tooltipItem.label}: ${value}%`;
              },
            },
          },
        },
        cutout: "70%",
      },
    });

    // Example of updating the chart dynamically
    setTimeout(() => {
      categoriesChart.data.datasets[0].data = [40, 20, 25, 15];
      categoriesChart.update();
    }, 5000);
  }
}

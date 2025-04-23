import { Chart } from "@/components/ui/chart";
document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar-show");
    });
  }

  // Initialize charts
  initCharts();
});

function initCharts() {
  // Sales Chart
  const salesCtx = document.getElementById("salesChart");
  if (salesCtx) {
    new Chart(salesCtx, {
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
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
        },
      },
    });
  }

  // Category Chart
  const categoriesCtx = document.getElementById("categoriesChart");
  if (categoriesCtx) {
    new Chart(categoriesCtx, {
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
        },
        cutout: "70%",
      },
    });
  }
}

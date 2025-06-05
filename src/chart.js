import Chart from "chart.js/auto";

// Utility to generate category totals from transaction data
export function renderExpensesChart(transactions) {
  const categoryTotals = {};

  transactions.forEach((tx) => {
    if (tx.type === "expense") {
      categoryTotals[tx.category] =
        (categoryTotals[tx.category] || 0) + parseFloat(tx.amount);
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const ctx = document.getElementById("charts__expenses");

  if (!ctx) return;

  // Destroy existing chart if it exists
  if (ctx.chartInstance) {
    ctx.chartInstance.destroy();
  }

  ctx.chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          borderWidth: 1,
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
    },
  });
}

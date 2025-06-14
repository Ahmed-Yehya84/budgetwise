import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function setupPdfExport(monthFilter) {
  const exportButton = document.getElementById("export-pdf");
  exportButton.textContent = "Download PDF";

  exportButton.addEventListener("click", async () => {
    const doc = new jsPDF();

    // 🏷️ Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("BudgetWise", 105, 15, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(
      `Monthly Report: ${monthFilter.value}`,
      105,
      25,
      null,
      null,
      "center"
    );

    // 📊 Summary
    const income = document.getElementById("total-income").textContent;
    const expenses = document.getElementById("total-expenses").textContent;
    const balance = document.getElementById("balance").textContent;

    doc.setFontSize(12);
    doc.text(`Income: $${income}`, 20, 40);
    doc.text(`Expenses: $${expenses}`, 20, 48);
    doc.text(`Balance: $${balance}`, 20, 56);

    // 🥧 Chart (if exists)
    const chartCanvas = document.getElementById("charts__expenses");
    if (chartCanvas) {
      try {
        const chartImg = await html2canvas(chartCanvas, {
          backgroundColor: null,
          scale: 2,
        });
        const imgData = chartImg.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 130, 35, 65, 65);
      } catch (e) {
        console.warn("Chart capture failed:", e);
      }
    }

    // 📋 Transaction Table
    const rows = document.querySelectorAll("#transaction-list tr");
    let y = 110;
    let totalExpenses = 0;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Transactions", 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.text("Date", 20, y);
    doc.text("Description", 55, y);
    doc.text("Amount", 115, y);
    doc.text("Category", 150, y);
    y += 6;

    doc.setFont("helvetica", "normal");

    rows.forEach((row, index) => {
      const cols = row.querySelectorAll("td");
      if (cols.length === 5) {
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(15, y - 4, 180, 6, "F");
        }

        const amount =
          parseFloat(cols[2].textContent.replace(/[^0-9.-]+/g, "")) || 0;
        totalExpenses += amount;

        doc.text(cols[0].textContent, 20, y);
        doc.text(cols[1].textContent, 55, y);
        doc.text(cols[2].textContent, 115, y);
        doc.text(cols[3].textContent, 150, y);
        y += 6;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }
    });

    // ➕ Total Expenses Summary
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Expenses (Detailed): $${totalExpenses.toFixed(2)}`, 20, y);
    y += 10;

    // 💧 Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Generated by BudgetWise", 105, 290, null, null, "center");

    // 💾 Save
    const fileName = `BudgetWise-${monthFilter.value}.pdf`;
    doc.save(fileName);
  });
}

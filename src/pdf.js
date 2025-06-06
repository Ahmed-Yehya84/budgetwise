// pdf.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function setupPdfExport(monthFilter) {
  const exportButton = document.getElementById("export-csv");

  exportButton.textContent = "Download PDF";

  exportButton.addEventListener("click", async () => {
    const doc = new jsPDF();

    const title = `BudgetWise Monthly Report: ${monthFilter.value}`;
    doc.setFontSize(16);
    doc.text(title, 20, 20);

    const income = document.getElementById("total-income").textContent;
    const expenses = document.getElementById("total-expenses").textContent;
    const balance = document.getElementById("balance").textContent;

    doc.setFontSize(12);
    doc.text(`Income: $${income}`, 20, 30);
    doc.text(`Expenses: $${expenses}`, 20, 38);
    doc.text(`Balance: $${balance}`, 20, 46);

    // Add pie chart (if exists)
    const chartCanvas = document.getElementById("charts__expenses");
    if (chartCanvas) {
      try {
        const chartImg = await html2canvas(chartCanvas);
        const imgData = chartImg.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 130, 20, 60, 60);
      } catch (e) {
        console.warn("Chart capture failed:", e);
      }
    }

    // Transactions Table
    const rows = document.querySelectorAll("#transaction-list tr");
    let y = 90;

    doc.setFontSize(14);
    doc.text("Transactions:", 20, y);
    y += 8;

    doc.setFontSize(10);

    if (rows.length === 0) {
      doc.text("No transactions available for this period.", 20, y);
    } else {
      // Table headers
      doc.setFont(undefined, "bold");
      doc.text("Date        Description           Amount     Category", 20, y);
      doc.setFont(undefined, "normal");
      y += 6;

      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length === 5) {
          const [date, desc, amt, cat] = [
            cols[0].textContent,
            cols[1].textContent,
            cols[2].textContent,
            cols[3].textContent,
          ];

          const line = `${date.padEnd(12)} ${desc
            .padEnd(20)
            .substring(0, 20)} $${amt.padStart(8)} ${cat}`;
          doc.text(line, 20, y);
          y += 6;

          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        }
      });
    }

    doc.save(`BudgetWise-${monthFilter.value}.pdf`);
  });
}

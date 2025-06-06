// src/pdf.js
import html2pdf from "html2pdf.js";
import { showErrorToast } from "./toast.js"; // if you want toast feedback

export function setupPdfExport(monthFilter) {
  const exportBtn = document.getElementById("export-pdf");
  const pdfContent = document.getElementById("pdf-content");

  if (!exportBtn || !pdfContent) return;

  exportBtn.addEventListener("click", () => {
    if (!monthFilter.value) {
      showErrorToast("Please select a month to export.");
      return;
    }

    const opt = {
      margin: 0.5,
      filename: `budgetwise-report-${monthFilter.value}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfContent).save();
  });
}

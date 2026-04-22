// composables/useInvoice.js
// Generate PDF invoice using jsPDF (no backend needed)
// Upload to Cloudinary → permanent URL
// Supports: download + copy URL

import { ref } from "vue";
import { jsPDF } from "jspdf";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function useInvoice() {
  const isGenerating = ref(false);
  const invoiceUrl = ref(null);
  const error = ref(null);

  // ─── Format helpers ──────────────────────────────────────
  const fmt = (n) => Number(n || 0).toLocaleString("km-KH");
  const fix1 = (n) => parseFloat(n || 0).toFixed(1);

  // ─── Generate PDF blob ───────────────────────────────────
  const generatePDFBlob = (record, roomName, tenantName) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210; // A4 width
    const margin = 15;
    const col1 = margin;
    const col2 = 110;
    let y = 0;

    const electricUsage = fix1(record.electric_usage);
    const electricTotal = fmt(record.electric_total);
    const waterUsage = fix1(record.water_usage);
    const waterTotal = fmt(record.water_total);
    const totalCost = fmt(record.total_cost);

    // ── Header bar ──
    doc.setFillColor(13, 110, 253); // Bootstrap primary
    doc.rect(0, 0, W, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("RENTAL HOUSE", margin, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "វិក្កយបត្រប្រើប្រាស់ប្រចាំខែ / Monthly Utility Invoice",
      margin,
      20,
    );
    y = 38;

    // ── Room info ──
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Room:", col1, y);
    doc.setFont("helvetica", "normal");
    doc.text(roomName || "—", col1 + 20, y);

    doc.setFont("helvetica", "bold");
    doc.text("Tenant:", col2, y);
    doc.setFont("helvetica", "normal");
    doc.text(tenantName || "—", col2 + 22, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Month:", col1, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${record.month} / Day ${record.day}`, col1 + 20, y);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", col2, y);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("en-GB"), col2 + 16, y);
    y += 6;

    // divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, W - margin, y);
    y += 8;

    // ── Section: Electric ──
    doc.setFillColor(255, 243, 205); // light yellow
    doc.roundedRect(margin, y, W - margin * 2, 7, 2, 2, "F");
    doc.setTextColor(130, 90, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("⚡  ELECTRICITY / អគ្គិសនី", margin + 3, y + 5);
    y += 11;

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const eRows = [
      ["Previous reading (kWh)", fix1(record.old_electric)],
      ["New reading (kWh)", fix1(record.new_electric)],
      ["Usage (kWh)", `${electricUsage} kWh`],
      ["Unit price (KHR/kWh)", `${fmt(record.electric_price)} ៛`],
    ];
    eRows.forEach(([label, val]) => {
      doc.text(label, col1 + 4, y);
      doc.text(val, W - margin - 2, y, { align: "right" });
      y += 6.5;
    });

    // Electric subtotal
    doc.setFillColor(255, 193, 7);
    doc.rect(margin, y - 1, W - margin * 2, 7, "F");
    doc.setTextColor(80, 50, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Electric Total", col1 + 4, y + 5);
    doc.text(`${electricTotal} ៛`, W - margin - 2, y + 5, { align: "right" });
    y += 13;

    // ── Section: Water ──
    doc.setFillColor(207, 236, 255);
    doc.roundedRect(margin, y, W - margin * 2, 7, 2, 2, "F");
    doc.setTextColor(0, 80, 130);
    doc.setFont("helvetica", "bold");
    doc.text("💧  WATER / ទឹក", margin + 3, y + 5);
    y += 11;

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");

    const wRows = [
      ["Previous reading (m³)", fix1(record.old_water)],
      ["New reading (m³)", fix1(record.new_water)],
      ["Usage (m³)", `${waterUsage} m³`],
      ["Unit price (KHR/m³)", `${fmt(record.water_price)} ៛`],
    ];
    wRows.forEach(([label, val]) => {
      doc.text(label, col1 + 4, y);
      doc.text(val, W - margin - 2, y, { align: "right" });
      y += 6.5;
    });

    // Water subtotal
    doc.setFillColor(13, 202, 240);
    doc.rect(margin, y - 1, W - margin * 2, 7, "F");
    doc.setTextColor(0, 60, 90);
    doc.setFont("helvetica", "bold");
    doc.text("Water Total", col1 + 4, y + 5);
    doc.text(`${waterTotal} ៛`, W - margin - 2, y + 5, { align: "right" });
    y += 16;

    // ── Grand Total ──
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(margin, y, W - margin * 2, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(
      "TOTAL AMOUNT DUE / ចំនួនទឹកប្រាក់សរុបត្រូវបង់",
      margin + 4,
      y + 6,
    );
    doc.setFontSize(14);
    doc.text(`${totalCost} ៛`, W - margin - 3, y + 10, { align: "right" });
    y += 22;

    // ── Footer ──
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, W - margin, y);
    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on ${new Date().toLocaleString("en-GB")} — Rental House Management System`,
      W / 2,
      y,
      { align: "center" },
    );

    return doc.output("blob");
  };

  // ─── Main: generate + download ───────────────────────────
  // Any user on any device can download — PDF is generated fresh
  // from record data each time. No storage needed.
  const generateInvoice = async ({ record, roomName, tenantName }) => {
    isGenerating.value = true;
    error.value = null;

    try {
      // 1. Build PDF blob
      const blob = generatePDFBlob(record, roomName, tenantName);
      const filename =
        `invoice_${roomName}_${record.month}_day${record.day}.pdf`.replace(
          /\s+/g,
          "_",
        );

      // 2. Download directly from blob URL
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

      return true;
    } catch (e) {
      error.value = e.message || "មិនអាចបង្កើតវិក្កយបត្របាន។";
      throw e;
    } finally {
      isGenerating.value = false;
    }
  };

  return { generateInvoice, isGenerating, error };
}

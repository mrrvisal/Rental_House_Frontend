// composables/useInvoice.js
// Strategy: render Khmer HTML → html2canvas → jsPDF
// Supports full Khmer text via browser font rendering
// npm install jspdf html2canvas

import { ref } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function useInvoice() {
  const isGenerating = ref(false);
  const error = ref(null);

  const fmt = (n) => Number(n || 0).toLocaleString("km-KH");
  const fix1 = (n) => parseFloat(n || 0).toFixed(1);

  // ─── Build hidden HTML invoice element ──────────────────
  const buildInvoiceHTML = (
    record,
    roomName,
    tenantName,
    payDate,
    expiredDate,
  ) => {
    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];
    const electricUsage = fix1(record.electric_usage);
    const totalCost = fmt(record.total_cost);
    const now = new Date();
    const electricTotalRaw = Number(record.electric_total || 0);
    const electricTotal = fmt(electricTotalRaw);
    const day = now.getDate();
    const month = khmerMonths[now.getMonth()];
    const year = now.getFullYear();
    const generatedDate = `${day} ${month} ${year}`;

    const formatKhmerDate = (input) => {
      if (!input) return "—";
      let date;
      if (input instanceof Date) {
        date = input;
      } else {
        date = new Date(input);
      }
      if (isNaN(date.getTime())) return "—";
      const day = date.getDate();
      const month = khmerMonths[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    };

    const payDateKh = formatKhmerDate(payDate);
    const expiredDateKh = formatKhmerDate(expiredDate);

    const el = document.createElement("div");
    el.id = "__invoice_render__";
    // FIX 3: added overflow: hidden to prevent runaway child elements adding extra height
    el.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 794px;
      overflow: hidden;
      background: #ffffff;
      font-family: 'Noto Sans Khmer', 'Khmer OS', sans-serif;
      color: #1a1a1a;
    `;

    el.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600;700&display=swap" rel="stylesheet">
      <div>

        <!-- Header -->
        <div style="background:#0d6efd;padding:24px 32px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;">RENTAL HOUSE</div>
            <div style="font-size:13px;color:#cfe2ff;margin-top:4px;">វិក្កយបត្រប្រើប្រាស់ប្រចាំខែ</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;color:#cfe2ff;">ថ្ងៃបង្កើត</div>
            <div style="font-size:13px;color:#fff;font-weight:600;">${generatedDate}</div>
          </div>
        </div>

        <!-- Info Bar -->
        <div style="background:#f8f9ff;padding:16px 32px;border-bottom:2px solid #e2e8f0;display:flex;gap:0;flex-wrap:wrap;">

          <div style="flex:1;min-width:140px;padding:8px 16px 8px 0;border-right:1px solid #dee2e6;">
            <div style="font-size:10px;color:#6b7280;margin-bottom:3px;">បន្ទប់</div>
            <div style="font-size:18px;font-weight:700;color:#0d6efd;">${roomName || "—"}</div>
          </div>

          <div style="flex:1;min-width:160px;padding:8px 16px;border-right:1px solid #dee2e6;">
            <div style="font-size:10px;color:#6b7280;margin-bottom:3px;">អ្នកជួល</div>
            <div style="font-size:15px;font-weight:600;color:#1a1a1a;">${tenantName || "—"}</div>
          </div>

          <div style="flex:1;min-width:140px;padding:8px 16px;border-right:1px solid #dee2e6;">
            <div style="font-size:10px;color:#6b7280;margin-bottom:3px;">ខែប្រើប្រាស់</div>
            <div style="font-size:14px;font-weight:600;color:#1a1a1a;">${record.month} / ថ្ងៃ ${record.day}</div>
          </div>

          <div style="flex:1;min-width:140px;padding:8px 16px;border-right:1px solid #dee2e6;">
            <div style="font-size:10px;color:#dc3545;margin-bottom:3px;">កាលបរិច្ឆេទបង់ប្រាក់</div>
            <div style="font-size:14px;font-weight:700;color:#dc3545;">${payDateKh || "—"}</div>
          </div>

          <div style="flex:1;min-width:140px;padding:8px 0 8px 16px;">
            <div style="font-size:10px;color:#e67e22;margin-bottom:3px;">កាលបរិច្ឆេទផុតកំណត់</div>
            <div style="font-size:14px;font-weight:700;color:#e67e22;">${expiredDateKh || "—"}</div>
          </div>

        </div>

        <!-- Body -->
        <div style="padding:24px 32px;">

          <!-- Electricity -->
          ${
            electricTotalRaw > 0
              ? `
          <div style="margin-bottom:20px;">
            <div style="background:#fff8e1;border-left:4px solid #ffc107;padding:9px 14px;border-radius:0 6px 6px 0;font-size:13px;font-weight:700;color:#856404;margin-bottom:6px;">
              ⚡ អគ្គិសនី (Electricity)
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr style="background:#f9fafb;">
                <td style="padding:7px 12px;color:#6b7280;">លេខចាស់ (kWh)</td>
                <td style="padding:7px 12px;text-align:right;font-weight:600;">${fix1(record.old_electric)} kWh</td>
              </tr>
              <tr>
                <td style="padding:7px 12px;color:#6b7280;">លេខថ្មី (kWh)</td>
                <td style="padding:7px 12px;text-align:right;font-weight:600;">${fix1(record.new_electric)} kWh</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:7px 12px;color:#6b7280;">ការប្រើប្រាស់</td>
                <td style="padding:7px 12px;text-align:right;font-weight:700;color:#d97706;">${electricUsage} kWh</td>
              </tr>
              <tr>
                <td style="padding:7px 12px;color:#6b7280;">តម្លៃក្នុង kWh</td>
                <td style="padding:7px 12px;text-align:right;">${fmt(record.electric_price)} ៛</td>
              </tr>
              <tr style="background:#fff3cd;">
                <td style="padding:9px 12px;font-weight:700;color:#856404;">សរុបអគ្គិសនី</td>
                <td style="padding:9px 12px;text-align:right;font-weight:700;font-size:14px;color:#856404;">${electricTotal} ៛</td>
              </tr>
            </table>
          </div>
          `
              : ""
          }

          <!-- QR Code -->
          <div style="display:flex;justify-content:center;margin-bottom:20px;">
            <div style="display:inline-flex;flex-direction:column;align-items:center;gap:10px;">
              <div style="background:#fff;border:10px solid #000;border-radius:28px;padding:12px;display:flex;align-items:center;justify-content:center;width:250px;height:250px;box-sizing:border-box;">
                <img
                  src="https://res.cloudinary.com/daji2ml3y/image/upload/v1777024317/IMG_2233-Picsart-BackgroundRemover_1_daakhj.png"
                  style="width:210px;height:210px;" alt="" crossorigin="anonymous" />
              </div>
              <div style="display:flex;align-items:center;background:#000;border-radius:999px;padding:6px 18px 6px 6px;gap:10px;width:250px;box-sizing:border-box;">
                <div style="width:38px;height:38px;border-radius:50%;border:3px solid #fff;background:#000;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="1" width="10" height="18" rx="2" stroke="white" stroke-width="1.5" fill="none" />
                    <circle cx="10" cy="16" r="1" fill="white" />
                    <rect x="8" y="3" width="4" height="1" rx="0.5" fill="white" />
                  </svg>
                </div>
                <span style="font-size:14px;font-weight:500;color:#fff;letter-spacing:0.04em;flex:1;text-align:center;">សូមទូទាត់នៅទីនេះ</span>
              </div>
            </div>
          </div>

          <!-- Grand Total -->
          <div style="background:#dc3545;border-radius:8px;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;">
            <div style="color:#fff;font-size:15px;font-weight:700;">ចំនួនទឹកប្រាក់សរុបត្រូវបង់</div>
            <div style="color:#fff;font-size:22px;font-weight:700;">${totalCost} ៛</div>
          </div>

          <!-- Footer note -->
          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af;">
            សូមបង់ប្រាក់មុន: <strong style="color:#dc3545;">${expiredDateKh || "—"}</strong>
            &nbsp;|&nbsp; Rental House Management System &nbsp;|&nbsp; ${generatedDate}
          </div>

        </div>
      </div>
    `;

    return el;
  };

  // ─── Main: render HTML → canvas → PDF → download ────────
  const generateInvoice = async ({
    record,
    roomName,
    tenantName,
    payDate,
    expiredDate,
  }) => {
    isGenerating.value = true;
    error.value = null;

    const el = buildInvoiceHTML(
      record,
      roomName,
      tenantName,
      payDate,
      expiredDate,
    );
    document.body.appendChild(el);

    // Wait for Noto Sans Khmer font to load
    await document.fonts.ready;
    // FIX 4: reduced from 1200ms to 600ms — enough for Google Fonts to load
    await new Promise((r) => setTimeout(r, 600));

    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];
    const recordMonthName = khmerMonths[record.month - 1];

    try {
      // FIX 1: scale reduced from 2 → 1.25 — cuts canvas pixel count ~75%, much smaller PDF
      const canvas = await html2canvas(el, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      // FIX 2: clamp to one A4 page height, use "FAST" compression
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;
      const finalH = Math.min(imgH, pdfH);
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, finalH, undefined, "FAST");

      const filename =
        `វិក្កយបត្រ_${roomName}_${recordMonthName}_ថ្ងៃ${record.day}.pdf`.replace(
          /\s+/g,
          "_",
        );

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // revoke URL after short delay to free memory
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      return true;
    } catch (e) {
      error.value = e.message || "មិនអាចបង្កើតវិក្កយបត្របាន។";
      throw e;
    } finally {
      if (document.body.contains(el)) document.body.removeChild(el);
      isGenerating.value = false;
    }
  };

  return { generateInvoice, isGenerating, error };
}

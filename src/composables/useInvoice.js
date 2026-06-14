// composables/useInvoice.js
// Strategy: render Khmer HTML → html2canvas → jsPDF (always 1 page)
// npm install jspdf html2canvas

import { ref } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function useInvoice() {
  const isGenerating = ref(false);
  const error = ref(null);

  const fmt = (n) => Number(n || 0).toLocaleString("km-KH");
  const fix1 = (n) => parseFloat(n || 0).toFixed(1);

  const buildInvoiceHTML = (
    record,
    roomName,
    tenantName,
    payDate,
    expiredDate,
    oldElectricImageUrl,
    electricImageUrl,
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
    const electricTotalRaw = Number(record.electric_total || 0);
    const electricTotal = fmt(Math.ceil(electricTotalRaw / 100) * 100);
    const now = new Date();
    const generatedDate = `${now.getDate()} ${khmerMonths[now.getMonth()]} ${now.getFullYear()}`;

    const formatKhmerDate = (input) => {
      if (!input) return "—";
      const d = input instanceof Date ? input : new Date(input);
      if (isNaN(d.getTime())) return "—";
      return `${d.getDate()} ${khmerMonths[d.getMonth()]} ${d.getFullYear()}`;
    };

    const payDateKh = formatKhmerDate(payDate);
    const expiredDateKh = formatKhmerDate(expiredDate);

    // Inject font into <head> once so it doesn't create a node inside the render el
    if (!document.getElementById("__noto_khmer_font__")) {
      const link = document.createElement("link");
      link.id = "__noto_khmer_font__";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }

    const el = document.createElement("div");
    el.id = "__invoice_render__";
    // FIXED: Use absolute positioning instead of fixed to avoid spacing issues
    el.style.cssText = `
      position: absolute;
      left: 0;
      top: -9999px;
      width: 794px;
      display: block;
      background: #ffffff;
      font-family: 'Noto Sans Khmer', 'Khmer OS', sans-serif;
      color: #1a1a1a;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    `;

    // FIXED: Remove all whitespace at beginning of HTML string
    el.innerHTML = `<div style="max-width:794px;margin:0;padding:0;background:white;box-sizing:border-box;">
        <!-- Header -->
        <div style="background:#1e3c72;padding:16px 28px;border-bottom:4px solid #ffc107;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:22px;font-weight:700;color:white;letter-spacing:2px;">🏠 RENTAL HOUSE</div>
              <div style="font-size:12px;color:#cfe2ff;margin-top:3px;">វិក្កយបត្រប្រើប្រាស់ប្រចាំខែ</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px;color:#cfe2ff;">ថ្ងៃបង្កើត</div>
              <div style="font-size:14px;color:white;font-weight:600;margin-top:2px;">${generatedDate}</div>
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div style="padding:12px 28px;background:#f8f9fa;">
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">
            <div style="background:white;padding:10px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);">
              <div style="font-size:9px;color:#6c757d;margin-bottom:4px;">📌 បន្ទប់</div>
              <div style="font-size:15px;font-weight:700;color:#1e3c72;">${roomName || "—"}</div>
            </div>
            <div style="background:white;padding:10px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);">
              <div style="font-size:9px;color:#6c757d;margin-bottom:4px;">👤 អ្នកជួល</div>
              <div style="font-size:12px;font-weight:600;color:#2c3e50;">${tenantName || "—"}</div>
            </div>
            <div style="background:white;padding:10px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);">
              <div style="font-size:9px;color:#6c757d;margin-bottom:4px;">📅 ខែប្រើប្រាស់</div>
              <div style="font-size:12px;font-weight:600;color:#2c3e50;">${record.month} - ថ្ងៃ ${record.day}</div>
            </div>
            <div style="background:#fff5f5;padding:10px;border-radius:8px;border-left:3px solid #dc3545;">
              <div style="font-size:9px;color:#dc3545;margin-bottom:4px;">💰 ថ្ងៃបង់ប្រាក់</div>
              <div style="font-size:12px;font-weight:700;color:#dc3545;">${payDateKh || "—"}</div>
            </div>
            <div style="background:#fff8f0;padding:10px;border-radius:8px;border-left:3px solid #fd7e14;">
              <div style="font-size:9px;color:#fd7e14;margin-bottom:4px;">⚠️ ថ្ងៃផុតកំណត់</div>
              <div style="font-size:12px;font-weight:700;color:#fd7e14;">${expiredDateKh || "—"}</div>
            </div>
          </div>
        </div>

        <!-- Meter Images -->
        <div style="padding:14px 28px;background:white;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div style="text-align:center;background:#f8f9fa;padding:10px;border-radius:10px;border:1px solid #e9ecef;">
              <div style="font-size:11px;color:#6c757d;margin-bottom:6px;">📸 ម៉ែត្រចាស់</div>
              <img src="${oldElectricImageUrl}" style="width:200px;height:200px;object-fit:contain;border-radius:8px;" alt="Old meter" crossorigin="anonymous" />
            </div>
            <div style="text-align:center;background:#f8f9fa;padding:10px;border-radius:10px;border:1px solid #e9ecef;">
              <div style="font-size:11px;color:#6c757d;margin-bottom:6px;">📸 ម៉ែត្រថ្មី</div>
              <img src="${electricImageUrl}" style="width:200px;height:200px;object-fit:contain;border-radius:8px;" alt="New meter" crossorigin="anonymous" />
            </div>
          </div>
        </div>

        ${
          electricTotalRaw > 0
            ? `
        <!-- Electricity Details -->
        <div style="padding:0 28px;">
          <div style="background:#fffbea;border:1px solid #fde68a;border-radius:10px;padding:12px;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid #ffc107;">
              <span style="font-size:15px;">⚡</span>
              <span style="font-size:13px;font-weight:700;color:#856404;">ព័ត៌មានលម្អិតអគ្គិសនី</span>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:12px;">
              <tr style="border-bottom:1px solid #e9ecef;">
                <td style="padding:7px 0;color:#495057;">លេខចាស់</td>
                <td style="padding:7px 0;text-align:right;font-weight:600;">${fix1(record.old_electric)} kWh</td>
              </tr>
              <tr style="border-bottom:1px solid #e9ecef;">
                <td style="padding:7px 0;color:#495057;">លេខថ្មី</td>
                <td style="padding:7px 0;text-align:right;font-weight:600;">${fix1(record.new_electric)} kWh</td>
              </tr>
              <tr style="border-bottom:1px solid #e9ecef;">
                <td style="padding:7px 0;color:#495057;">ការប្រើប្រាស់សរុប</td>
                <td style="padding:7px 0;text-align:right;font-weight:700;color:#d97706;">${electricUsage} kWh</td>
              </tr>
              <tr>
                <td style="padding:7px 0;color:#495057;">តម្លៃក្នុងមួយឯកតា</td>
                <td style="padding:7px 0;text-align:right;">${fmt(record.electric_price)} ៛/kWh</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Total -->
        <div style="padding:0 28px 12px;">
          <div style="background:#dc3545;border-radius:10px;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="color:rgba(255,255,255,.9);font-size:11px;margin-bottom:2px;">ចំនួនទឹកប្រាក់សរុបត្រូវបង់</div>
              <div style="color:white;font-size:11px;font-weight:500;">គិតជារៀល (KHR)</div>
            </div>
            <div style="color:white;font-size:22px;font-weight:800;">${electricTotal} ៛</div>
          </div>
        </div>
        `
            : ""
        }

        <!-- QR Code -->
        <div style="padding:12px 28px;background:#f8f9fa;text-align:center;">
          <div style="display:inline-block;background:#28a745;padding:4px 16px;border-radius:20px;margin-bottom:10px;">
            <span style="color:white;font-size:12px;font-weight:600;">📱 ទូទាត់តាម QR Code</span>
          </div>
          <div style="display:flex;justify-content:center;">
            <div style="background:white;padding:10px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.1);">
              <img src="https://res.cloudinary.com/daji2ml3y/image/upload/v1777024317/IMG_2233-Picsart-BackgroundRemover_1_daakhj.png"
                   style="width:200px;object-fit:contain;" alt="QR Code" crossorigin="anonymous" />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:10px 28px;background:#2c3e50;border-top:3px solid #ffc107;text-align:center;">
          <div style="color:white;font-size:11px;line-height:1.6;">
            ⚠️ សូមបង់ប្រាក់មុនថ្ងៃ <span style="color:#ffc107;font-weight:700;">${expiredDateKh || "—"}</span>
          </div>
          <div style="color:#94a3b8;font-size:10px;margin-top:2px;">
            Rental House Management System | © ${new Date().getFullYear()} | បង្កើតនៅថ្ងៃ ${generatedDate}
          </div>
        </div>
      </div>`;

    return el;
  };

  // ─── Main: always fit everything into 1 PDF page ────────
  const generateInvoice = async ({
    record,
    roomName,
    tenantName,
    payDate,
    expiredDate,
    oldElectricImageUrl,
    electricImageUrl,
  }) => {
    isGenerating.value = true;
    error.value = null;

    const el = buildInvoiceHTML(
      record,
      roomName,
      tenantName,
      payDate,
      expiredDate,
      oldElectricImageUrl,
      electricImageUrl,
    );
    document.body.appendChild(el);

    // Wait for fonts and images to load
    await document.fonts.ready;

    // Wait for images to load properly
    const images = el.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          }),
      ),
    );

    await new Promise((r) => setTimeout(r, 300));

    try {
      // Get exact dimensions
      const targetWidth = 794;
      const contentHeight = el.scrollHeight;

      // FIXED: Enhanced html2canvas options for better rendering
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: targetWidth,
        width: targetWidth,
        height: contentHeight,
        onclone: (clonedDoc, element) => {
          // Remove all margins and paddings from body in cloned document
          if (clonedDoc && clonedDoc.body) {
            clonedDoc.body.style.margin = "0";
            clonedDoc.body.style.padding = "0";
            clonedDoc.body.style.background = "#ffffff";
            clonedDoc.body.style.lineHeight = "0";
          }

          // Ensure the cloned element has no margins
          if (element) {
            element.style.margin = "0";
            element.style.padding = "0";
            element.style.top = "0";
            element.style.left = "0";
          }

          // Handle images in cloned document
          element.querySelectorAll("img").forEach((img) => {
            if (img.complete && img.naturalHeight === 0) {
              img.style.display = "none";
            }
          });
        },
      });

      // A4 dimensions in mm
      const pageW = 210;
      const pageH = 297;

      // Calculate image dimensions to fit perfectly
      let imgW = pageW;
      let imgH = (canvas.height / canvas.width) * pageW;

      // If still taller than one page, scale down to fit height
      if (imgH > pageH) {
        imgH = pageH;
        imgW = (canvas.width / canvas.height) * pageH;
      }

      // Center horizontally & vertically on the page
      const xOffset = 0;
      const yOffset = 0;

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      });

      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        xOffset,
        yOffset,
        imgW,
        imgH,
        undefined,
        "FAST",
      );

      const filename =
        `វិក្កយបត្រភ្លើង_${roomName}.pdf`.replace(
          /\s+/g,
          "_",
        );
      pdf.save(filename);
      return true;
    } catch (e) {
      error.value = e.message || "Failed to generate invoice";
      console.error("Invoice generation error:", e);
      throw e;
    } finally {
      if (document.body.contains(el)) document.body.removeChild(el);
      isGenerating.value = false;
    }
  };

  return { generateInvoice, isGenerating, error };
}

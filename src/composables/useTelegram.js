import { ref } from "vue";

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const KHMER_MONTHS = [
  "",
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

const toKhmerDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${KHMER_MONTHS[month]} ${year}`;
};

export function useTelegram() {
  const isSending = ref(false);
  const telegramError = ref(null);

  const formatKHR = (n) => Number(n || 0).toLocaleString("km-KH");

  const sendInvoice = async ({
    record,
    roomName,
    tenantName,
    payDate,
    expiredDate,
  }) => {
    isSending.value = true;
    telegramError.value = null;

    try {
      const usage = parseFloat(record.electric_usage).toFixed(1);
      const oldMeter = parseFloat(record.old_electric).toFixed(1);
      const newMeter = parseFloat(record.new_electric).toFixed(1);
      const price = formatKHR(record.electric_price);
      const elecTotal = formatKHR(record.electric_total);
      const total = formatKHR(record.total_cost);
      const period = `${record.month}/${record.day}`;

      const khmerPayDate = toKhmerDate(payDate);
      const khmerExpiredDate = toKhmerDate(expiredDate);

      const text = [
        `🏠 *វិក្កយបត្រជួលបន្ទប់*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `🏷 បន្ទប់: *${roomName}*`,
        `👤 អ្នកជួល: *${tenantName}*`,
        `📅 រយៈពេល: *${period}*`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━`,
        `⚡ *អគ្គិសនី*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `📟 លេខចាស់:      \`${oldMeter} kWh\``,
        `📟 លេខថ្មី:       \`${newMeter} kWh\``,
        `🔋 ការប្រើប្រាស់: \`${usage} kWh\``,
        `💵 តម្លៃ/kWh:    \`${price} ៛\``,
        ``,
        `━━━━━━━━━━━━━━━━━━━━`,
        `💰 *ចំនួនទឹកប្រាក់សរុបត្រូវបង់: ${total} ៛*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        ``,
        khmerPayDate ? `📆 *កាលបរិច្ឆេទបង់ប្រាក់:*\n    ${khmerPayDate}` : null,
        khmerExpiredDate
          ? `⏰ *កាលបរិច្ឆេទផុតកំណត់:*\n    ${khmerExpiredDate}`
          : null,
        khmerPayDate || khmerExpiredDate ? `━━━━━━━━━━━━━━━━━━━━` : null,
      ]
        .filter((line) => line !== null)
        .join("\n");

      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: "Markdown",
          }),
        },
      );

      const data = await res.json();
      if (!data.ok) {
        telegramError.value = data.description || "Telegram error";
        throw new Error(telegramError.value);
      }
    } finally {
      isSending.value = false;
    }
  };

  return { sendInvoice, isSending, telegramError };
}

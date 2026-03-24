const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// إعدادات أساسية
app.use(cors());
app.use(express.json()); // ضروري جداً لاستلام إحداثيات الموقع

const IMGBB_API_KEY = '24118bf00d13a7df34bc758cf7007219';

// إعداد Multer (للملفات بالذاكرة)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- المسارات (Endpoints) ---

// 1. استلام الموقع
app.post("/location", (req, res) => {
    const { lat, lon } = req.body;
    console.log(`📍 موقع جديد وصل: Lat: ${lat}, Lon: ${lon}`);
    res.status(200).send({ message: "Location received" });
});

// 2. استلام الصورة ورفعها لـ ImgBB
app.post("/image", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No image provided");

        console.log("📸 جاري معالجة الصورة ورفعها لـ ImgBB...");

        const base64Image = req.file.buffer.toString('base64');
        const formData = new URLSearchParams();
        formData.append('image', base64Image);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            console.log("✅ تم الرفع بنجاح: ", data.data.url);
            res.status(200).send({ imageUrl: data.data.url });
        } else {
            console.error("❌ فشل الرفع لموقع ImgBB:", data);
            res.status(500).send("ImgBB Upload Failed");
        }
    } catch (error) {
        console.error("❌ خطأ داخلي بالسيرفر:", error);
        res.status(500).send("Internal Server Error");
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر شغال على البورت ${PORT}`);
    console.log(`🔗 مسار الموقع: /location`);
    console.log(`🔗 مسار الصورة: /image`);
});
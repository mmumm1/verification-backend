const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios'); // مكتبة للإرسال
const FormData = require('form-data'); // مكتبة لتجهيز الملفات

const app = express();
app.use(cors());
app.use(express.json());

const IMGBB_API_KEY = '24118bf00d13a7df34bc758cf7007219';

const upload = multer({ storage: multer.memoryStorage() });

// مسار الموقع
app.post("/location", (req, res) => {
    console.log("📍 Location:", req.body);
    res.sendStatus(200);
});

// مسار الصورة (تعديل جذري هنا)
app.post("/image", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");

        console.log("📸 جاري الرفع لـ ImgBB بطريقة FormData...");

        // تجهيز الملف للإرسال
        const form = new FormData();
        form.append('image', req.file.buffer, {
            filename: 'photo.png',
            contentType: req.file.mimetype
        });

        // إرسال الطلب لـ ImgBB باستخدام axios
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, form, {
            headers: { ...form.getHeaders() }
        });

        if (response.data.success) {
            const finalUrl = response.data.data.url; // الرابط المباشر
            console.log("✅ تم الرفع بنجاح! الرابط:", finalUrl);
            res.status(200).send({ imageUrl: finalUrl });
        } else {
            res.status(500).send("ImgBB Error");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json()); 

// مفتاح الـ API الخاص بـ ImgBB (خلي المفتاح اللي نسخته هنا)
const IMGBB_API_KEY = '24118bf00d13a7df34bc758cf7007219';

// إعداد Multer لاستقبال الملفات بالذاكرة المؤقتة (حد أقصى 5 ميجا)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

app.post("/image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("لم يتم إرسال أي صورة!");
    }

    // موقع ImgBB يقبل الصورة بصيغة Base64، فراح نحول الـ Buffer مال Multer إلى Base64
    // لا تقلق، هذا التحويل آمن وما يكرش السيرفر لأننا حددنا الحجم بـ 5 ميجا كحد أقصى
    const base64Image = req.file.buffer.toString('base64');

    // تجهيز البيانات لإرسالها لـ ImgBB
    const formData = new URLSearchParams();
    formData.append('image', base64Image);

    // إرسال الصورة إلى سيرفرات ImgBB باستخدام fetch (موجودة برمجياً داخل Node.js)
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    // التحقق من نجاح الرفع
    if (data.success) {
      res.status(200).send({ 
        message: "تم رفع الصورة بنجاح!", 
        imageUrl: data.data.url // هذا هو الرابط المباشر للصورة!
      });
    } else {
      console.error("ImgBB Error:", data);
      res.status(500).send("حدث خطأ في موقع رفع الصور");
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("خطأ داخلي في السيرفر");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 取得當前檔案的目錄（解決 ES Module 中的 __dirname 問題）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());


// 設定圖片儲存路徑
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'public/uploads');
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    // 保留原始檔名
    cb(null, file.originalname);
    // cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 提供靜態資源（讓前端可以讀取圖片）
// 提供靜態資源（讓前端可以讀取圖片）
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// app.use('/uploads', express.static('public/uploads'));


app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '沒有選擇圖片' });
  }
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ message: '圖片上傳成功', imageUrl, filename: req.file.filename });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


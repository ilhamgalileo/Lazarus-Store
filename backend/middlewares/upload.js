import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.toLowerCase().replace(/\s+/g, '-')}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid image type'), false)
  }
};

export const uploadImages = multer({ storage, fileFilter }).array('images', 5);

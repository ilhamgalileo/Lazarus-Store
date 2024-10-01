const path = require('path');
const express = require('express');
const multer = require('multer');
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
const router = express.Router();
const fs = require('fs').promises
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (filetypes.test(extname) && mimetypes.test(mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Images only"), false);
    }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

router.post('/', async (req, res) => {
    uploadSingleImage(req, res, async (err) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else if (req.file) {
        try {
          const imageBuffer = await fs.readFile(req.file.path);
          const dataUrl = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
          res.status(200).send({
            message: "Uploaded successfully",
            image: dataUrl,
          });
        } catch (error) {
          console.error('Error reading file:', error);
          res.status(500).send({ message: "Error processing uploaded file" });
        }
      } else {
        res.status(400).send({ message: "No image file provided" });
      }
    });
});

module.exports = router;
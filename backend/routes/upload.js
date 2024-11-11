import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },

  filename: (req, file, cb) => {
    const originalName = file.originalname.toLowerCase().replace(/\s+/g, '-'); // Mengubah nama file menjadi lowercase dan mengganti spasi dengan tanda hubung
    cb(null, originalName)
  }
})

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/

  const extname = path.extname(file.originalname).toLowerCase()
  const mimetype = file.mimetype

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Images only"), false);
  }
}

const upload = multer({ storage, fileFilter })
const uploadImages = upload.array("images", 5)

router.post("/", (req, res) => {
  uploadImages(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (!req.files || req.files.length === 0) {
      res.status(400).send({ message: "No image file provided" });
    } else {
      const filePaths = req.files.map(file => `/uploads/${file.filename}`.replace(/\\/g, '/'));      
      res.status(200).send({
        message: "Image uploaded successfully",
        images: filePaths,
      })
    }
  })
})

export default router
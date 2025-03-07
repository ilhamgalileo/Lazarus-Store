import path from "path";
import express from "express";
import multer from "multer";
import { update, deleteImage } from "../controllers/product.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const originalName = file.originalname.toLowerCase().replace(/\s+/g, '-')
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileName = `${uniqueSuffix}-${originalName}`
    cb(null, fileName);
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

const upload = multer({ storage, fileFilter })
const uploadImages = upload.array("images", 5)


router.put("/:id", uploadImages, update);

router.delete("/delete-image", deleteImage);

router.post("/", (req, res) => {
  uploadImages(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (!req.files || req.files.length === 0) {
      res.status(400).send({ message: "No image file provided" });
    } else {
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`.replace(/\\/g, "/"));
      res.status(200).send({
        message: "Image uploaded successfully",
        images: imagePaths,
      });
    }
  });
});

export default router;
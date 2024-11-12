import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';

export const FindMany = asyncHandler(async (req, res) => {
    try {
        const pageSize = 9
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: "i" } }
            : {}
        const count = await Product.countDocuments({ ...keyword })
        const products = await Product.find({ ...keyword }).limit(pageSize)

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false,
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "server error" })
    }
});

export const findOne = asyncHandler(async (req, res) => {
    const id = req.params.id
    const data = await Product.findById(id)

    if (data) {
        res.send(data)
    } else {
        res.status(500).send({ message: 'Product not found with id ' + id })
    }
})

export const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

export const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(4)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

export const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .limit(12)
            .sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
})

export const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body
        const product = await Product.findById(req.params.id)

        if (product) {
            const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())
            if (alreadyReviewed) {
                res.status(400)
                throw new Error("Product already reviewed")
            }
            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id, 
            };
            product.reviews.push(review)
            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

            await product.save()
            res.status(201).json({ message: "review added" })   
        } else {
            res.status(404)
            throw new Error("product not found")
        }
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

export const createProduct = asyncHandler(async (req, res) => {
    try {
      const { name, brand, quantity, category, description, price } = req.body;

      console.log("Isi dari req.files:", req.files);
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const imagePaths = req.files.map(file => `/uploads/${file.filename}`.replace(/\\/g, '/'));
  
      const product = new Product({
        name,
        brand,
        quantity,
        category,
        description,
        price,
        images: imagePaths
      })
  
      await product.save()
      res.status(201).json({
        message: 'Product created successfully',
        product
      })
    } catch (error) {
      console.error('Error creating product:', error)
      res.status(500).json({ error: 'Server error' })
    }
  })

export const update = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price, image } = req.fields;

        const product = await Product.findByIdAndUpdate(req.params.id, { ...req.fields }, { new: true })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        await product.save()
        res.status(201).json({ message: 'update sucessfully!', product })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
        return res.status(404).json({ message: 'product not found' })
    }
    res.json({ message: 'delete successfully', deletedProduct })
})

export const filterProducts = asyncHandler(async (req, res) => {
    try {
        const { checked, radio } = req.body

        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length)args.price = { $gte: radio[0], $lte: radio[1]}
        
        const products = await Product.find(args)
        res.json(products)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
})
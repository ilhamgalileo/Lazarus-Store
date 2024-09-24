const Product = require('../models/product')
const asyncHandler = require('express-async-handler')

exports.FindMany = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6
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
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "server error" })
    }
})

exports.findOne = asyncHandler(async (req, res) => {
    const id = req.params.id
    const data = await Product.findById(id)

    if (data) {
        res.send(data)
    } else {
        res.status(500).send({ message: 'Product not found with id ' + id })
    }
})

exports.fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .limit(12)
            .sort({ createAt: -1 })
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
})

exports.addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body
        const product = await Product.findById(req.params.id)

        if (product) {
            const alreadyReviewed = product.reviews.find((r) => r.user.toString()
                === req.user._id.toString()
            )
            if (alreadyReviewed) {
                res.status(400)
                throw new Error("Product already reviewed")
            }
            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id
            }
            product.reviews.push(review)
            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating +
                acc, 0) / product.reviews.length

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

exports.create = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price, image } = req.fields
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" })
            case !brand:
                return res.json({ error: "Brand is required" })
            case !quantity:
                return res.json({ error: "Quantity is required" })
            case !category:
                return res.json({ error: "Category is required" })
            case !description:
                return res.json({ error: "Description is required" })
            case !price:
                return res.json({ error: "Price is required" })
            case !image:
                return res.json({ error: "Image is required" })
        }
        const product = new Product({ ...req.fields })
        await product.save()
        res.status(201).json({ message: 'Data Berhasil disimpan', product })
    } catch (error) {
    }
})

exports.update = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price, image } = req.fields
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" })
            case !brand:
                return res.json({ error: "Brand is required" })
            case !quantity:
                return res.json({ error: "Quantity is required" })
            case !category:
                return res.json({ error: "Category is required" })
            case !description:
                return res.json({ error: "Description is required" })
            case !price:
                return res.json({ error: "Price is required" })
            case !image:
                return res.json({ error: "Image is required" })
        }
        const product = await Product.findByIdAndUpdate(req.params.id, { ...req.fields }, { new: true })
        await product.save()
        res.status(201).json({ message: 'Data Berhasil diperbarui', product })
    } catch (error) {
    }
})


exports.delete = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
        return res.status(404).json({ message: 'produk tidak ditemukan' })
    }
    res.json({ message: 'produk berhasil dihapus', deletedProduct })
})

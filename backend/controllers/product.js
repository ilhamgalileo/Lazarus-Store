const Product = require('../models/product')
const asyncHandler = require('express-async-handler')

exports.FindMany = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: "i" } }
            : {}
        const count = await Product.countDocuments({...keyword})
        const products = await Product.find({...keyword}).limit(pageSize)

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "server error"})
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

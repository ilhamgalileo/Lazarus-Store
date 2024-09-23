const Product = require('../models/product')
const asyncHandler = require('express-async-handler')

exports.FindMany = asyncHandler(async (req, res) => {
    const data = await Product.find()
    if (data.length === 0) {
        return res.status(404).send({ message: 'produk kosong' })
    }
    res.send(data)
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
    const id = req.params.id

    const data = await Product.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
        new: true
    })

    if (!data) {
        return res.status(404).send({ message: 'Produk tidak ditemukan' })
    }

    res.send({ message: "Update berhasil", data })
})


exports.delete = asyncHandler(async (req, res) => {
    const id = req.params.id
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
        return res.status(404).send({ message: 'produk tidak ditemukan' })
    }
    res.send({ message: 'produk berhasil dihapus' })
})

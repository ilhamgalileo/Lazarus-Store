const asyncHandler = require("express-async-handler")
const Category = require('../models/category')

exports.createCate = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.json({ error: "Name is required" })
        }

        const cateExist = await Category.findOne({ name })
        if (cateExist) {
            return res.json({ error: "Already exists" })
        }

        const category = await new Category({ name }).save()
        res.status(201).json({ Message: 'Berhasil menambahkan kategori', category })

    } catch (error) {
        return res.status(400).json(error)
    }
})

exports.removeCate = asyncHandler(async (req, res) => {
    try {
        const removeCate = await Category.findByIdAndDelete(req.params.categoryId)
        if (!removeCate) {
            return res.json('Data tidak ditemukan')
        }
        res.json(removeCate)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

exports.categoryList = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({})
        res.json(all)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

exports.findOne = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id })
        res.json(category)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
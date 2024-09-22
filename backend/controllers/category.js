const asyncHandler = require("express-async-handler")
const Category = require('../models/category')

exports.createCate = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.json({ error: "Name is required" })
        }
        
        const cateExist = await Category.findOne({name})
        if (cateExist) {
            return res.json({error: "Already exists"})
        }

        const category = await new Category({name}).save()
        res.status(201).json({ Message: 'Berhasil menambahkan kategori', category })

    } catch (error) {
        return res.status(400).json(error)
    }
})

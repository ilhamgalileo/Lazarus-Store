import asyncHandler from 'express-async-handler';
import Category from '../models/category.js';

export const createCate = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.json({ error: "Name is required" });
        }

        const cateExist = await Category.findOne({ name });
        if (cateExist) {
            return res.json({ error: "Already exists" });
        }

        const category = await new Category({ name }).save();
        res.status(201).json({ Message: 'Berhasil menambahkan kategori', category });

    } catch (error) {
        return res.status(400).json(error);
    }
});

export const updateCate = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.name = name;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const removeCate = asyncHandler(async (req, res) => {
    try {
        const removeCate = await Category.findByIdAndDelete(req.params.categoryId);
        if (!removeCate) {
            return res.json('Data tidak ditemukan');
        }
        res.json(removeCate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const categoryList = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const findOne = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

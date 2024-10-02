import mongoose from "mongoose"

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        unique: true,
    },
},
    {
        timestamps: true
    })

const Category = mongoose.model("Category", schema)
export default Category

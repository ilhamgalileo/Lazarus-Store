const  Product  = require('../models/product')

exports.FindMany = async (req, res) => {
    try {
        const data = await Product.find()
        if(data.length===0){
        return res.status(404).send({message: 'produk kosong'})
        }
        res.send(data)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Product.findById(id)

        if (data) {
            res.send(data)
        } else {
            res.status(500).send({ message: 'Product not found with id ' + id })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.create = async (req, res) => {
    try {
        const product = new Product({...req.body})
        const savedProduct = await product.save()
        res.status(201).json({ message: 'Data Berhasil disimpan', savedProduct })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.update = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Product.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false,
            new: true
        })
    
        if (!data) {
            return res.status(404).send({ message: 'Produk tidak ditemukan' })
        }
    
        res.send({ message: "Update berhasil", data })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


exports.delete = async (req, res) => {
    const id = req.params.id
    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).send({ message: 'produk tidak ditemukan' })
        }
        res.send({ message: 'produk berhasil dihapus' })
    } catch (err) {
        res.status(500).send({ message: 'Terjadi kesalahan saat menghapus produk: ' + err.message })
    }
}

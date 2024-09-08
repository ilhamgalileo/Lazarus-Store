const bcrypt = require('bcrypt')

module.exports = mongoose => {
  const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama harus diisi'],
        trim: true,
        minlength: [3, 'Nama harus memiliki setidaknya 3 karakter']
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value) {
                // Regex untuk memeriksa format email yang valid
                return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
            },
            message: props => `${props.value} bukan format email yang valid`
        }
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minlength: [6, 'Password harus memiliki setidaknya 6 karakter'],
        select: false // Menghindari password terpilih secara default
    }
})


  // Middleware untuk hashing password sebelum menyimpan user
  schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})


  // Metode untuk mengubah representasi JSON dari dokumen
  schema.method("toJSON", function () {
    const { __v, _id, password, ...object } = this.toObject()
    object.id = _id
    return object
  })

  return mongoose.model("User", schema)
}

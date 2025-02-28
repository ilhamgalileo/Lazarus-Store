import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Nama harus diisi"],
      trim: true,
      minlength: [3, "Nama harus memiliki setidaknya 3 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: (props) => `${props.value} bukan format email yang valid`,
      },
    },
    password: {
      type: String,
      required: [true],
      minlength: [6],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: null,
    },

    superAdmin: {
      type: Boolean,
      default: null,
    },

    shippingAddress: [
      {
        recipient: String,
        province: String,
        city: String,
        district: String,
        village: String,
        postalCode: String,
        detail_address: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ratingSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  rating: { type: Number, min: 1, max: 5 },
});

const commentSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const cartItemSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: [cartItemSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    ratings: [ratingSchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

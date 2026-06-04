const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    games: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

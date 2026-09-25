import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  storeOwnerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerMobile: { type: String, default: 'N/A' },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Clear mongoose model cache for Reservation to prevent OverwriteModelError
delete mongoose.models.Reservation;

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);

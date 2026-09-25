import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine {
  name: string;
  price: number;
}

export interface IStore extends Document {
  name: string;
  address: string;
  city: string;
  pincode: string;
  ownerEmail: string; // To link the store to the staff member
  imageUrl?: string;
  medicines: IMedicine[];
}

const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const StoreSchema = new Schema<IStore>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  imageUrl: { type: String },
  medicines: [MedicineSchema],
}, { timestamps: true, collection: 'store' });

if (mongoose.models.Store) {
  delete mongoose.models.Store;
}

export default mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  mobile?: string;
  email: string;
  password?: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: false },
  mobile: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Should be hashed in production
  role: { type: String, default: 'customer' },
}, { timestamps: true, collection: 'user' });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

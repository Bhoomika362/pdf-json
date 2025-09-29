import mongoose, { Schema, Document } from 'mongoose';
import './mongodb';

// User Schema
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 255 },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Activity Log Schema (simplified - no team references)
export interface IActivityLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  timestamp: Date;
  ipAddress?: string;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String, maxlength: 45 }
});

// Create models
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

// Type definitions
export type User = IUser;
export type NewUser = {
  name?: string;
  email: string;
  passwordHash: string;
  deletedAt?: Date;
};

export type ActivityLog = IActivityLog;
export type NewActivityLog = {
  userId: mongoose.Types.ObjectId;
  action: string;
  ipAddress?: string;
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}
import mongoose from 'mongoose';
import { User, ActivityLog } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    !sessionData.user.id
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(sessionData.user.id),
    deletedAt: { $exists: false }
  });

  return user;
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const logs = await ActivityLog.find({ userId: user._id })
    .populate('userId', 'name email')
    .sort({ timestamp: -1 })
    .limit(10)
    .lean();

  return logs.map(log => ({
    id: log._id.toString(),
    action: log.action,
    timestamp: log.timestamp,
    ipAddress: log.ipAddress,
    userName: log.userId?.name || log.userId?.email
  }));
}
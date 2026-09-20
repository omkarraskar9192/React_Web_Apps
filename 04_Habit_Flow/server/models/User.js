import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Flow User' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    title: { type: String, default: 'Relentless Disciplinarian' },
    bio: { type: String, default: 'Building consistency one day at a time.' },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    },
    streakCount: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    dailyGoal: { type: Number, default: 4 },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', userSchema)


import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    clientId: { type: String, index: true },
    name: { type: String, required: true },
    detail: { type: String, default: 'A small daily action' },
    icon: { type: String, default: '✨' },
    color: { type: String, default: 'mint' },
    category: { type: String, default: 'wellness' },
    frequency: { type: String, default: 'daily' },
    done: { type: Boolean, default: false },
    completedDates: { type: [String], default: [] },
    streak: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
)

export default mongoose.models.Habit || mongoose.model('Habit', habitSchema)

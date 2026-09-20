import mongoose from 'mongoose'

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

historySchema.index({ userId: 1, date: 1 })

export default mongoose.models.History || mongoose.model('History', historySchema)


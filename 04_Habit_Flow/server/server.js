import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Habit from './models/Habit.js'
import History from './models/History.js'
import User from './models/User.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'habitflow-disciplined-secret-key-2026'
let currentMongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habitflow'

app.use(cors())
app.use(express.json())

let isConnected = false
let connectionError = null

// Helper to connect to MongoDB
const connectMongoDB = async (uri) => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    isConnected = true
    connectionError = null
    currentMongoURI = uri
    console.log('✅ Connected to MongoDB successfully!')
    await migrateDatabaseHabits()
    return { success: true }
  } catch (err) {
    isConnected = false
    connectionError = err.message
    console.warn('⚠️ MongoDB connection error:', err.message)
    return { success: false, error: err.message }
  }
}

// Database migration to backfill completedDates and fix rollover for existing habits
const migrateDatabaseHabits = async () => {
  // Startup check completed
}

// Initial connection attempt
connectMongoDB(currentMongoURI)

// Mask connection URI for security
const maskURI = (uri) => {
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//$1:****@')
  } catch {
    return uri
  }
}

// Sanitize user object for responses
const sanitizeUser = (user) => ({
  id: String(user._id),
  _id: String(user._id),
  name: user.name,
  email: user.email,
  title: user.title,
  bio: user.bio,
  avatar: user.avatar,
  streakCount: user.streakCount || 0,
  bestStreak: user.bestStreak || 0,
  dailyGoal: user.dailyGoal || 4,
  createdAt: user.createdAt,
})

// Optional Auth Middleware (extracts userId if present)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.userId = decoded.userId
      req.userEmail = decoded.email
    } catch {
      // invalid token, treat as guest
    }
  }
  next()
}

// Strict Auth Middleware (requires valid token)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    req.userEmail = decoded.email
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' })
  }
}

app.use(optionalAuth)

// Health check endpoint
app.get('/api/health', (req, res) => {
  const ready = mongoose.connection.readyState === 1
  res.json({
    status: 'ok',
    mongoConnected: isConnected && ready,
    error: connectionError,
    uri: maskURI(currentMongoURI),
    time: new Date().toISOString(),
  })
})

// MongoDB Config & Live Connection Manager
app.get('/api/config/mongo', (req, res) => {
  const ready = mongoose.connection.readyState === 1
  res.json({
    connected: isConnected && ready,
    error: connectionError,
    uri: maskURI(currentMongoURI),
    databaseName: mongoose.connection.name || 'habitflow',
  })
})

app.post('/api/config/mongo', async (req, res) => {
  const { uri } = req.body
  if (!uri || typeof uri !== 'string') {
    return res.status(400).json({ error: 'Valid connection URI is required' })
  }

  const result = await connectMongoDB(uri.trim())
  if (result.success) {
    try {
      const envPath = path.resolve(process.cwd(), 'server', '.env')
      const envContent = `PORT=${PORT}\nMONGODB_URI=${uri.trim()}\nJWT_SECRET=${JWT_SECRET}\n`
      fs.writeFileSync(envPath, envContent, 'utf-8')
    } catch {
      // ignore file write error
    }

    return res.json({
      success: true,
      message: 'Connected to MongoDB successfully!',
      uri: maskURI(uri),
    })
  } else {
    return res.status(400).json({
      success: false,
      error: result.error,
      message: 'Failed to connect to MongoDB with provided URI',
    })
  }
})

// ==========================================
// User Authentication Endpoints
// ==========================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'MongoDB database is offline' })
  }

  const { email, password, name, initialHabits = [] } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      name: name?.trim() || 'Flow Disciplinarian',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    })
    await newUser.save()

    // Associate any initial offline habits with this new user (deduplicated by name)
    if (Array.isArray(initialHabits) && initialHabits.length > 0) {
      const seenNames = new Set()
      for (const h of initialHabits) {
        const name = (h.name || '').trim()
        if (!name || seenNames.has(name.toLowerCase())) continue
        seenNames.add(name.toLowerCase())
        const clientId = String(h.id || Date.now())
        await Habit.findOneAndUpdate(
          { userId: newUser._id, name },
          {
            userId: newUser._id,
            clientId,
            name,
            detail: h.detail,
            icon: h.icon,
            color: h.color,
            category: h.category,
            frequency: h.frequency || 'daily',
            done: h.done,
            completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
            streak: h.streak || 0,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      }
    }

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '60d' }
    )

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully!',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login existing user
app.post('/api/auth/login', async (req, res) => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'MongoDB database is offline' })
  }

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '60d' }
    )

    // Also fetch their habits to restore immediately on login (deduplicated by name)
    const userHabits = await Habit.find({ userId: user._id }).sort({ createdAt: -1 })
    const seenLoginHabits = new Set()
    const uniqueUserHabits = []
    for (const h of userHabits) {
      const key = (h.name || '').toLowerCase().trim()
      if (key && !seenLoginHabits.has(key)) {
        seenLoginHabits.add(key)
        uniqueUserHabits.push(h)
      }
    }

    const userHistory = await History.find({ userId: user._id })

    const historyMap = {}
    userHistory.forEach((h) => {
      historyMap[h.date] = {
        date: h.date,
        completed: h.completed,
        total: h.total,
        percent: h.percent,
        notes: h.notes,
      }
    })

    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      habits: uniqueUserHabits.map((h) => ({
        id: h.clientId || String(h._id),
        _id: h._id,
        name: h.name,
        detail: h.detail,
        icon: h.icon,
        color: h.color,
        category: h.category,
        frequency: h.frequency,
        done: h.done,
        completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
        streak: h.streak,
        createdAt: h.createdAt,
      })),
      history: historyMap,
      message: 'Logged in successfully!',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user profile
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user: sanitizeUser(user) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==========================================
// Habits Endpoints (Filtered by User)
// ==========================================

app.get('/api/habits', async (req, res) => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' })
    }

    const query = req.userId ? { userId: req.userId } : { userId: null }
    const habits = await Habit.find(query).sort({ createdAt: -1 })

    // Deduplicate in memory by trimmed name
    const seenHabits = new Set()
    const uniqueHabits = []
    for (const h of habits) {
      const key = (h.name || '').toLowerCase().trim()
      if (key && !seenHabits.has(key)) {
        seenHabits.add(key)
        uniqueHabits.push(h)
      }
    }

    const formatted = uniqueHabits.map((h) => ({
      id: h.clientId || String(h._id),
      _id: h._id,
      name: h.name,
      detail: h.detail,
      icon: h.icon,
      color: h.color,
      category: h.category,
      frequency: h.frequency,
      done: h.done,
      completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
      streak: h.streak,
      createdAt: h.createdAt,
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/habits', async (req, res) => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' })
    }

    const payload = req.body
    const clientId = String(payload.id || Date.now())
    const habitName = (payload.name || '').trim()

    // Prevent duplicate entries for the same habit name or clientId
    const filter = req.userId
      ? { userId: req.userId, $or: [{ clientId }, { name: habitName }] }
      : { $or: [{ clientId }, { name: habitName }] }

    const habit = await Habit.findOneAndUpdate(
      filter,
      {
        ...payload,
        completedDates: Array.isArray(payload.completedDates) ? payload.completedDates : [],
        name: habitName,
        userId: req.userId || null,
        clientId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.status(201).json({
      ...habit.toObject(),
      id: clientId,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/habits/:id', async (req, res) => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' })
    }

    const id = req.params.id
    const query = req.userId
      ? { userId: req.userId, $or: [{ clientId: id }, mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: '__none__' }] }
      : { $or: [{ clientId: id }, mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: '__none__' }] }

    let habit = await Habit.findOneAndUpdate(query, req.body, { new: true })
    res.json(habit)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/habits/:id', async (req, res) => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' })
    }

    const id = req.params.id
    const query = req.userId
      ? { userId: req.userId, $or: [{ clientId: id }, mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: '__none__' }] }
      : { $or: [{ clientId: id }, mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: '__none__' }] }

    await Habit.findOneAndDelete(query)
    res.json({ success: true, message: 'Habit deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==========================================
// History Endpoints
// ==========================================

app.get('/api/history', async (req, res) => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' })
    }

    const query = req.userId ? { userId: req.userId } : { userId: null }
    const history = await History.find(query).sort({ date: -1 })
    res.json(history)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/history', async (req, res) => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' })
    }

    const { date, completed, total, percent, notes } = req.body
    const filter = req.userId ? { userId: req.userId, date } : { date }
    const record = await History.findOneAndUpdate(
      filter,
      {
        userId: req.userId || null,
        date,
        completed,
        total,
        percent,
        notes,
      },
      { upsert: true, new: true }
    )
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==========================================
// Bulk Reconcile / Offline Sync Endpoint
// ==========================================

app.post('/api/sync', async (req, res) => {
  const { habits = [], history = {}, user = {} } = req.body
  if (!isConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'MongoDB is not connected', fallback: true })
  }

  try {
    const userId = req.userId || null

    // Upsert habits
    for (const h of habits) {
      const clientId = String(h.id || h._id)
      const query = userId
        ? { userId, $or: [{ clientId }, { name: h.name }] }
        : { $or: [{ clientId }, { name: h.name }] }

      await Habit.findOneAndUpdate(
        query,
        {
          userId,
          clientId,
          name: h.name,
          detail: h.detail,
          icon: h.icon,
          color: h.color,
          category: h.category,
          frequency: h.frequency || 'daily',
          done: h.done,
          completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
          streak: h.streak || 0,
        },
        { upsert: true, new: true }
      )
    }

    // Upsert history records
    for (const [dateKey, record] of Object.entries(history)) {
      if (record && dateKey) {
        const query = userId ? { userId, date: dateKey } : { date: dateKey }
        await History.findOneAndUpdate(
          query,
          {
            userId,
            date: dateKey,
            completed: record.completed || 0,
            total: record.total || 0,
            percent: record.percent || 0,
            notes: record.notes || '',
          },
          { upsert: true, new: true }
        )
      }
    }

    // Update user profile if logged in
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        ...(user.name && { name: user.name }),
        ...(user.title && { title: user.title }),
        ...(user.bio && { bio: user.bio }),
        ...(user.avatar && { avatar: user.avatar }),
        ...(user.streakCount !== undefined && { streakCount: user.streakCount }),
        ...(user.bestStreak !== undefined && { bestStreak: user.bestStreak }),
        ...(user.dailyGoal && { dailyGoal: user.dailyGoal }),
      })
    }

    const userHabits = await Habit.find(userId ? { userId } : { userId: null }).sort({ createdAt: -1 })
    const seenSyncHabits = new Set()
    const uniqueSyncHabits = []
    for (const h of userHabits) {
      const key = (h.name || '').toLowerCase().trim()
      if (key && !seenSyncHabits.has(key)) {
        seenSyncHabits.add(key)
        uniqueSyncHabits.push(h)
      }
    }

    res.json({
      success: true,
      count: uniqueSyncHabits.length,
      habits: uniqueSyncHabits.map((h) => ({
        id: h.clientId || String(h._id),
        _id: h._id,
        name: h.name,
        detail: h.detail,
        icon: h.icon,
        color: h.color,
        category: h.category,
        frequency: h.frequency,
        done: h.done,
        completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
        streak: h.streak,
        createdAt: h.createdAt,
      })),
      message: 'Cloud sync complete!',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Habit Flow Backend Server running on http://localhost:${PORT}`)
})

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Chip
} from '@heroui/react'
import {
  User,
  Bookmark,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  Check
} from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()

  // Student Profile Data
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('studentProfile')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Could not read student profile', e)
    }
    return {
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      category: 'General',
      homeState: 'Maharashtra',
      city: 'Pune',
      tenthMarks: '94.5%',
      twelfthMarks: '92.0%',
      jeeAdvRank: '350',
      jeeMainRank: '1240',
      mhtcetPercentile: '99.82'
    }
  })

  // Shortlisted choices from Predictor
  const [shortlist, setShortlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shortlistedColleges') || '[]')
    } catch {
      return []
    }
  })

  const [isSavedAlert, setIsSavedAlert] = useState(false)

  const handleProfileChange = (field, val) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: val
    }))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    localStorage.setItem('studentProfile', JSON.stringify(profileData))
    setIsSavedAlert(true)
    setTimeout(() => setIsSavedAlert(false), 3000)
  }

  const moveItem = (index, direction) => {
    const newItems = [...shortlist]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setShortlist(newItems)
    localStorage.setItem('shortlistedColleges', JSON.stringify(newItems))
  }

  const removeShortlist = (cutoffId) => {
    const updated = shortlist.filter((s) => s.cutoffId !== cutoffId)
    setShortlist(updated)
    localStorage.setItem('shortlistedColleges', JSON.stringify(updated))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-2xl text-indigo-200">
            {profileData.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{profileData.fullName}</h1>
              <Chip size="sm" variant="flat" color="success" className="text-xs">
                {profileData.category}
              </Chip>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              {profileData.city}, {profileData.homeState} &bull; Aspirant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            color="primary"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30"
            startContent={<Sparkles className="w-4 h-4" />}
            onPress={() => navigate('/recommend')}
          >
            Counselor Predictor
          </Button>
        </div>
      </div>

      {isSavedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm shadow-sm font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Academic & Personal Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Personal & Academic Profile</h3>
                <p className="text-xs text-slate-500">Keep scores updated for counseling</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Home State</label>
                  <input
                    type="text"
                    value={profileData.homeState}
                    onChange={(e) => handleProfileChange('homeState', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleProfileChange('city', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Entrance Exam Scores
                </span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">JEE Adv AIR</label>
                    <input
                      type="text"
                      value={profileData.jeeAdvRank}
                      onChange={(e) => handleProfileChange('jeeAdvRank', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">JEE Main AIR</label>
                    <input
                      type="text"
                      value={profileData.jeeMainRank}
                      onChange={(e) => handleProfileChange('jeeMainRank', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">MHT-CET %ile</label>
                    <input
                      type="text"
                      value={profileData.mhtcetPercentile}
                      onChange={(e) => handleProfileChange('mhtcetPercentile', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">12th Board</label>
                    <input
                      type="text"
                      value={profileData.twelfthMarks}
                      onChange={(e) => handleProfileChange('twelfthMarks', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full mt-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                startContent={<Save className="w-3.5 h-3.5" />}
              >
                Update Profile
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Col: Choice-Filling Priority Order (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Counseling Choice-Filling Order</h3>
                  <p className="text-xs text-slate-500">
                    Arrange your shortlisted colleges for JoSAA / CET Option Form
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
                {shortlist.length} Options Added
              </span>
            </div>

            {shortlist.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-semibold text-slate-800 text-sm">No colleges shortlisted yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Go to the <strong>Find College</strong> predictor, enter your marks, and click <em>Save to List</em> to prepare your counseling preference order.
                </p>
                <Button
                  size="sm"
                  color="primary"
                  className="mt-4 bg-indigo-600 text-white text-xs font-semibold mx-auto"
                  onPress={() => navigate('/recommend')}
                >
                  Explore College Predictor
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-4">
                {shortlist.map((item, index) => (
                  <div key={item.cutoffId} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{item.college?.name}</p>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={item.chance === 'Safe' ? 'success' : item.chance === 'Target' ? 'warning' : 'danger'}
                            className="text-[10px]"
                          >
                            {item.chance}
                          </Chip>
                        </div>
                        <p className="text-xs font-semibold text-indigo-700">{item.branch}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.college?.location?.city}, {item.college?.location?.state} &bull; NIRF #{item.nirfRank || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === shortlist.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeShortlist(item.cutoffId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
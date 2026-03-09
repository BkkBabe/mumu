import { useState } from 'react'
import { APPOINTMENTS, THERAPISTS, SERVICES, MEMBERS, TIME_SLOTS } from '../data/fakeData'

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const DAY_LABELS_CN = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WEEK_START = new Date('2026-03-09') // Monday

function formatDate(baseDate, dayIdx) {
  const d = new Date(baseDate)
  d.setDate(d.getDate() + dayIdx)
  return d.getDate()
}

const ALL_SERVICES_FLAT = Object.values(SERVICES).flat()

export default function BookingCalendar() {
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterTherapist, setFilterTherapist] = useState('all')
  const [weekOffset, setWeekOffset] = useState(0)

  const [newBooking, setNewBooking] = useState({
    customer: '', service: '', therapist: '', date: 'mon', time: '09:00', notes: ''
  })

  const baseDate = new Date(WEEK_START)
  baseDate.setDate(baseDate.getDate() + weekOffset * 7)

  const weekLabel = (() => {
    const end = new Date(baseDate)
    end.setDate(end.getDate() + 6)
    return `${baseDate.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric', year: 'numeric' })}`
  })()

  const filtered = APPOINTMENTS.filter(a =>
    filterTherapist === 'all' || String(a.therapistId) === filterTherapist
  )

  const getAppts = (day, time) =>
    filtered.filter(a => a.date === day && a.time === time)

  const therapistClass = (name) => {
    if (name === '陈师傅') return 'therapist-chen'
    if (name === '王师傅') return 'therapist-wang'
    if (name === '李老师') return 'therapist-li'
    if (name === '张师傅') return 'therapist-zhang'
    return 'therapist-chen'
  }

  const handleSubmitBooking = (e) => {
    e.preventDefault()
    setShowModal(false)
    setNewBooking({ customer: '', service: '', therapist: '', date: 'mon', time: '09:00', notes: '' })
    alert('预约已成功创建！\nBooking created successfully!')
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="calendar-toolbar">
        <div className="date-navigator">
          <button className="date-nav-btn" onClick={() => setWeekOffset(w => w - 1)}>‹</button>
          <span className="date-range-label">{weekLabel}</span>
          <button className="date-nav-btn" onClick={() => setWeekOffset(w => w + 1)}>›</button>
          <button className="btn btn-outline btn-sm" onClick={() => setWeekOffset(0)} style={{ marginLeft: 8 }}>
            本周 This Week
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Noto Serif SC' }}>筛选治疗师</label>
            <select
              className="form-select"
              style={{ width: 140, padding: '7px 10px', fontSize: 13 }}
              value={filterTherapist}
              onChange={e => setFilterTherapist(e.target.value)}
            >
              <option value="all">全部 All</option>
              {THERAPISTS.map(t => (
                <option key={t.id} value={String(t.id)}>{t.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ＋ 新增预约 New Booking
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-wrapper">
      <div className="calendar-grid">
        {/* Header */}
        <div className="calendar-header-row">
          <div className="calendar-header-cell" style={{ background: 'var(--background)' }} />
          {DAY_KEYS.map((day, i) => (
            <div key={day} className="calendar-header-cell" style={{
              background: weekOffset === 0 && i === 0 ? 'rgba(199,169,140,0.1)' : 'var(--background)'
            }}>
              <span className="cal-day-name">{DAY_LABELS_CN[i]}</span>
              <span className={`cal-day-date ${weekOffset === 0 && i === 0 ? 'today' : ''}`}>
                {formatDate(baseDate, i)}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'Lora' }}>
                {DAY_LABELS_EN[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="calendar-body">
          {TIME_SLOTS.map(time => (
            <div key={time} className="calendar-time-row">
              <div className="time-label">{time}</div>
              {DAY_KEYS.map(day => {
                const appts = getAppts(day, time)
                return (
                  <div key={day} className="calendar-cell">
                    {appts.map(appt => (
                      <div
                        key={appt.id}
                        className={`cal-appointment ${therapistClass(appt.therapist)}`}
                        onClick={() => setSelectedAppt(appt)}
                      >
                        <span className="cal-appt-customer">{appt.customer}</span>
                        <span className="cal-appt-service">{appt.service}</span>
                        <span className="cal-appt-therapist">{appt.therapist}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Therapist legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {THERAPISTS.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div className={`cal-appointment therapist-${t.color}`} style={{ width: 12, height: 12, borderRadius: 3, padding: 0, margin: 0 }} />
            <span style={{ fontFamily: 'Noto Serif SC', color: 'var(--text-secondary)' }}>{t.name}</span>
            <span style={{ color: 'var(--text-secondary)', opacity: 0.7, fontFamily: 'Lora' }}>({t.specialty})</span>
          </div>
        ))}
      </div>

      {/* Appointment detail panel */}
      {selectedAppt && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 }}
          onClick={() => setSelectedAppt(null)}
        >
          <div
            className="detail-panel"
            onClick={e => e.stopPropagation()}
          >
            <div className="detail-panel-header">
              <div style={{ fontFamily: 'Noto Serif SC', fontSize: 16, fontWeight: 700, color: 'var(--brand-primary)', marginBottom: 4 }}>
                预约详情 Appointment
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                style={{ background: 'none', border: 'none', color: 'rgba(226,207,187,0.6)', cursor: 'pointer', fontSize: 20, float: 'right', marginTop: -28 }}
              >
                ×
              </button>
              <div style={{ fontFamily: 'Noto Serif SC', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginTop: 8 }}>
                {selectedAppt.customer}
              </div>
            </div>
            <div className="detail-panel-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: '服务 Service', value: selectedAppt.service },
                  { label: '治疗师 Therapist', value: selectedAppt.therapist },
                  { label: '时间 Time', value: `${DAY_LABELS_CN[DAY_KEYS.indexOf(selectedAppt.date)]} ${selectedAppt.time}` },
                  { label: '时长 Duration', value: `${selectedAppt.duration} 分钟 min` },
                  { label: '状态 Status', value: selectedAppt.status === 'confirmed' ? '已确认 Confirmed' : '待确认 Pending' },
                ].map(row => (
                  <div key={row.label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Noto Serif SC', marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: 14, color: 'var(--brand-dark)', fontFamily: 'Noto Serif SC', fontWeight: 500 }}>{row.value}</div>
                  </div>
                ))}
                {selectedAppt.notes && (
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Noto Serif SC', marginBottom: 3 }}>备注 Notes</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{selectedAppt.notes}</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>编辑 Edit</button>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>取消预约 Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title-cn">新增预约</div>
                <span className="modal-title-en">New Appointment Booking</span>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitBooking}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">客户姓名 Customer Name</label>
                    <select
                      className="form-select"
                      value={newBooking.customer}
                      onChange={e => setNewBooking(b => ({ ...b, customer: e.target.value }))}
                      required
                    >
                      <option value="">请选择客户 Select customer...</option>
                      {MEMBERS.map(m => (
                        <option key={m.id} value={m.name}>{m.name} · {m.phone}</option>
                      ))}
                      <option value="walk-in">散客 Walk-in</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">服务项目 Service</label>
                    <select
                      className="form-select"
                      value={newBooking.service}
                      onChange={e => setNewBooking(b => ({ ...b, service: e.target.value }))}
                      required
                    >
                      <option value="">请选择 Select...</option>
                      {ALL_SERVICES_FLAT.map(s => (
                        <option key={s.id} value={s.cn}>{s.cn} {s.en}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">治疗师 Therapist</label>
                    <select
                      className="form-select"
                      value={newBooking.therapist}
                      onChange={e => setNewBooking(b => ({ ...b, therapist: e.target.value }))}
                      required
                    >
                      <option value="">请选择 Select...</option>
                      {THERAPISTS.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">日期 Date</label>
                    <select
                      className="form-select"
                      value={newBooking.date}
                      onChange={e => setNewBooking(b => ({ ...b, date: e.target.value }))}
                    >
                      {DAY_KEYS.map((d, i) => (
                        <option key={d} value={d}>{DAY_LABELS_CN[i]} {DAY_LABELS_EN[i]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">时间 Time</label>
                    <select
                      className="form-select"
                      value={newBooking.time}
                      onChange={e => setNewBooking(b => ({ ...b, time: e.target.value }))}
                    >
                      {TIME_SLOTS.slice(0, -1).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">备注 Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="特殊要求或注意事项..."
                      value={newBooking.notes}
                      onChange={e => setNewBooking(b => ({ ...b, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  取消 Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  确认预约 Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

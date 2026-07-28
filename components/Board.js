'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'vacancies', label: 'Vacancies' },
  { key: 'candidates', label: 'Candidates' },
  { key: 'schools', label: 'Schools' },
  { key: 'log', label: 'Daily Log' },
];

const VAC_STATUSES = ['Open', 'Filled', 'On Hold', 'Closed'];
const STAGE_ORDER = ['Sourcing', 'Submitted', 'Interview', 'Offer', 'Placed', 'Rejected'];
const SCHOOL_STATUSES = ['Signed', 'Pending'];

const STATUS_CLS = {
  Open: 'p-open', Filled: 'p-filled', 'On Hold': 'p-hold', Closed: 'p-closed',
  Sourcing: 'p-sourcing', Submitted: 'p-submitted', Interview: 'p-interview',
  Offer: 'p-offer', Rejected: 'p-rejected', Placed: 'p-filled',
  Signed: 'p-filled', Pending: 'p-hold',
};

function Pill({ value, onClick, order }) {
  const cls = STATUS_CLS[value] || '';
  const cycle = () => {
    if (!onClick || !order) return;
    const idx = order.indexOf(value);
    const next = order[(idx + 1) % order.length];
    onClick(next);
  };
  return (
    <button className={`pill ${cls}`} onClick={cycle} title={order ? 'Click to change' : undefined}>
      {value}
    </button>
  );
}

function daysAgo(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.round((now - d) / 86400000);
}

export default function Board({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [log, setLog] = useState([]);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) +
          ' · ' +
          now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [s, v, p, l] = await Promise.all([
        supabase.from('schools').select('*').order('created_at', { ascending: false }),
        supabase.from('vacancies').select('*').order('date_added', { ascending: false }),
        supabase.from('pipeline').select('*').order('created_at', { ascending: false }),
        supabase.from('daily_log').select('*').order('log_date', { ascending: false }),
      ]);
      if (s.error) throw s.error;
      if (v.error) throw v.error;
      if (p.error) throw p.error;
      if (l.error) throw l.error;
      setSchools(s.data || []);
      setVacancies(v.data || []);
      setPipeline(p.data || []);
      setLog(l.data || []);
    } catch (e) {
      console.error(e);
      setError(
        e.message?.includes('fetch')
          ? 'Could not reach Supabase. Check your NEXT_PUBLIC_SUPABASE_URL / ANON_KEY.'
          : e.message || 'Failed to load data.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // ---- CRUD helpers ----
  async function insertRow(table, row, setter) {
    const { data, error } = await supabase.from(table).insert([row]).select();
    if (error) { alert(error.message); return; }
    setter((prev) => [data[0], ...prev]);
  }
  async function deleteRow(table, id, setter) {
    if (!confirm('Delete this row?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setter((prev) => prev.filter((r) => r.id !== id));
  }
  async function updateField(table, id, field, value, setter) {
    const { error } = await supabase.from(table).update({ [field]: value }).eq('id', id);
    if (error) { alert(error.message); return; }
    setter((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  // ---- Dashboard computations ----
  const kpis = useMemo(() => {
    const openVac = vacancies.filter((v) => v.status === 'Open').length;
    const activePipeline = pipeline.filter((p) => ['Submitted', 'Interview', 'Offer'].includes(p.stage)).length;
    const atInterview = pipeline.filter((p) => p.stage === 'Interview').length;
    const placed = pipeline.filter((p) => p.stage === 'Placed').length;
    const schoolsSigned = schools.filter((s) => s.status === 'Signed').length;
    return [
      { n: openVac, l: 'OPEN VACANCIES', c: 'var(--orange)' },
      { n: activePipeline, l: 'ACTIVE PIPELINE', c: 'var(--text)' },
      { n: atInterview, l: 'AT INTERVIEW', c: 'var(--blue)' },
      { n: placed, l: 'PLACED', c: 'var(--green)' },
      { n: activePipeline, l: 'CANDIDATES READY', c: 'var(--text)' },
      { n: schoolsSigned, l: 'SCHOOLS SIGNED', c: 'var(--text)' },
    ];
  }, [vacancies, pipeline, schools]);

  const attention = useMemo(() => {
    const items = [];
    pipeline.filter((p) => p.stage === 'Offer').forEach((p) =>
      items.push({ tag: 'Offer out', who: `${p.candidate} — ${p.school}`, note: 'Confirm acceptance / package' })
    );
    pipeline.filter((p) => p.stage === 'Interview').forEach((p) =>
      items.push({ tag: 'Action', who: `${p.candidate} — ${p.school}`, note: p.note || 'Chase for feedback' })
    );
    pipeline
      .filter((p) => p.stage === 'Submitted' && p.note && p.note.toLowerCase().includes('chase'))
      .forEach((p) => items.push({ tag: 'Action', who: `${p.candidate} — ${p.school}`, note: p.note }));
    vacancies
      .filter((v) => v.status === 'Open' && daysAgo(v.date_added) >= 10)
      .forEach((v) =>
        items.push({ tag: 'Stale vacancy', who: `${v.school} — ${v.role}`, note: `${daysAgo(v.date_added)}d no update` })
      );
    return items;
  }, [pipeline, vacancies]);

  const stageChart = useMemo(() => {
    const colors = { Sourcing: '#e08a2c', Submitted: '#e0a92c', Interview: '#2e5bd7', Offer: '#6e5bd7', Placed: '#1f9d63', Rejected: '#98a2b3' };
    const counts = STAGE_ORDER.map((s) => pipeline.filter((p) => p.stage === s).length);
    const max = Math.max(...counts, 1);
    return { counts, colors, max };
  }, [pipeline]);

  // ---- Add-row forms state ----
  const [showForm, setShowForm] = useState(null);
  const [form, setForm] = useState({});

  function openForm(kind, defaults) {
    setForm(defaults);
    setShowForm(kind);
  }
  function closeForm() {
    setShowForm(null);
    setForm({});
  }

  async function submitPipeline(e) {
    e.preventDefault();
    if (!form.school || !form.candidate || !form.role) return;
    await insertRow('pipeline', {
      school: form.school, candidate: form.candidate, role: form.role,
      type: form.type || 'Permanent', stage: form.stage || 'Sourcing', note: form.note || '',
    }, setPipeline);
    closeForm();
  }
  async function submitVacancy(e) {
    e.preventDefault();
    if (!form.school || !form.role) return;
    await insertRow('vacancies', {
      school: form.school, group_name: form.group_name || '—', role: form.role,
      contact: form.contact || '', status: form.status || 'Open',
      date_added: form.date_added || new Date().toISOString().slice(0, 10),
    }, setVacancies);
    closeForm();
  }
  async function submitSchool(e) {
    e.preventDefault();
    if (!form.name) return;
    await insertRow('schools', {
      name: form.name, group_name: form.group_name || '—', contact: form.contact || '',
      status: form.status || 'Pending',
    }, setSchools);
    closeForm();
  }
  async function submitLog(e) {
    e.preventDefault();
    if (!form.entry) return;
    await insertRow('daily_log', {
      log_date: form.log_date || new Date().toISOString().slice(0, 10), entry: form.entry,
    }, setLog);
    closeForm();
  }

  if (loading) return <div className="loading">Loading the desk…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="mark">r</div>
          <div>
            <b>rTriibe Tracker</b>
            <span>UAE DESK</span>
          </div>
        </div>
        <nav>
          {TABS.map((t) => (
            <button key={t.key} className={activeTab === t.key ? 'active' : ''} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="right">
          {clock}
          <button className="logout-btn" onClick={onLogout}>Lock</button>
        </div>
      </div>

      <main>
        {activeTab === 'dashboard' && (
          <section className="active">
            <h2>Command Dashboard</h2>
            <p className="sub">Live counts, what needs you, and the shape of the desk — straight from Supabase.</p>
            <div className="kpis">
              {kpis.map((k, i) => (
                <div className="kpi" key={i}>
                  <b style={{ color: k.c }}>{k.n}</b>
                  <label>{k.l}</label>
                </div>
              ))}
            </div>
            <div className="attn">
              <h3><span className="pulse" />Needs attention ({attention.length})</h3>
              <div className="attn-grid">
                {attention.length === 0 && <div className="attn-empty">Nothing urgent right now.</div>}
                {attention.map((i, idx) => (
                  <div className="attn-card" key={idx}>
                    <div className="tag">{i.tag}</div>
                    <div className="who">{i.who}</div>
                    <div className="note">{i.note}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="charts">
              <div className="chart-card">
                <h3>Pipeline by stage <span className="tag">deals</span></h3>
                <div className="bars">
                  {STAGE_ORDER.map((s, i) => (
                    <div className="bar-col" key={s}>
                      <div className="n">{stageChart.counts[i]}</div>
                      <div className="bar" style={{ height: `${(stageChart.counts[i] / stageChart.max) * 140}px`, background: stageChart.colors[s] }} />
                      <div className="l">{s}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-card">
                <h3>Vacancies by status <span className="tag">roles</span></h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>
                    {vacancies.length}
                    <div style={{ fontSize: 10, color: 'var(--sub)', fontWeight: 600 }}>TOTAL ROLES</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {VAC_STATUSES.map((s) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: `var(--${{Open:'orange',Filled:'green','On Hold':'blue',Closed:'gray'}[s]})`, display: 'inline-block' }} />
                        <span style={{ flex: 1 }}>{s}</span>
                        <b>{vacancies.filter((v) => v.status === s).length}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'pipeline' && (
          <section className="active">
            <h2>Pipeline</h2>
            <p className="sub">Every deal on the desk right now. Click a stage pill to move it forward.</p>
            <div className="toolbar">
              <span className="count">{pipeline.length} deals</span>
              <button className="add-btn" onClick={() => openForm('pipeline', { type: 'Permanent', stage: 'Sourcing' })}>+ Add deal</button>
            </div>
            {showForm === 'pipeline' && (
              <form className="add-form" onSubmit={submitPipeline}>
                <div className="field"><label>School</label><input value={form.school || ''} onChange={(e) => setForm({ ...form, school: e.target.value })} required /></div>
                <div className="field"><label>Candidate</label><input value={form.candidate || ''} onChange={(e) => setForm({ ...form, candidate: e.target.value })} required /></div>
                <div className="field"><label>Role</label><input value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} required /></div>
                <div className="field"><label>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option>Permanent</option><option>Supply</option>
                  </select>
                </div>
                <div className="field"><label>Stage</label>
                  <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                    {STAGE_ORDER.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field"><label>Note</label><input value={form.note || ''} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            )}
            <div className="tablewrap">
              <table>
                <thead><tr><th>School</th><th>Candidate</th><th>Role</th><th>Type</th><th>Stage</th><th>Notes</th><th></th></tr></thead>
                <tbody>
                  {pipeline.map((p) => (
                    <tr key={p.id}>
                      <td>{p.school}</td><td>{p.candidate}</td><td>{p.role}</td><td>{p.type}</td>
                      <td><Pill value={p.stage} order={STAGE_ORDER} onClick={(v) => updateField('pipeline', p.id, 'stage', v, setPipeline)} /></td>
                      <td>{p.note}</td>
                      <td><button className="del-btn" onClick={() => deleteRow('pipeline', p.id, setPipeline)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pipeline.length === 0 && <div className="empty">No pipeline entries yet.</div>}
            </div>
          </section>
        )}

        {activeTab === 'vacancies' && (
          <section className="active">
            <h2>Vacancies</h2>
            <p className="sub">Every open role and its status. Click a status pill to update it.</p>
            <div className="toolbar">
              <span className="count">{vacancies.length} roles</span>
              <button className="add-btn" onClick={() => openForm('vacancies', { status: 'Open', date_added: new Date().toISOString().slice(0, 10) })}>+ Add vacancy</button>
            </div>
            {showForm === 'vacancies' && (
              <form className="add-form" onSubmit={submitVacancy}>
                <div className="field"><label>School</label><input value={form.school || ''} onChange={(e) => setForm({ ...form, school: e.target.value })} required /></div>
                <div className="field"><label>Group</label><input value={form.group_name || ''} onChange={(e) => setForm({ ...form, group_name: e.target.value })} placeholder="—" /></div>
                <div className="field"><label>Role</label><input value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} required /></div>
                <div className="field"><label>Contact</label><input value={form.contact || ''} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                <div className="field"><label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {VAC_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field"><label>Date added</label><input type="date" value={form.date_added || ''} onChange={(e) => setForm({ ...form, date_added: e.target.value })} /></div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            )}
            <div className="tablewrap">
              <table>
                <thead><tr><th>School</th><th>Group</th><th>Role</th><th>Contact</th><th>Status</th><th>Date added</th><th></th></tr></thead>
                <tbody>
                  {vacancies.map((v) => (
                    <tr key={v.id}>
                      <td>{v.school}</td><td>{v.group_name}</td><td>{v.role}</td><td>{v.contact}</td>
                      <td><Pill value={v.status} order={VAC_STATUSES} onClick={(val) => updateField('vacancies', v.id, 'status', val, setVacancies)} /></td>
                      <td>{v.date_added}</td>
                      <td><button className="del-btn" onClick={() => deleteRow('vacancies', v.id, setVacancies)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vacancies.length === 0 && <div className="empty">No vacancies yet.</div>}
            </div>
          </section>
        )}

        {activeTab === 'candidates' && (
          <section className="active">
            <h2>Candidates</h2>
            <p className="sub">Active candidates on desk — derived from the pipeline.</p>
            <div className="tablewrap">
              <table>
                <thead><tr><th>Candidate</th><th>Target role</th><th>School</th><th>Stage</th></tr></thead>
                <tbody>
                  {pipeline.map((p) => (
                    <tr key={p.id}>
                      <td>{p.candidate}</td><td>{p.role}</td><td>{p.school}</td>
                      <td><Pill value={p.stage} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pipeline.length === 0 && <div className="empty">No candidates yet.</div>}
            </div>
          </section>
        )}

        {activeTab === 'schools' && (
          <section className="active">
            <h2>Schools</h2>
            <p className="sub">Client relationships and key contacts.</p>
            <div className="toolbar">
              <span className="count">{schools.length} schools</span>
              <button className="add-btn" onClick={() => openForm('schools', { status: 'Pending' })}>+ Add school</button>
            </div>
            {showForm === 'schools' && (
              <form className="add-form" onSubmit={submitSchool}>
                <div className="field"><label>Name</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="field"><label>Group</label><input value={form.group_name || ''} onChange={(e) => setForm({ ...form, group_name: e.target.value })} placeholder="—" /></div>
                <div className="field"><label>Key contact</label><input value={form.contact || ''} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                <div className="field"><label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {SCHOOL_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            )}
            <div className="tablewrap">
              <table>
                <thead><tr><th>School</th><th>Group</th><th>Key contact</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {schools.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td><td>{s.group_name}</td><td>{s.contact}</td>
                      <td><Pill value={s.status} order={SCHOOL_STATUSES} onClick={(v) => updateField('schools', s.id, 'status', v, setSchools)} /></td>
                      <td><button className="del-btn" onClick={() => deleteRow('schools', s.id, setSchools)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schools.length === 0 && <div className="empty">No schools yet.</div>}
            </div>
          </section>
        )}

        {activeTab === 'log' && (
          <section className="active">
            <h2>Daily Log</h2>
            <p className="sub">Recent activity entries.</p>
            <div className="toolbar">
              <span className="count">{log.length} entries</span>
              <button className="add-btn" onClick={() => openForm('log', { log_date: new Date().toISOString().slice(0, 10) })}>+ Add entry</button>
            </div>
            {showForm === 'log' && (
              <form className="add-form" onSubmit={submitLog}>
                <div className="field"><label>Date</label><input type="date" value={form.log_date || ''} onChange={(e) => setForm({ ...form, log_date: e.target.value })} /></div>
                <div className="field" style={{ gridColumn: '1 / -1' }}><label>Entry</label><textarea value={form.entry || ''} onChange={(e) => setForm({ ...form, entry: e.target.value })} required /></div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            )}
            <div className="tablewrap">
              <table>
                <thead><tr><th>Date</th><th>Entry</th><th></th></tr></thead>
                <tbody>
                  {log.map((l) => (
                    <tr key={l.id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--sub)' }}>{l.log_date}</td>
                      <td>{l.entry}</td>
                      <td><button className="del-btn" onClick={() => deleteRow('daily_log', l.id, setLog)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {log.length === 0 && <div className="empty">No log entries yet.</div>}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

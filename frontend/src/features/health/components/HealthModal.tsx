import React from 'react'
import { Table, Button, Form } from 'react-bootstrap'

export function HealthModal({ t, show, onClose, data, dbData, loading, error, containersOpen, setContainersOpen, databasesOpen, setDatabasesOpen, fetchHealth, lastHealthTs, autoRefresh, setAutoRefresh }) {
  if (!show) return null
  const healthData = data || []
  const dbHealthData = dbData || []
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-55 backdrop-blur-sm z-[1000] flex justify-center items-start pt-[8vh]"
      role="dialog"
      aria-modal="true"
    >
      <div className="min-w-[min(760px,92%)] bg-[#071b27] border border-[#133645] rounded-[10px] shadow-[0_6px_28px_rgba(0,0,0,0.55)] text-[#e6eef8] animate-[popIn_0.25s_ease] health-modal">
        <div className="px-[14px] py-[10px] border-b border-[#12313f] flex items-center">
          <h5 className="mb-0">{t('health.title')}</h5>
        </div>
        <div className="p-[14px]">
          {loading && <div>{t('chat.status.reading')}</div>}
          {error && <div className="text-danger small">{t('tasks.status.error')}: {error}</div>}
          {!loading && !error && (
            <div className="mt-1">
              <div className="border border-[#12313f] rounded-[6px] mb-[10px] bg-[#0a2230]">
                <div className="flex items-center gap-2 px-[10px] py-[8px] font-semibold text-[0.9rem] cursor-pointer hover:bg-[#123445]" onClick={() => setContainersOpen(o=>!o)}>
                  <span className="w-[14px] text-center opacity-85">{containersOpen ? '▾':'▸'}</span>
                  <span>{t('health.containers')}</span>
                  <span className="flex-1" />
                  {healthData.length>0 && (
                    <span className="text-xs text-muted">
                      {healthData.filter(s=>s.status==='running').length} OK / {healthData.filter(s=>s.status!=='running').length} Fel
                    </span>) }
                  <button
                    aria-label="Uppdatera"
                    className="btn btn-sm btn-outline-secondary ms-2 leading-[1] px-[6px] py-[2px] text-[0.7rem] disabled:opacity-60"
                    onClick={(e)=>{e.stopPropagation(); fetchHealth();}}
                    disabled={loading}
                  >
                    {loading ? '↻' : '⟳'}
                  </button>
                </div>
                {containersOpen && (
                  <div className="px-2 pt-1 pb-2 animate-[fadeIn_0.18s_ease]">
                    <Table size="sm" variant="dark" bordered className="mb-3 health-table">
                      <thead>
                        <tr>
                          <th style={{width:'30px'}}></th>
                          <th>Namn</th>
                          <th>Status</th>
                          <th>HTTP</th>
                          <th>Latency (ms)</th>
                          <th>Kommentar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {healthData.map(svc => {
                          const ok = svc.status === 'running'
                          return (
                            <tr key={svc.key} className={ok ? 'ok-row':'fail-row'}>
                              <td>
                                <span
                                  className={`inline-block w-[14px] h-[14px] rounded-full box-shadow-[0_0_0_2px_#021118_inset,0_0_4px_rgba(0,0,0,0.4)] ${ok ? 'bg-[radial-gradient(circle_at_30%_30%,_#4dff9a,_#0f8a3e)]' : 'bg-[radial-gradient(circle_at_30%_30%,_#ff5e5e,_#9a1d21)]'}`}
                                ></span>
                              </td>
                              <td>{svc.name}</td>
                              <td>{ok ? 'OK' : 'Fel'}</td>
                              <td>{svc.http_status ?? '-'}</td>
                              <td>{svc.latency_ms ?? '-'}</td>
                              <td style={{whiteSpace:'pre-wrap'}}>{svc.message || ''}</td>
                            </tr>
                          )
                        })}
                        {healthData.length === 0 && (
                          <tr><td colSpan={6} className="text-muted text-center">{t('health.none')}</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
              <div className="border border-[#12313f] rounded-[6px] mb-[10px] bg-[#0a2230]">
                <div className="flex items-center gap-2 px-[10px] py-[8px] font-semibold text-[0.9rem] cursor-pointer hover:bg-[#123445]" onClick={() => setDatabasesOpen(o=>!o)}>
                  <span className="w-[14px] text-center opacity-85">{databasesOpen ? '▾':'▸'}</span>
                  <span>{t('health.databases')}</span>
                  <span className="flex-1" />
                  {dbHealthData.length>0 ? (
                    <span className="text-xs text-muted">
                      {dbHealthData.filter(d=>d.status==='running').length} OK / {dbHealthData.filter(d=>d.status!=='running').length} Fel
                    </span>
                  ) : (
                    <span className="text-xs text-muted">0 konfigurerade</span>
                  )}
                  <button
                    aria-label="Uppdatera"
                    className="btn btn-sm btn-outline-secondary ms-2 leading-[1] px-[6px] py-[2px] text-[0.7rem] disabled:opacity-60"
                    onClick={(e)=>{e.stopPropagation(); fetchHealth();}}
                    disabled={loading}
                  >
                    {loading ? '↻' : '⟳'}
                  </button>
                </div>
                {databasesOpen && (
                  <div className="px-2 pt-1 pb-2 animate-[fadeIn_0.18s_ease]">
                    {dbHealthData.length === 0 && (
                      <div className="text-muted small">{t('health.db.none')}</div>
                    )}
                    {dbHealthData.length > 0 && (
                      <Table size="sm" variant="dark" bordered className="mb-3 health-table">
                        <thead>
                          <tr>
                            <th style={{width:'30px'}}></th>
                            <th>Namn</th>
                            <th>Host:Port</th>
                            <th>Status</th>
                            <th>Latency (ms)</th>
                            <th>Kommentar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dbHealthData.map(db => {
                            const ok = db.status === 'running'
                            return (
                              <tr key={db.key} className={ok ? 'ok-row':'fail-row'}>
                                <td>
                                  <span
                                    className={`inline-block w-[14px] h-[14px] rounded-full box-shadow-[0_0_0_2px_#021118_inset,0_0_4px_rgba(0,0,0,0.4)] ${ok ? 'bg-[radial-gradient(circle_at_30%_30%,_#4dff9a,_#0f8a3e)]' : 'bg-[radial-gradient(circle_at_30%_30%,_#ff5e5e,_#9a1d21)]'}`}
                                  ></span>
                                </td>
                                <td>{db.name}</td>
                                <td>{db.host}:{db.port}</td>
                                <td>{ok ? 'OK' : 'Fel'}</td>
                                <td>{db.latency_ms ?? '-'}</td>
                                <td style={{whiteSpace:'pre-wrap'}}>{db.message || ''}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
            {lastHealthTs && (
              <small className="text-muted">Uppdaterad {new Intl.DateTimeFormat('sv-SE',{hour:'2-digit',minute:'2-digit'}).format(lastHealthTs)}</small>
            )}
            <Form.Check
              type="switch"
              id="auto-refresh-toggle"
              label={t('health.auto')}
              checked={autoRefresh}
              onChange={(e)=>setAutoRefresh(e.target.checked)}
              className="text-nowrap"
            />
            <div className="ms-auto d-flex gap-2">
              <Button size="sm" variant="outline-secondary" onClick={fetchHealth} disabled={loading}>{loading ? t('chat.status.reading') : t('health.update')}</Button>
              <Button size="sm" onClick={onClose}>{t('health.close')}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

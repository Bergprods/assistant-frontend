import React from 'react'
import { Table, Button, Form } from 'react-bootstrap'

export function HealthModal({ t, show, onClose, data, dbData, loading, error, containersOpen, setContainersOpen, databasesOpen, setDatabasesOpen, fetchHealth, lastHealthTs, autoRefresh, setAutoRefresh }) {
  if (!show) return null
  const healthData = data || []
  const dbHealthData = dbData || []
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card health-modal">
        <div className="modal-header d-flex align-items-center">
          <h5 className="mb-0">{t('health.title')}</h5>
        </div>
        <div className="modal-body">
          {loading && <div>{t('chat.status.reading')}</div>}
          {error && <div className="text-danger small">{t('tasks.status.error')}: {error}</div>}
          {!loading && !error && (
            <div className="health-accordion">
              <div className="accordion-section">
                <div className="acc-header" onClick={() => setContainersOpen(o=>!o)}>
                  <span className="arrow">{containersOpen ? '▾':'▸'}</span>
                  <span className="title">{t('health.containers')}</span>
                  <span className="flex-spacer" />
                  {healthData.length>0 && (
                    <span className="small text-muted">
                      {healthData.filter(s=>s.status==='running').length} OK / {healthData.filter(s=>s.status!=='running').length} Fel
                    </span>) }
                  <button aria-label="Uppdatera" className="btn btn-sm btn-outline-secondary ms-2 refresh-btn" onClick={(e)=>{e.stopPropagation(); fetchHealth();}} disabled={loading}>
                    {loading ? '↻' : '⟳'}
                  </button>
                </div>
                {containersOpen && (
                  <div className="acc-body">
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
                              <td><span className={`status-dot ${ok ? 'ok':'fail'}`}></span></td>
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
              <div className="accordion-section">
                <div className="acc-header" onClick={() => setDatabasesOpen(o=>!o)}>
                  <span className="arrow">{databasesOpen ? '▾':'▸'}</span>
                  <span className="title">{t('health.databases')}</span>
                  <span className="flex-spacer" />
                  {dbHealthData.length>0 ? (
                    <span className="small text-muted">
                      {dbHealthData.filter(d=>d.status==='running').length} OK / {dbHealthData.filter(d=>d.status!=='running').length} Fel
                    </span>
                  ) : (
                    <span className="small text-muted">0 konfigurerade</span>
                  )}
                  <button aria-label="Uppdatera" className="btn btn-sm btn-outline-secondary ms-2 refresh-btn" onClick={(e)=>{e.stopPropagation(); fetchHealth();}} disabled={loading}>
                    {loading ? '↻' : '⟳'}
                  </button>
                </div>
                {databasesOpen && (
                  <div className="acc-body">
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
                                <td><span className={`status-dot ${ok ? 'ok':'fail'}`}></span></td>
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

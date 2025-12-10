import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import TransferForm from '../components/TransForm';

type Metrics = {
  openingBalance: number;
  closingBalance: number;
  netMovement: number;
  breakdown: { purchases: number; transferIn: number; transferOut: number; assigned: number; expended: number; };
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [baseId, setBaseId] = useState(1);
  const [equipmentTypeId, setEquipmentTypeId] = useState(1);
  const [start] = useState('2023-01-01');
  const [end] = useState('2035-01-01');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const q = `?baseId=${baseId}&equipmentTypeId=${equipmentTypeId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
      const data = await apiFetch(`/movements/metrics${q}`, { method: 'GET' }) as any;
      setMetrics(data);
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label className="label">Base ID</label>
            <input className="input" type="number" value={baseId} onChange={e => setBaseId(Number(e.target.value))} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Equipment Type ID</label>
            <input className="input" type="number" value={equipmentTypeId} onChange={e => setEquipmentTypeId(Number(e.target.value))} />
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button className="btn btn-primary" onClick={load}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 12 }}>
        <div className="card">
          <div className="small">Opening Balance</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{loading ? '...' : metrics?.openingBalance ?? '--'}</div>
        </div>
        <div className="card">
          <div className="small">Net Movement</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{loading ? '...' : metrics?.netMovement ?? '--'}</div>
        </div>
        <div className="card">
          <div className="small">Closing Balance</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{loading ? '...' : metrics?.closingBalance ?? '--'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Net Movement breakdown</h3>
        {metrics ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            <div className="small">Purchases<br/><strong>{metrics.breakdown.purchases}</strong></div>
            <div className="small">Transfer In<br/><strong>{metrics.breakdown.transferIn}</strong></div>
            <div className="small">Transfer Out<br/><strong>{metrics.breakdown.transferOut}</strong></div>
            <div className="small">Assigned<br/><strong>{metrics.breakdown.assigned}</strong></div>
            <div className="small">Expended<br/><strong>{metrics.breakdown.expended}</strong></div>
          </div>
        ) : (
          <div className="small">{error ?? 'No data'}</div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Create Transfer</h3>
        <TransferForm onSuccess={() => load()} />
      </div>
    </div>
  );
}

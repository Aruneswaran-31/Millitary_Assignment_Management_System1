import React, { useState } from 'react';
import { apiFetch } from '../api/client';

export default function TransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const [equipmentTypeId, setEquipmentTypeId] = useState<number>(1);
  const [fromBaseId, setFromBaseId] = useState<number>(1);
  const [toBaseId, setToBaseId] = useState<number>(2);
  const [quantity, setQuantity] = useState<number>(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const data = await apiFetch('/transfers', {
        method: 'POST',
        body: JSON.stringify({ equipmentTypeId, fromBaseId, toBaseId, quantity })
      }) as any;
      if (data?.success) {
        setMsg(`Transfer created (id=${data.transfer?.id})`);
        onSuccess?.();
      } else {
        setMsg('Unexpected response');
      }
    } catch (err: any) {
      setMsg(err?.error || err?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Equipment Type ID</label>
        <input className="input" type="number" value={equipmentTypeId} onChange={e => setEquipmentTypeId(Number(e.target.value))} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label className="label">From Base ID</label>
          <input className="input" type="number" value={fromBaseId} onChange={e => setFromBaseId(Number(e.target.value))} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">To Base ID</label>
          <input className="input" type="number" value={toBaseId} onChange={e => setToBaseId(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="label">Quantity</label>
        <input className="input" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
      </div>

      <div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Transfer'}
        </button>
      </div>

      {msg && <div className="small" style={{ marginTop: 8 }}>{msg}</div>}
    </form>
  );
}

import React, { useState } from 'react';
import styles from './styles.module.css';

type Unit = 'mm' | 'inches';

const OFFSETS = Object.freeze({
  xrail_core: 180,
  yrail_minus_work: 316,
  ytable_minus_work: 383,
  xbelt_extra: 80,
  ybelt_extra: 100,
  xtable_extra: 126,
});

const PRESETS = [
  { label: '4′×8′', xMm: 1220, yMm: 2440 },
  { label: '4′×4′', xMm: 1220, yMm: 1220 },
  { label: '4′×2′', xMm: 610, yMm: 1220 },
];

function clip(value: number): number {
  return Math.round(value * 4) / 4;
}

function fmt(val: number, unit: Unit): string {
  const converted = unit === 'inches' ? val / 25.4 : val;
  return clip(converted).toFixed(unit === 'inches' ? 3 : 0);
}

export default function LR3Calculator(): JSX.Element {
  const [unit, setUnit] = useState<Unit>('mm');
  const [xUsableMm, setXUsableMm] = useState(1220);
  const [yUsableMm, setYUsableMm] = useState(2440);
  const [xzPlateMm, setXzPlateMm] = useState(9.5);
  const [activePreset, setActivePreset] = useState('4′×8′');

  const lbl = unit === 'mm' ? 'mm' : 'in';

  const displayX = unit === 'mm' ? Math.round(xUsableMm) : clip(xUsableMm / 25.4);
  const displayY = unit === 'mm' ? Math.round(yUsableMm) : clip(yUsableMm / 25.4);
  const displayPlate = unit === 'mm' ? parseFloat(xzPlateMm.toFixed(1)) : parseFloat((xzPlateMm / 25.4).toFixed(3));

  // Calculations
  const xrails = xUsableMm + OFFSETS.xrail_core;
  const yrail = yUsableMm + OFFSETS.yrail_minus_work;
  const xbelts = xrails + OFFSETS.xbelt_extra;
  const ybelts = yrail + OFFSETS.ybelt_extra;
  const belt_total = xbelts + 2 * ybelts;
  const strut = xrails;
  const xtable = xrails + OFFSETS.xtable_extra;
  const ytable = yUsableMm + OFFSETS.ytable_minus_work;

  function applyPreset(p: typeof PRESETS[0]) {
    setXUsableMm(p.xMm);
    setYUsableMm(p.yMm);
    setActivePreset(p.label);
  }

  function handleXChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) { setXUsableMm(unit === 'mm' ? v : v * 25.4); setActivePreset(''); }
  }

  function handleYChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) { setYUsableMm(unit === 'mm' ? v : v * 25.4); setActivePreset(''); }
  }

  function handlePlateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setXzPlateMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleReset() {
    setXUsableMm(1220);
    setYUsableMm(2440);
    setXzPlateMm(9.5);
    setActivePreset('4′×8′');
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.topBar}>
        <div className={styles.unitToggle}>
          <button
            className={`${styles.unitBtn} ${unit === 'mm' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnit('mm')}
          >mm</button>
          <button
            className={`${styles.unitBtn} ${unit === 'inches' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnit('inches')}
          >inches</button>
        </div>
        <div className={styles.presets}>
          <span className={styles.presetsLabel}>Quick pick:</span>
          {PRESETS.map(p => (
            <button
              key={p.label}
              className={`${styles.presetBtn} ${activePreset === p.label ? styles.presetBtnActive : ''}`}
              onClick={() => applyPreset(p)}
            >{p.label}</button>
          ))}
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr3-x">X cutting area (width)</label>
            <div className={styles.inputRow}>
              <input id="lr3-x" type="number" className={styles.numInput}
                value={displayX} step={unit === 'mm' ? 10 : 0.25} onChange={handleXChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr3-y">Y cutting area (length)</label>
            <div className={styles.inputRow}>
              <input id="lr3-y" type="number" className={styles.numInput}
                value={displayY} step={unit === 'mm' ? 10 : 0.25} onChange={handleYChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr3-plate">XZ Plate Thickness</label>
            <p className={styles.hint}>Printed plates are 9.5mm (0.374"). Shop aluminum plates are 6.35mm (0.25").</p>
            <div className={styles.inputRow}>
              <input id="lr3-plate" type="number" className={styles.numInput}
                value={displayPlate} step={unit === 'mm' ? 0.1 : 0.004} onChange={handlePlateChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <button className={styles.reset} onClick={handleReset}>Reset to defaults</button>
        </div>

        <div className={styles.results}>
          <div className={styles.box}>
            <div className={styles.boxTitle}>Tube Lengths</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Qty</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xrails, unit)}</td><td>2</td><td>X rails (also strut plate width)</td></tr>
                <tr><td>{fmt(yrail, unit)}</td><td>1</td><td>Y rail</td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Belt Dimensions</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Qty</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xbelts, unit)}</td><td>1</td><td>Belt length along X</td></tr>
                <tr><td>{fmt(ybelts, unit)}</td><td>2</td><td>Belt length along Y</td></tr>
                <tr><td><strong>{fmt(belt_total, unit)}</strong></td><td></td><td><strong>Total belt (all 3)</strong></td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Struts</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Qty</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(strut, unit)}</td><td>3</td><td>Strut length (same as X tube length)</td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Minimum Table Size</div>
            <p className={styles.hint}>An extra 25-50mm (1"-2") on each dimension is recommended if pushing against a wall.</p>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xtable, unit)}</td><td>X table size (width)</td></tr>
                <tr><td>{fmt(ytable, unit)}</td><td>Y table size (length)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import styles from './styles.module.css';

type Unit = 'mm' | 'inches';
type Model = 'v2' | 'old';

interface Offsets {
  xrail_minus_work: number;
  zrail_minus_work: number;
  xtable_minus_work: number;
  ytable_minus_work: number;
  zleadscrew_minus_work: number;
  xbelt_minus_rail: number;
  ybelt_minus_rail: number;
  kerf: number;
}

function getOffsets(model: Model): Offsets {
  if (model === 'old') {
    return {
      xrail_minus_work: 317.0,
      zrail_minus_work: 210,
      xtable_minus_work: 247.5,
      ytable_minus_work: 371,
      zleadscrew_minus_work: 161.0,
      xbelt_minus_rail: 69.4,
      ybelt_minus_rail: 470,
      kerf: 3,
    };
  }
  return {
    xrail_minus_work: 276.6,
    zrail_minus_work: 216,
    xtable_minus_work: 203.2,
    ytable_minus_work: 381,
    zleadscrew_minus_work: 57.15,
    xbelt_minus_rail: 300,
    ybelt_minus_rail: 420,
    kerf: 3,
  };
}

function clip(value: number): number {
  return Math.round(value * 4) / 4;
}

function fmt(val: number, unit: Unit): string {
  const converted = unit === 'inches' ? val / 25.4 : val;
  return clip(converted).toFixed(unit === 'inches' ? 3 : 0);
}

export default function LR2Calculator(): JSX.Element {
  const [unit, setUnit] = useState<Unit>('mm');
  const [model, setModel] = useState<Model>('v2');
  const [xWorkMm, setXWorkMm] = useState(1220);
  const [yWorkMm, setYWorkMm] = useState(2440);
  const [zWorkMm, setZWorkMm] = useState(89);

  const lbl = unit === 'mm' ? 'mm' : 'in';
  const offsets = getOffsets(model);

  const displayX = unit === 'mm' ? Math.round(xWorkMm) : clip(xWorkMm / 25.4);
  const displayY = unit === 'mm' ? Math.round(yWorkMm) : clip(yWorkMm / 25.4);
  const displayZ = unit === 'mm' ? Math.round(zWorkMm) : clip(zWorkMm / 25.4);

  // Calculations
  const xrails = xWorkMm + offsets.xrail_minus_work;
  const zrails = zWorkMm + offsets.zrail_minus_work;
  const rail_total = xrails * 2 + zrails * 4 + 6 * offsets.kerf;
  const leadscrew = zWorkMm + offsets.zleadscrew_minus_work;
  const xbelts = xWorkMm + offsets.xbelt_minus_rail;
  const ybelts = yWorkMm + offsets.ybelt_minus_rail;
  const belt_total = 1 * xbelts + 2 * ybelts;
  const xtable = xWorkMm + offsets.xtable_minus_work;
  const ytable = yWorkMm + offsets.ytable_minus_work;

  function handleXChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setXWorkMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleYChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setYWorkMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleZChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setZWorkMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleReset() {
    setXWorkMm(1220);
    setYWorkMm(2440);
    setZWorkMm(89);
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
      </div>

      {/* Model selection */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Model</label>
        <div className={styles.radioGroup}>
          <label>
            <input type="radio" checked={model === 'v2'} onChange={() => setModel('v2')} /> Low Rider v2
          </label>
          <label>
            <input type="radio" checked={model === 'old'} onChange={() => setModel('old')} /> Original Version
          </label>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr2-x">X workspace</label>
            <div className={styles.inputRow}>
              <input id="lr2-x" type="number" className={styles.numInput}
                value={displayX} step={unit === 'mm' ? 10 : 0.25} onChange={handleXChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr2-y">Y workspace</label>
            <div className={styles.inputRow}>
              <input id="lr2-y" type="number" className={styles.numInput}
                value={displayY} step={unit === 'mm' ? 10 : 0.25} onChange={handleYChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr2-z">Z workspace</label>
            <div className={styles.inputRow}>
              <input id="lr2-z" type="number" className={styles.numInput}
                value={displayZ} step={unit === 'mm' ? 1 : 0.25} onChange={handleZChange} />
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
                <tr><td>{fmt(xrails, unit)}</td><td>2</td><td>X rails</td></tr>
                <tr><td>{fmt(zrails, unit)}</td><td>4</td><td>Z rails</td></tr>
                <tr><td><strong>{fmt(rail_total, unit)}</strong></td><td></td><td><strong>Total tube (with 3mm kerf)</strong></td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Material Dimensions</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Qty</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(leadscrew, unit)}</td><td>2</td><td>Leadscrew length (minimum)</td></tr>
                <tr><td>{fmt(xbelts, unit)}</td><td>1</td><td>Belt length along X</td></tr>
                <tr><td>{fmt(ybelts, unit)}</td><td>2</td><td>Belt length along Y</td></tr>
                <tr><td><strong>{fmt(belt_total, unit)}</strong></td><td></td><td><strong>Total belt (all 3)</strong></td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Table Size</div>
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

import React, { useState } from 'react';
import styles from './styles.module.css';

type Unit = 'mm' | 'inches';
type Model = 'Primo' | 'Burly';
type Tool = 'Pen' | 'DW660' | '55mm';

interface Offsets {
  xrail_minus_work: number;
  xgantryrail_minus_work: number;
  yrail_minus_work: number;
  ygantryrail_minus_work: number;
  zrail_minus_work: number;
  zleg_minus_work: number;
  xtable_minus_rail: number;
  ytable_minus_rail: number;
  xbound_minus_rail: number;
  ybound_minus_rail: number;
  zbound_minus_rail_and_work: number;
  zleadscrew_minus_work: number;
  xbelt_minus_rail: number;
  ybelt_minus_rail: number;
  kerf: number;
}

function getOffsets(model: Model, tool: Tool): Offsets {
  let offsets: Offsets;

  if (model === 'Burly') {
    offsets = {
      xrail_minus_work: 264,
      xgantryrail_minus_work: 264,
      yrail_minus_work: 264,
      ygantryrail_minus_work: 264,
      zrail_minus_work: 190,
      zleg_minus_work: -13,
      xtable_minus_rail: 20,
      ytable_minus_rail: 20,
      xbound_minus_rail: 30,
      ybound_minus_rail: 30,
      zbound_minus_rail_and_work: 50,
      zleadscrew_minus_work: 76,
      xbelt_minus_rail: 136,
      ybelt_minus_rail: 136,
      kerf: 3,
    };
  } else {
    offsets = {
      xrail_minus_work: 304,
      xgantryrail_minus_work: 249,
      yrail_minus_work: 313,
      ygantryrail_minus_work: 258,
      zrail_minus_work: 190,
      zleg_minus_work: -21,
      xtable_minus_rail: -34,
      ytable_minus_rail: -34,
      xbound_minus_rail: 68,
      ybound_minus_rail: 68,
      zbound_minus_rail_and_work: 50,
      zleadscrew_minus_work: 50,
      xbelt_minus_rail: 50,
      ybelt_minus_rail: 50,
      kerf: 3,
    };
  }

  if (tool === 'DW660') {
    if (model === 'Burly') {
      offsets.xrail_minus_work += 10;
      offsets.xgantryrail_minus_work += 10;
      offsets.yrail_minus_work += 8;
      offsets.ygantryrail_minus_work += 8;
      offsets.zrail_minus_work += 2.75;
      offsets.zleg_minus_work += 2.75;
    } else {
      offsets.xrail_minus_work += 9;
      offsets.xgantryrail_minus_work += 9;
      offsets.yrail_minus_work += 9;
      offsets.ygantryrail_minus_work += 9;
      offsets.zrail_minus_work += 2.75;
      offsets.zleg_minus_work += 2.75;
    }
  } else if (tool === '55mm') {
    if (model === 'Primo') {
      offsets.xrail_minus_work += 3;
      offsets.xgantryrail_minus_work += 3;
      offsets.yrail_minus_work += 3;
      offsets.ygantryrail_minus_work += 3;
      offsets.zrail_minus_work += 2.5;
      offsets.zleg_minus_work += 2.5;
    }
  }

  return offsets;
}

function clip(value: number): number {
  return Math.round(value * 4) / 4;
}

function fmt(val: number, unit: Unit): string {
  const converted = unit === 'inches' ? val / 25.4 : val;
  return clip(converted).toFixed(unit === 'inches' ? 3 : 0);
}

export default function MPCNCCalculator(): JSX.Element {
  const [unit, setUnit] = useState<Unit>('mm');
  const [model, setModel] = useState<Model>('Primo');
  const [tool, setTool] = useState<Tool>('Pen');
  const [xWorkMm, setXWorkMm] = useState(450);
  const [yWorkMm, setYWorkMm] = useState(330);
  const [zWorkMm, setZWorkMm] = useState(81);

  const lbl = unit === 'mm' ? 'mm' : 'in';
  const offsets = getOffsets(model, tool);

  const displayX = unit === 'mm' ? Math.round(xWorkMm) : clip(xWorkMm / 25.4);
  const displayY = unit === 'mm' ? Math.round(yWorkMm) : clip(yWorkMm / 25.4);
  const displayZ = unit === 'mm' ? Math.round(zWorkMm) : clip(zWorkMm / 25.4);

  // Calculations (all in mm internally)
  const xrails = xWorkMm + offsets.xrail_minus_work;
  const xgantryrail = xWorkMm + offsets.xgantryrail_minus_work;
  const yrails = yWorkMm + offsets.yrail_minus_work;
  const ygantryrail = yWorkMm + offsets.ygantryrail_minus_work;
  const zrails = zWorkMm + offsets.zrail_minus_work;
  const zlegs = zWorkMm + offsets.zleg_minus_work;
  const rail_total = xrails * 2 + xgantryrail + yrails * 2 + ygantryrail + zrails * 2 + zlegs * 4 + 12 * offsets.kerf;
  const leadscrew = zWorkMm + offsets.zleadscrew_minus_work;
  const xbelts = xrails + offsets.xbelt_minus_rail;
  const ybelts = yrails + offsets.ybelt_minus_rail;
  const belt_total = 2 * xbelts + 2 * ybelts;
  const xtable = xrails + offsets.xtable_minus_rail;
  const ytable = yrails + offsets.ytable_minus_rail;
  const xbound = xrails + offsets.xbound_minus_rail;
  const ybound = yrails + offsets.ybound_minus_rail;
  const zbound = zWorkMm + zrails + offsets.zbound_minus_rail_and_work;
  const zbound2 = zrails * 2;

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
    setXWorkMm(450);
    setYWorkMm(330);
    setZWorkMm(81);
  }

  return (
    <div className={styles.calculator}>
      {/* Unit toggle */}
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
            <input type="radio" checked={model === 'Primo'} onChange={() => setModel('Primo')} /> Primo
          </label>
          <label>
            <input type="radio" checked={model === 'Burly'} onChange={() => setModel('Burly')} /> Burly
          </label>
        </div>
      </div>

      {/* Tool selection */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Tool Choice</label>
        <div className={styles.radioGroup}>
          <label>
            <input type="radio" checked={tool === 'Pen'} onChange={() => setTool('Pen')} /> Full range (pen, laser, drag knife, Makita RT70x)
          </label>
          <label>
            <input type="radio" checked={tool === 'DW660'} onChange={() => setTool('DW660')} /> Dewalt DW660
          </label>
          <label>
            <input type="radio" checked={tool === '55mm'} onChange={() => setTool('55mm')} /> 52mm &amp; 55mm Spindle
          </label>
        </div>
        <p className={styles.hint}>Larger tools may collide with the side rails and restrict movement before the MPCNC reaches its full range of motion.</p>
      </div>

      <div className={styles.layout}>
        {/* Inputs */}
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="mpcnc-x">X workspace</label>
            <div className={styles.inputRow}>
              <input id="mpcnc-x" type="number" className={styles.numInput}
                value={displayX} step={unit === 'mm' ? 10 : 0.25} onChange={handleXChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="mpcnc-y">Y workspace</label>
            <div className={styles.inputRow}>
              <input id="mpcnc-y" type="number" className={styles.numInput}
                value={displayY} step={unit === 'mm' ? 10 : 0.25} onChange={handleYChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="mpcnc-z">Z workspace</label>
            <div className={styles.inputRow}>
              <input id="mpcnc-z" type="number" className={styles.numInput}
                value={displayZ} step={unit === 'mm' ? 1 : 0.25} onChange={handleZChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <button className={styles.reset} onClick={handleReset}>Reset to defaults</button>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.box}>
            <div className={styles.boxTitle}>Tube Lengths</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Qty</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xrails, unit)}</td><td>2</td><td>X rails, sides</td></tr>
                <tr><td>{fmt(xgantryrail, unit)}</td><td>1</td><td>X rail, gantry</td></tr>
                <tr><td>{fmt(yrails, unit)}</td><td>2</td><td>Y rails, sides</td></tr>
                <tr><td>{fmt(ygantryrail, unit)}</td><td>1</td><td>Y rail, gantry</td></tr>
                <tr><td>{fmt(zrails, unit)}</td><td>2</td><td>Z rails</td></tr>
                <tr><td>{fmt(zlegs, unit)}</td><td>4</td><td>Legs</td></tr>
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
                <tr><td>{fmt(leadscrew, unit)}</td><td>1</td><td>Leadscrew length</td></tr>
                <tr><td>{fmt(xbelts, unit)}</td><td>2</td><td>Belt length along X</td></tr>
                <tr><td>{fmt(ybelts, unit)}</td><td>2</td><td>Belt length along Y</td></tr>
                <tr><td><strong>{fmt(belt_total, unit)}</strong></td><td></td><td><strong>Total belt (all 4)</strong></td></tr>
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
                <tr><td>{fmt(xtable, unit)}</td><td>X table size (outer edges of feet)</td></tr>
                <tr><td>{fmt(ytable, unit)}</td><td>Y table size (outer edges of feet)</td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Total Machine Footprint</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xbound, unit)}</td><td>X</td></tr>
                <tr><td>{fmt(ybound, unit)}</td><td>Y</td></tr>
                <tr><td>{fmt(zbound, unit)}</td><td>Z</td></tr>
                <tr><td>{fmt(zbound2, unit)}</td><td>Clearance to remove Z axis</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

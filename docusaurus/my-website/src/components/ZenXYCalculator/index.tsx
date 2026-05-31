import React, { useState } from 'react';
import styles from './styles.module.css';

type Unit = 'mm' | 'inches';

interface Offsets {
  xrail_offset: number;
  yrail_offset: number;
  xwork_offset: number;
  ywork_offset: number;
  extra_belt: number;
}

function getOffsets(): Offsets {
  return {
    xrail_offset: 96,
    yrail_offset: 92.5,
    xwork_offset: 184,
    ywork_offset: 184,
    extra_belt: 200,
  };
}

function clip(value: number, unit: Unit): number {
  if (unit === 'inches') {
    return Math.round(value * 4) / 4;
  }
  return Math.round(value * 10) / 10;
}

function fmt(valueMm: number, unit: Unit): string {
  const converted = unit === 'inches' ? valueMm / 25.4 : valueMm;
  return clip(converted, unit).toFixed(unit === 'inches' ? 2 : 1);
}

export default function ZenXYCalculator(): JSX.Element {
  const [unit, setUnit] = useState<Unit>('mm');
  const [xFootprintMm, setXFootprintMm] = useState(550);
  const [yFootprintMm, setYFootprintMm] = useState(600);
  const [ballDiameterMm, setBallDiameterMm] = useState(12.7);

  const offsets = getOffsets();

  // Display values in the current unit
  const displayX = unit === 'mm' ? clip(xFootprintMm, unit) : clip(xFootprintMm / 25.4, unit);
  const displayY = unit === 'mm' ? clip(yFootprintMm, unit) : clip(yFootprintMm / 25.4, unit);
  const displayBall = unit === 'mm' ? clip(ballDiameterMm, unit) : clip(ballDiameterMm / 25.4, unit);

  // Calculations (all in mm internally)
  const xrails = xFootprintMm - offsets.xrail_offset;
  const yrails = yFootprintMm - offsets.yrail_offset;
  const belt = xrails * 4 + yrails * 4 + offsets.extra_belt;

  const xarea = xFootprintMm - offsets.xwork_offset;
  const yarea = yFootprintMm - offsets.ywork_offset;
  const xballarea = xarea + ballDiameterMm;
  const yballarea = yarea + ballDiameterMm;

  const lbl = unit === 'mm' ? 'mm' : 'in';

  function handleXChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setXFootprintMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleYChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setYFootprintMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleBallChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setBallDiameterMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleReset() {
    setXFootprintMm(550);
    setYFootprintMm(600);
    setBallDiameterMm(12.7);
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

      <div className={styles.layout}>
        {/* Inputs */}
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="zenxy-x">X Footprint (Left / Right)</label>
            <div className={styles.inputRow}>
              <input id="zenxy-x" type="number" className={styles.numInput}
                value={displayX} step={unit === 'mm' ? 10 : 0.25} onChange={handleXChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="zenxy-y">Y Footprint (Forward / Back)</label>
            <div className={styles.inputRow}>
              <input id="zenxy-y" type="number" className={styles.numInput}
                value={displayY} step={unit === 'mm' ? 10 : 0.25} onChange={handleYChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="zenxy-ball">Ball Diameter</label>
            <div className={styles.inputRow}>
              <input id="zenxy-ball" type="number" className={styles.numInput}
                value={displayBall} step={unit === 'mm' ? 0.25 : 0.125} onChange={handleBallChange} />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>
          <button className={styles.reset} onClick={handleReset}>Reset to defaults</button>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.box}>
            <div className={styles.boxTitle}>Part Lengths</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Qty</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xrails, unit)}</td><td>2</td><td>X rails, small</td></tr>
                <tr><td>{fmt(yrails, unit)}</td><td>2</td><td>Y rails, large</td></tr>
                <tr><td>{fmt(belt, unit)}</td><td>1</td><td>Belt length</td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.box}>
            <div className={styles.boxTitle}>Work Area</div>
            <table className={styles.resultTable}>
              <thead>
                <tr><th>Length ({lbl})</th><th>Name</th></tr>
              </thead>
              <tbody>
                <tr><td>{fmt(xarea, unit)}</td><td>X image dimensions</td></tr>
                <tr><td>{fmt(xballarea, unit)}</td><td>X actual area needed</td></tr>
                <tr><td>{fmt(yarea, unit)}</td><td>Y image dimensions</td></tr>
                <tr><td>{fmt(yballarea, unit)}</td><td>Y actual area needed</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

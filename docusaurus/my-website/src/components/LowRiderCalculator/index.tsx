import React, { useState } from 'react';
import styles from './styles.module.css';

const OFFSETS = Object.freeze({
  xrail_core: 169,
  yrail_minus_work: 255,
  ytable_minus_work: 313,
  xbelt_extra: 180,
  ybelt_extra: 200,
  xtable_extra: 110,
  xrail_cushion: 3,
});

type Unit = 'mm' | 'inches';

const PRESETS = [
  { label: '4′×8′', xMm: 1220, yMm: 2440 },
  { label: '4′×4′', xMm: 1220, yMm: 1220 },
  { label: '4′×2′', xMm: 610,  yMm: 1220 },
  { label: 'A0',    xMm: 841,  yMm: 1189 },
  { label: 'A1',    xMm: 594,  yMm: 841  },
];

function roundUpTo8th(val: number): number {
  return Math.ceil(val * 8) / 8;
}

function roundTo8th(val: number): number {
  return Math.round(val * 8) / 8;
}

function toDisplay(val: number, unit: Unit): number {
  return unit === 'inches' ? val / 25.4 : val;
}

function fmt(val: number, unit: Unit): string {
  return roundUpTo8th(toDisplay(val, unit)).toFixed(unit === 'inches' ? 3 : 0);
}

function fmtXRails(xstrut: number, unit: Unit): string {
  const v = roundUpTo8th(toDisplay(xstrut, unit));
  const c = roundUpTo8th(toDisplay(OFFSETS.xrail_cushion, unit));
  return (v - c).toFixed(unit === 'inches' ? 3 : 0);
}

function fmtStrut(xstrut: number, unit: Unit): string {
  return roundUpTo8th(toDisplay(xstrut, unit)).toFixed(unit === 'inches' ? 3 : 0);
}

export default function LowRiderCalculator(): JSX.Element {
  const [unit, setUnit]           = useState<Unit>('mm');
  const [xUsableMm, setXUsableMm] = useState(1220);
  const [yUsableMm, setYUsableMm] = useState(2440);
  const [xThicknessMm, setXThicknessMm] = useState(6.5);
  const [activePreset, setActivePreset] = useState<string>('4′×8′');

  const lbl = unit === 'mm' ? 'mm' : 'in';

  const displayX = unit === 'mm' ? Math.ceil(xUsableMm) : roundTo8th(xUsableMm / 25.4);
  const displayY = unit === 'mm' ? Math.ceil(yUsableMm) : roundTo8th(yUsableMm / 25.4);
  const displayThick =
    unit === 'mm'
      ? parseFloat(xThicknessMm.toFixed(2))
      : parseFloat((xThicknessMm / 25.4).toFixed(3));

  const xstrut   = Math.ceil(xUsableMm + OFFSETS.xrail_core);
  const xbelts   = xstrut + OFFSETS.xbelt_extra;
  const xtable   = xstrut + 2 * xThicknessMm + OFFSETS.xtable_extra;
  const yrail    = yUsableMm + OFFSETS.yrail_minus_work;
  const ybelts   = yrail + OFFSETS.ybelt_extra;
  const ytable   = yUsableMm + OFFSETS.ytable_minus_work;
  const beltTotal = xbelts + 2 * ybelts;

  const axisWarning = xUsableMm > yUsableMm;

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

  function handleThickChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setXThicknessMm(unit === 'mm' ? v : v * 25.4);
  }

  function handleReset() {
    setXUsableMm(1220);
    setYUsableMm(2440);
    setXThicknessMm(6.5);
    setActivePreset('4′×8′');
  }

  return (
    <div className={styles.calculator}>

      {/* ── Top bar: unit toggle + presets ── */}
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

        {/* ── Inputs ── */}
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr-x">
              X axis
              <span className={styles.axisHint}>shorter side — beam</span>
            </label>
            <div className={styles.inputRow}>
              <input
                id="lr-x"
                type="number"
                className={styles.numInput}
                value={displayX}
                step={unit === 'mm' ? 10 : 0.125}
                onChange={handleXChange}
              />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="lr-y">
              Y axis
              <span className={styles.axisHint}>longer side — rail</span>
            </label>
            <div className={styles.inputRow}>
              <input
                id="lr-y"
                type="number"
                className={styles.numInput}
                value={displayY}
                step={unit === 'mm' ? 10 : 0.125}
                onChange={handleYChange}
              />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </div>

          {axisWarning && (
            <p className={styles.warning}>
              ⚠ X should be the shorter axis. Consider swapping X and Y.
            </p>
          )}

          <details className={styles.advanced}>
            <summary className={styles.advancedSummary}>XZ Plate Thickness</summary>
            <p className={styles.advancedHint}>
              Leave at 6.5 mm unless you are using custom plates.
              Shop aluminum plates are 6.5 mm (0.256 in).
            </p>
            <div className={styles.inputRow}>
              <input
                type="number"
                className={styles.numInput}
                value={displayThick}
                step={unit === 'mm' ? 0.1 : 0.004}
                onChange={handleThickChange}
              />
              <span className={styles.unitLabel}>{lbl}</span>
            </div>
          </details>

          <button className={styles.reset} onClick={handleReset}>
            Reset to defaults
          </button>
        </div>

        {/* ── Results ── */}
        <div className={styles.results}>

          {/* Rail + strut cards */}
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardValue}>{fmtXRails(xstrut, unit)}</div>
              <div className={styles.cardUnit}>{lbl}</div>
              <div className={styles.cardName}>X Rails</div>
              <div className={styles.cardQty}>× 2</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardValue}>{fmt(yrail, unit)}</div>
              <div className={styles.cardUnit}>{lbl}</div>
              <div className={styles.cardName}>Y Rail</div>
              <div className={styles.cardQty}>× 1</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardValue}>{fmtStrut(xstrut, unit)}</div>
              <div className={styles.cardUnit}>{lbl}</div>
              <div className={styles.cardName}>Strut Plates</div>
              <div className={styles.cardQty}>× 2</div>
            </div>
          </div>

          {/* Belt box */}
          <div className={styles.box}>
            <div className={styles.boxTitle}>Belt — GT2 10 mm</div>
            <div className={styles.beltRows}>
              <div className={styles.beltRow}>
                <span className={styles.beltName}>X belt</span>
                <span className={styles.beltQty}>× 1</span>
                <span className={styles.beltVal}>{fmt(xbelts, unit)} {lbl}</span>
              </div>
              <div className={styles.beltRow}>
                <span className={styles.beltName}>Y belt</span>
                <span className={styles.beltQty}>× 2</span>
                <span className={styles.beltVal}>{fmt(ybelts, unit)} {lbl}</span>
              </div>
              <div className={styles.beltTotal}>
                <span className={styles.beltTotalLabel}>Total to order</span>
                <span className={styles.beltTotalVal}>{fmt(beltTotal, unit)} {lbl}</span>
              </div>
            </div>
          </div>

          {/* Table box */}
          <div className={styles.box}>
            <div className={styles.boxTitle}>Minimum Table Size</div>
            <p className={styles.boxHint}>
              Belt holders flush with outside corners — add 25–50 mm (1–2 in) per side for clearance.
            </p>
            <div className={styles.tableDims}>
              <div className={styles.tableDim}>
                <span className={styles.tableDimVal}>{fmt(xtable, unit)}</span>
                <span className={styles.tableDimUnit}>{lbl}</span>
                <span className={styles.tableDimAxis}>X (width)</span>
              </div>
              <span className={styles.tableCross}>×</span>
              <div className={styles.tableDim}>
                <span className={styles.tableDimVal}>{fmt(ytable, unit)}</span>
                <span className={styles.tableDimUnit}>{lbl}</span>
                <span className={styles.tableDimAxis}>Y (length)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

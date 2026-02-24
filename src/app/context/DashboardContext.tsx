import React, {
  createContext, useContext, useState, useMemo, useCallback, ReactNode,
} from 'react';
import { MOCK_DATA, DATA_START, DATA_END, DailyRecord } from '../data/mockData';

// ─── Historical offsets ───────────────────────────────────────
const OLD_MH   = 829_914;
const HIST_FAC = 7;
const HIST_MTC = 3;
const HIST_NM  = 7;
const HIST_SC  = 539;
const HIST_HTR = 3_471;
const HIST_HSEM = 58;
const HIST_PTW = 3_992;
const HIST_AUD = 3;
const HIST_DRL = 38;
const LTI_FREE_START = new Date(2023, 8, 23); // Sep 23 2023

export type Preset = 'all' | '2026' | '2025' | '2024' | '6m' | '1m' | '7d' | 'custom';

export interface DateRange { start: Date; end: Date; }

export interface Metrics {
  // Personnel
  OP: number; SP: number; CP: number; CV: number; TP: number;
  // Manhours
  TMH: number; CombMH: number;
  // LTI free
  LTID: number;
  // Lagging
  Fat: number; LTI: number; MTC: number; RWC: number; FAC: number;
  OI: number; LTA: number; ATA: number; FireN: number; PD: number;
  NM: number; TPA: number; EC: number; LWD: number; TRC: number; UAC: number;
  // Combined lagging
  CombLTI: number; CombFAC: number; CombMTC: number; CombNM: number;
  // Rates
  LTIFR: string; TRCFR: string; LTSR: string;
  // Leading
  SC: number; HTR: number; PJSM: number; HSEM: number; HSEI: number;
  TBM: number; Drl: number; PreM: number; PerM: number; Ins: number; Aud: number;
  PTWC: number; PTWH: number; PNHF: number; PTWTot: number;
  // Combined leading
  CombSC: number; CombHTR: number; CombHSEM: number; CombPTW: number;
  CombAud: number; CombDrl: number;
  // Environmental
  PW: number; OW: number; GL: number; DL: number; OFL: number;
  SW: number; WW: number; GM3: number;
  TotalWater: number; TotalFuel: number;
  // Analysis ratios
  TotReac: number; TotProac: number; LLRatio: string; LLBarPct: number;
}

export interface MonthlyPoint {
  month: string; // "Jan 24"
  TMH: number;
  OP: number; SP: number; CP: number; CV: number;
  NM: number; MTC: number; FAC: number; UAC: number;
}

interface DashboardCtx {
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
  preset: Preset;
  setPreset: (p: Preset) => void;
  metrics: Metrics;
  monthly: MonthlyPoint[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Ctx = createContext<DashboardCtx | null>(null);

function fmt(n: number, dec = 4) {
  return n.toFixed(dec);
}

function sumField(rows: DailyRecord[], key: keyof DailyRecord): number {
  return rows.reduce((acc, r) => acc + (r[key] as number), 0);
}

function computeMetrics(rows: DailyRecord[]): Metrics {
  const OP  = sumField(rows, 'OfficePersonnelNumber');
  const SP  = sumField(rows, 'SitePersonnelNumber');
  const CP  = sumField(rows, 'ContractorsPersonnelNumber');
  const CV  = sumField(rows, 'ClientVisitorNumber');
  const TP  = OP + SP + CP + CV;

  const TMH = rows.reduce((acc, r) =>
    acc + r.OfficePersonnelNumber * 9 +
    (r.SitePersonnelNumber + r.ContractorsPersonnelNumber + r.ClientVisitorNumber) * 12, 0);
  const CombMH = TMH + OLD_MH;

  const today = new Date();
  const LTID = Math.floor((today.getTime() - LTI_FREE_START.getTime()) / 86_400_000);

  const Fat   = sumField(rows, 'Fatality');
  const LTI   = sumField(rows, 'LOSTTimeInjury');
  const MTC   = sumField(rows, 'MedicalTreatmentCase');
  const RWC   = sumField(rows, 'RestrictedWorkCase');
  const FAC   = sumField(rows, 'FirstAidCase');
  const OI    = sumField(rows, 'OccupationalIllness');
  const LTA   = sumField(rows, 'LandTransportAccident');
  const ATA   = sumField(rows, 'AirTransportAccident');
  const FireN = sumField(rows, 'Fire');
  const PD    = sumField(rows, 'PropertyDamage');
  const NM    = sumField(rows, 'NearMiss');
  const TPA   = sumField(rows, 'ThirdPartyAccident');
  const EC    = sumField(rows, 'EnvironmentalCases');
  const LWD   = sumField(rows, 'LostWorkCaseDays');
  const TRC   = sumField(rows, 'TotalRecordableCase');
  const UAC   = sumField(rows, 'UnsafeActConditionAnomaly');

  const CombLTI = LTI;
  const CombFAC = FAC + HIST_FAC;
  const CombMTC = MTC + HIST_MTC;
  const CombNM  = NM  + HIST_NM;

  const denom = CombMH === 0 ? 1 : CombMH;
  const LTIFR = fmt(CombLTI * 200_000 / denom);
  const TRCFR = fmt(TRC     * 200_000 / denom);
  const LTSR  = fmt(LWD     * 200_000 / denom);

  const SC   = sumField(rows, 'StopSmartCard');
  const HTR  = sumField(rows, 'TrainingManHour');
  const PJSM = sumField(rows, 'PreJobSafetyMeeting');
  const HSEM = sumField(rows, 'HSEMeeting');
  const HSEI = sumField(rows, 'HSEInduction');
  const TBM  = sumField(rows, 'ToolBoxMeeting');
  const Drl  = sumField(rows, 'HSEDrillExercise');
  const PreM = sumField(rows, 'PreEmployementMedicalExamination');
  const PerM = sumField(rows, 'PeriodicalMedicalExamination');
  const Ins  = sumField(rows, 'Inspection');
  const Aud  = sumField(rows, 'Audit');
  const PTWC = sumField(rows, 'PTWCold');
  const PTWH = sumField(rows, 'PTWHot');
  const PNHF = sumField(rows, 'PTWHNF');
  const PTWTot = PTWC + PTWH + PNHF;

  const CombSC   = SC   + HIST_SC;
  const CombHTR  = HTR  + HIST_HTR;
  const CombHSEM = HSEM + HIST_HSEM;
  const CombPTW  = PTWTot + HIST_PTW;
  const CombAud  = Aud  + HIST_AUD;
  const CombDrl  = Drl  + HIST_DRL;

  const PW  = sumField(rows, 'PotableWaterLiter');
  const OW  = sumField(rows, 'WaterForOperationLiter');
  const GL  = sumField(rows, 'GasolineLiter');
  const DL  = sumField(rows, 'DieselLiter');
  const OFL = sumField(rows, 'OtherLiquidFuelLiter');
  const SW  = sumField(rows, 'SolidWasteKg');
  const WW  = sumField(rows, 'WasteWaterLiter');
  const GM3 = sumField(rows, 'GASM3');
  const TotalWater = PW + OW;
  const TotalFuel  = GL + DL + OFL;

  const TotReac  = Fat+LTI+MTC+RWC+FAC+OI+LTA+ATA+FireN+PD+NM+TPA+EC;
  const TotProac = SC+PJSM+HSEM+HSEI+TBM+Drl+Ins+Aud+PTWTot;
  const LLRatio  = TotReac === 0 ? '∞' : (TotProac / TotReac).toFixed(0);
  const total    = TotProac + TotReac;
  const LLBarPct = total === 0 ? 0 : Math.min(Math.round((TotProac / total) * 100), 100);

  return {
    OP, SP, CP, CV, TP, TMH, CombMH, LTID,
    Fat, LTI, MTC, RWC, FAC, OI, LTA, ATA, FireN, PD, NM, TPA, EC, LWD, TRC, UAC,
    CombLTI, CombFAC, CombMTC, CombNM,
    LTIFR, TRCFR, LTSR,
    SC, HTR, PJSM, HSEM, HSEI, TBM, Drl, PreM, PerM, Ins, Aud,
    PTWC, PTWH, PNHF, PTWTot,
    CombSC, CombHTR, CombHSEM, CombPTW, CombAud, CombDrl,
    PW, OW, GL, DL, OFL, SW, WW, GM3, TotalWater, TotalFuel,
    TotReac, TotProac, LLRatio, LLBarPct,
  };
}

function buildMonthly(rows: DailyRecord[]): MonthlyPoint[] {
  const map = new Map<string, DailyRecord[]>();
  rows.forEach(r => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  });
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return Array.from(map.entries())
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([key, recs]) => {
      const [yr, mo] = key.split('-');
      const label = `${monthNames[parseInt(mo)-1]} ${yr.slice(2)}`;
      return {
        month: label,
        TMH:  Math.round(sumField(recs, 'OfficePersonnelNumber') * 9 +
              (sumField(recs,'SitePersonnelNumber') + sumField(recs,'ContractorsPersonnelNumber') +
               sumField(recs,'ClientVisitorNumber')) * 12),
        OP:   Math.round(sumField(recs,'OfficePersonnelNumber') / recs.length),
        SP:   Math.round(sumField(recs,'SitePersonnelNumber') / recs.length),
        CP:   Math.round(sumField(recs,'ContractorsPersonnelNumber') / recs.length),
        CV:   Math.round(sumField(recs,'ClientVisitorNumber') / recs.length),
        NM:   sumField(recs,'NearMiss'),
        MTC:  sumField(recs,'MedicalTreatmentCase'),
        FAC:  sumField(recs,'FirstAidCase'),
        UAC:  sumField(recs,'UnsafeActConditionAnomaly'),
      };
    });
}

function filterRows(start: Date, end: Date): DailyRecord[] {
  const s = start.toISOString().split('T')[0];
  const e = end.toISOString().split('T')[0];
  return MOCK_DATA.filter(r => r.date >= s && r.date <= e);
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<Preset>('all');
  const [customRange, setCustomRange] = useState<DateRange>({ start: DATA_START, end: DATA_END });
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const dateRange = useMemo<DateRange>(() => {
    const now = DATA_END;
    switch (preset) {
      case '2026': return { start: new Date(2026,0,1), end: new Date(2026,1,24) };
      case '2025': return { start: new Date(2025,0,1), end: new Date(2025,11,31) };
      case '2024': return { start: new Date(2024,0,1), end: new Date(2024,11,31) };
      case '6m': {
        const s = new Date(now); s.setMonth(s.getMonth()-6);
        return { start: s, end: now };
      }
      case '1m': {
        const s = new Date(now); s.setMonth(s.getMonth()-1);
        return { start: s, end: now };
      }
      case '7d': {
        const s = new Date(now); s.setDate(s.getDate()-7);
        return { start: s, end: now };
      }
      case 'custom': return customRange;
      default: return { start: DATA_START, end: DATA_END };
    }
  }, [preset, customRange]);

  const setDateRange = useCallback((r: DateRange) => {
    setCustomRange(r);
    setPreset('custom');
  }, []);

  const rows = useMemo(() => filterRows(dateRange.start, dateRange.end), [dateRange]);
  const metrics = useMemo(() => computeMetrics(rows), [rows]);
  const monthly = useMemo(() => buildMonthly(rows), [rows]);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);
  const toggleSidebar  = useCallback(() => setSidebarOpen(o => !o), []);

  return (
    <Ctx.Provider value={{ dateRange, setDateRange, preset, setPreset, metrics, monthly,
      darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}

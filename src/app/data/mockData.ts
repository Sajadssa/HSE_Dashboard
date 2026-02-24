export interface DailyRecord {
  date: string;
  OfficePersonnelNumber: number;
  SitePersonnelNumber: number;
  ContractorsPersonnelNumber: number;
  ClientVisitorNumber: number;
  Fatality: number;
  LOSTTimeInjury: number;
  MedicalTreatmentCase: number;
  RestrictedWorkCase: number;
  FirstAidCase: number;
  OccupationalIllness: number;
  LandTransportAccident: number;
  AirTransportAccident: number;
  Fire: number;
  PropertyDamage: number;
  NearMiss: number;
  ThirdPartyAccident: number;
  EnvironmentalCases: number;
  LostWorkCaseDays: number;
  TotalRecordableCase: number;
  UnsafeActConditionAnomaly: number;
  StopSmartCard: number;
  TrainingManHour: number;
  PreJobSafetyMeeting: number;
  HSEMeeting: number;
  HSEInduction: number;
  ToolBoxMeeting: number;
  HSEDrillExercise: number;
  PreEmployementMedicalExamination: number;
  PeriodicalMedicalExamination: number;
  Inspection: number;
  Audit: number;
  PTWCold: number;
  PTWHot: number;
  PTWHNF: number;
  PotableWaterLiter: number;
  WaterForOperationLiter: number;
  GasolineLiter: number;
  DieselLiter: number;
  OtherLiquidFuelLiter: number;
  SolidWasteKg: number;
  WasteWaterLiter: number;
  GASM3: number;
}

class SeededRNG {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0; }
  next(): number {
    this.s = (Math.imul(this.s, 69069) + 1) >>> 0;
    return this.s / 0x100000000;
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  bool(p: number): boolean { return this.next() < p; }
}

function buildDateList(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  while (d <= end) {
    dates.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function generateMockData(): DailyRecord[] {
  const rng = new SeededRNG(98765);
  const dates = buildDateList(new Date(2023, 0, 1), new Date(2026, 1, 24));

  return dates.map((date) => {
    const hasFAC = rng.bool(0.005);
    const hasMTC = rng.bool(0.003);
    const hasNM  = rng.bool(0.007);
    const hasRWC = rng.bool(0.0015);
    const hasPD  = rng.bool(0.002);
    const hasUAC = rng.bool(0.35);

    const office      = rng.int(60, 90);
    const site        = rng.int(260, 390);
    const contractors = rng.int(170, 280);
    const visitors    = rng.int(2, 20);

    return {
      date,
      OfficePersonnelNumber: office,
      SitePersonnelNumber: site,
      ContractorsPersonnelNumber: contractors,
      ClientVisitorNumber: visitors,
      Fatality: 0,
      LOSTTimeInjury: 0,
      MedicalTreatmentCase: hasMTC ? 1 : 0,
      RestrictedWorkCase: hasRWC ? 1 : 0,
      FirstAidCase: hasFAC ? 1 : 0,
      OccupationalIllness: 0,
      LandTransportAccident: 0,
      AirTransportAccident: 0,
      Fire: 0,
      PropertyDamage: hasPD ? 1 : 0,
      NearMiss: hasNM ? 1 : 0,
      ThirdPartyAccident: 0,
      EnvironmentalCases: 0,
      LostWorkCaseDays: 0,
      TotalRecordableCase: hasMTC ? 1 : 0,
      UnsafeActConditionAnomaly: hasUAC ? rng.int(1, 4) : 0,
      StopSmartCard: rng.int(3, 13),
      TrainingManHour: rng.bool(0.72) ? rng.int(12, 68) : 0,
      PreJobSafetyMeeting: rng.int(5, 24),
      HSEMeeting: rng.bool(0.13) ? rng.int(1, 3) : 0,
      HSEInduction: rng.bool(0.2) ? rng.int(1, 6) : 0,
      ToolBoxMeeting: rng.int(6, 26),
      HSEDrillExercise: rng.bool(0.045) ? 1 : 0,
      PreEmployementMedicalExamination: rng.bool(0.1) ? rng.int(1, 4) : 0,
      PeriodicalMedicalExamination: rng.bool(0.08) ? rng.int(1, 5) : 0,
      Inspection: rng.bool(0.3) ? rng.int(1, 3) : 0,
      Audit: rng.bool(0.02) ? 1 : 0,
      PTWCold: rng.int(10, 34),
      PTWHot: rng.int(4, 20),
      PTWHNF: rng.int(2, 11),
      PotableWaterLiter: rng.int(3200, 8000),
      WaterForOperationLiter: rng.int(11000, 28000),
      GasolineLiter: rng.int(550, 1700),
      DieselLiter: rng.int(3200, 9500),
      OtherLiquidFuelLiter: rng.int(180, 750),
      SolidWasteKg: rng.int(110, 500),
      WasteWaterLiter: rng.int(2000, 7000),
      GASM3: rng.int(550, 2400),
    };
  });
}

export const MOCK_DATA: DailyRecord[] = generateMockData();
export const DATA_START = new Date(2023, 0, 1);
export const DATA_END   = new Date(2026, 1, 24);

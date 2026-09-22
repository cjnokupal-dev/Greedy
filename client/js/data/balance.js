// GREEDY — all tunable numbers
export const BALANCE = {
  economy: {
    startMoney: 100,
    currencySymbol: "$",
    bankruptcyThreshold: -5000,
    globalIncomeMult: 1.0,
    costGrowthPerUnit: 0.15,
    sellRefundRate: 0.6,
    operatingCostRate: 0.05,
    tickIntervalMs: 1000,     // ms per tick
    ticksPerDay: 60           // ticks = 1 day
  },
  greed: {
    max: 100, start: 0,
    gainPerIncome: 0.02,
    gainPerPurchase: 1,
    decayPerDay: 2,
    reliefPerBigSpend: 1,
    dangerThreshold: 30,
    highRiskThreshold: 60,
    criticalThreshold: 85,
    maxIncomeBonus: 1.5,
    reputationDrainPerGreed: 0.1
  },
  reputation: {
    max: 100, start: 50, min: 0,
    drainPerGreedPoint: 0.1,
    gainPerCleanDay: 2,
    hostileThreshold: 20
  },
  health: {
    max: 100, start: 100,
    drainPerGreedAbove50: 0.3,
    lossPerHostileEvent: 5,
    regenPerCalmDay: 1,
    exhaustionThreshold: 25
  },
  heat: {
    max: 100, start: 0,
    gainPerShadyDeal: 3,
    gainPerDayHighGreed: 1,
    decayPerDay: 2,
    auditThreshold: 50,
    seizureThreshold: 80
  },
  events: {
    baseChancePerDay: 0.15,
    greedBonusChance: 0.005,
    maxPerDay: 2,
    hostileCooldownDays: 3
  },
  taxes: {
    enabled: true,
    brackets: [
      { upTo: 1000, rate: 0.00 },
      { upTo: 10000, rate: 0.10 },
      { upTo: 100000, rate: 0.20 },
      { upTo: 1000000, rate: 0.30 },
      { upTo: Infinity, rate: 0.40 }
    ],
    taxIntervalDays: 30,
    unpaidPenaltyGreed: 5,
    unpaidPenaltyHeat: 10
  },
  loans: {
    enabled: true,
    maxLoanToNetWorthRatio: 0.5,
    dailyInterestRate: 0.01,
    minPaymentRate: 0.02,
    missedPaymentHeat: 5,
    missedPaymentReputation: -3
  },
  employees: {
    baseWage: 20,
    incomeBonusPerEmployee: 0.05,
    greedResistancePerEmployee: 0.02,
    moraleLossIfUnpaid: 10,
    moraleQuitThreshold: 20
  },
  prestige: {
    enabled: true,
    minNetWorth: 1000000,
    gainMultiplier: 1.0,
    bonusPerPoint: 0.05,
    keepPrestigePoints: true
  },
  limits: { logEntries: 200, saveSlots: 3 },
  persistence: {
    storageKey: "greedy_save_v1",
    autosaveEnabled: true,
    autosaveEveryNDays: 5
  },
  difficulty: {
    easy:   { greedMult: 0.5, eventMult: 0.7, taxMult: 0.8 },
    normal: { greedMult: 1.0, eventMult: 1.0, taxMult: 1.0 },
    hard:   { greedMult: 1.5, eventMult: 1.3, taxMult: 1.2 },
    brutal: { greedMult: 2.0, eventMult: 1.6, taxMult: 1.5 },
    default: "normal"
  }
};

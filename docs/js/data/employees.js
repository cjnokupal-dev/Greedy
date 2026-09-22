// GREEDY — hireable staff
export const EMPLOYEES = [
  { id: "cashier", name: "Cashier", wage: 15,
    desc: "+3% business income", incomeBonus: 0.03, unlockAt: { day: 2 } },
  { id: "manager", name: "Manager", wage: 60,
    desc: "+8% income, -0.5 heat/day", incomeBonus: 0.08, heatPerDay: -0.5,
    unlockAt: { day: 6 } },
  { id: "accountant", name: "Accountant", wage: 120,
    desc: "-5% tax", taxMult: 0.95, unlockAt: { day: 10 } },
  { id: "security", name: "Security Guard", wage: 200,
    desc: "-30% robbery chance", eventDebuff: { robbery: 0.7 },
    unlockAt: { day: 14 } },
  { id: "lawyer", name: "Lawyer", wage: 400,
    desc: "-15% lawsuit chance", eventDebuff: { lawsuit: 0.85 },
    unlockAt: { day: 20 } },
  { id: "executive", name: "Executive", wage: 800,
    desc: "+15% income, +1 greed/day", incomeBonus: 0.15, greedPerDay: 1,
    unlockAt: { day: 28 } }
];
export function getEmployeeById(id) { return EMPLOYEES.find(e => e.id === id); }

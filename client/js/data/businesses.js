// GREEDY — businesses
export const BUSINESSES = [
  { id: "lemonade", name: "Lemonade Stand", tier: 1, baseCost: 10, baseIncome: 0.5, greedPerUnit: 0, heatPerUnit: 0, repPerUnit: 0.1, unlockAt: { money: 0, day: 1 }, desc: "Honest work.", icon: "lemonade.png" },
  { id: "newspaper", name: "Newspaper Route", tier: 1, baseCost: 25, baseIncome: 1.2, greedPerUnit: 0, heatPerUnit: 0, repPerUnit: 0.1, unlockAt: { money: 20, day: 1 }, desc: "Early mornings.", icon: "newspaper.png" },
  { id: "hotdog", name: "Hot Dog Cart", tier: 1, baseCost: 75, baseIncome: 3.5, greedPerUnit: 0.1, heatPerUnit: 0, repPerUnit: 0.05, unlockAt: { money: 60, day: 1 }, desc: "Greasy, loved.", icon: "hotdog.png" },
  { id: "car_wash", name: "Car Wash", tier: 1, baseCost: 150, baseIncome: 7, greedPerUnit: 0.15, heatPerUnit: 0, repPerUnit: 0.05, unlockAt: { money: 100, day: 1 }, desc: "Cash-in-hand classic.", icon: "carwash.png" },
  { id: "corner_shop", name: "Corner Shop", tier: 2, baseCost: 250, baseIncome: 12, greedPerUnit: 0.3, heatPerUnit: 0.1, repPerUnit: 0, unlockAt: { money: 200, day: 1 }, desc: "Real storefront.", icon: "corner_shop.png" },
  { id: "food_truck", name: "Food Truck", tier: 2, baseCost: 500, baseIncome: 22, greedPerUnit: 0.4, heatPerUnit: 0.1, repPerUnit: 0.05, unlockAt: { money: 400, day: 1 }, desc: "Moves with the crowd.", icon: "food_truck.png" },
  { id: "laundromat", name: "Laundromat", tier: 2, baseCost: 900, baseIncome: 38, greedPerUnit: 0.8, heatPerUnit: 0.3, repPerUnit: -0.05, unlockAt: { money: 750, day: 1 }, desc: "Cash-heavy.", icon: "laundromat.png" },
  { id: "coffee_shop", name: "Coffee Shop", tier: 2, baseCost: 1600, baseIncome: 65, greedPerUnit: 0.5, heatPerUnit: 0.05, repPerUnit: 0.15, unlockAt: { money: 1200, day: 2 }, desc: "Addictive product.", icon: "coffee.png" },
  { id: "gym_small", name: "Fitness Studio", tier: 2, baseCost: 2200, baseIncome: 85, greedPerUnit: 0.3, heatPerUnit: 0, repPerUnit: 0.2, unlockAt: { money: 1800, day: 3 }, desc: "Monthly fees.", icon: "gym.png" },
  { id: "restaurant", name: "Restaurant", tier: 3, baseCost: 3500, baseIncome: 120, greedPerUnit: 1.2, heatPerUnit: 0.2, repPerUnit: 0.1, unlockAt: { money: 2500, day: 3 }, desc: "Reputation builder.", icon: "restaurant.png" },
  { id: "nightclub", name: "Nightclub", tier: 3, baseCost: 8000, baseIncome: 280, greedPerUnit: 2.0, heatPerUnit: 0.8, repPerUnit: -0.1, unlockAt: { money: 6000, day: 5 }, desc: "Cash after dark.", icon: "nightclub.png" },
  { id: "casino", name: "Casino", tier: 3, baseCost: 20000, baseIncome: 750, greedPerUnit: 3.5, heatPerUnit: 1.5, repPerUnit: -0.2, unlockAt: { money: 15000, day: 7 }, desc: "House always wins.", icon: "casino.png" },
  { id: "hotel", name: "Hotel", tier: 3, baseCost: 35000, baseIncome: 1200, greedPerUnit: 2.5, heatPerUnit: 0.5, repPerUnit: 0.2, unlockAt: { money: 28000, day: 9 }, desc: "People come and go.", icon: "hotel.png" },
  { id: "car_dealer", name: "Car Dealership", tier: 3, baseCost: 60000, baseIncome: 2400, greedPerUnit: 2.0, heatPerUnit: 0.3, repPerUnit: 0.15, unlockAt: { money: 45000, day: 10 }, desc: "Big-ticket sales.", icon: "dealer.png" },
  { id: "warehouse", name: "Warehouse", tier: 4, baseCost: 50000, baseIncome: 1800, greedPerUnit: 4.0, heatPerUnit: 1.0, repPerUnit: 0, unlockAt: { money: 40000, day: 10 }, desc: "Storage is dull.", icon: "warehouse.png" },
  { id: "shipping", name: "Shipping Co.", tier: 4, baseCost: 150000, baseIncome: 5200, greedPerUnit: 6.0, heatPerUnit: 2.0, repPerUnit: 0.1, unlockAt: { money: 120000, day: 15 }, desc: "Legit on paper.", icon: "shipping.png" },
  { id: "bank", name: "Private Bank", tier: 4, baseCost: 400000, baseIncome: 14000, greedPerUnit: 8.0, heatPerUnit: 3.0, repPerUnit: 0.2, unlockAt: { money: 300000, day: 20 }, desc: "You hold their money.", icon: "bank.png" },
  { id: "pharma", name: "Pharma Lab", tier: 4, baseCost: 800000, baseIncome: 28000, greedPerUnit: 10.0, heatPerUnit: 2.5, repPerUnit: 0.15, unlockAt: { money: 600000, day: 24 }, desc: "Medicine as business.", icon: "pharma.png" },
  { id: "airline", name: "Private Airline", tier: 4, baseCost: 1500000, baseIncome: 55000, greedPerUnit: 12.0, heatPerUnit: 3.0, repPerUnit: 0.25, unlockAt: { money: 1100000, day: 28 }, desc: "Fly the wealthy.", icon: "airline.png" },
  { id: "hedge_fund", name: "Hedge Fund", tier: 5, baseCost: 1500000, baseIncome: 55000, greedPerUnit: 12.0, heatPerUnit: 4.0, repPerUnit: -0.3, unlockAt: { money: 1000000, day: 30 }, desc: "Moves markets.", icon: "hedge_fund.png" },
  { id: "media_network", name: "Media Network", tier: 5, baseCost: 3000000, baseIncome: 110000, greedPerUnit: 14.0, heatPerUnit: 3.0, repPerUnit: 0.5, unlockAt: { money: 2000000, day: 34 }, desc: "Control narrative.", icon: "media.png" },
  { id: "conglomerate", name: "Conglomerate", tier: 5, baseCost: 8000000, baseIncome: 280000, greedPerUnit: 20.0, heatPerUnit: 6.0, repPerUnit: -0.5, unlockAt: { money: 5000000, day: 45 }, desc: "You own the news.", icon: "conglomerate.png" },
  { id: "central_bank", name: "Central Bank", tier: 5, baseCost: 25000000, baseIncome: 900000, greedPerUnit: 25.0, heatPerUnit: 8.0, repPerUnit: 0.3, unlockAt: { money: 18000000, day: 52 }, desc: "Print your own.", icon: "central_bank.png" },
  { id: "shadow_corp", name: "Shadow Corp", tier: 5, baseCost: 50000000, baseIncome: 1800000, greedPerUnit: 35.0, heatPerUnit: 12.0, repPerUnit: -1.0, unlockAt: { money: 25000000, day: 60 }, desc: "No address.", icon: "shadow_corp.png" },
  { id: "arms_dealer", name: "Arms Dealer", tier: 5, baseCost: 80000000, baseIncome: 3500000, greedPerUnit: 45.0, heatPerUnit: 18.0, repPerUnit: -2.0, unlockAt: { money: 50000000, day: 62 }, desc: "Wars are profitable.", icon: "arms.png" },
  { id: "space_mining", name: "Asteroid Mining", tier: 6, baseCost: 200000000, baseIncome: 8000000, greedPerUnit: 45.0, heatPerUnit: 5.0, repPerUnit: 0.5, unlockAt: { money: 150000000, day: 70 }, desc: "Off-world.", icon: "space.png" },
  { id: "ai_singularity", name: "AI Subsidiary", tier: 6, baseCost: 1000000000, baseIncome: 45000000, greedPerUnit: 60.0, heatPerUnit: 8.0, repPerUnit: -0.8, unlockAt: { money: 800000000, day: 80 }, desc: "Runs itself.", icon: "ai.png" },
  { id: "private_gov", name: "Private Government", tier: 6, baseCost: 5000000000, baseIncome: 250000000, greedPerUnit: 80.0, heatPerUnit: 15.0, repPerUnit: -2.0, unlockAt: { money: 3000000000, day: 90 }, desc: "You are the law.", icon: "gov.png" },
  { id: "reality_broker", name: "Reality Broker", tier: 6, baseCost: 50000000000, baseIncome: 2500000000, greedPerUnit: 100.0, heatPerUnit: 20.0, repPerUnit: -5.0, unlockAt: { money: 30000000000, day: 100 }, desc: "Sell what doesn't exist.", icon: "reality.png" },
  { id: "time_bank", name: "Time Bank", tier: 7, baseCost: 500000000000, baseIncome: 25000000000, greedPerUnit: 120.0, heatPerUnit: 25.0, repPerUnit: -3.0, unlockAt: { money: 300000000000, day: 110 }, desc: "Trade seconds.", icon: "time.png" },
  { id: "dimension_hop", name: "Dimension Hopper", tier: 7, baseCost: 5000000000000, baseIncome: 250000000000, greedPerUnit: 150.0, heatPerUnit: 30.0, repPerUnit: -5.0, unlockAt: { money: 3000000000000, day: 120 }, desc: "Trade across realities.", icon: "dimension.png" },
  { id: "god_corp", name: "God Corp", tier: 7, baseCost: 50000000000000, baseIncome: 2500000000000, greedPerUnit: 200.0, heatPerUnit: 50.0, repPerUnit: -10.0, unlockAt: { money: 30000000000000, day: 130 }, desc: "You won.", icon: "god.png" },
  { id: "reality_tv", name: "Reality TV", tier: 6, baseCost: 100000000000000000, baseIncome: 4000000000000000, greedPerUnit: 12, heatPerUnit: 4, repPerUnit: -1, unlockAt: { money: 100000000000000000, day: 108 }, desc: "Broadcast anything.", icon: "tv.png" },
  { id: "weather_ctrl", name: "Weather Control", tier: 6, baseCost: 1000000000000000000, baseIncome: 40000000000000000, greedPerUnit: 15, heatPerUnit: 5, repPerUnit: 0, unlockAt: { money: 1000000000000000000, day: 112 }, desc: "Rent sunshine.", icon: "weather.png" },
  { id: "gravity_well", name: "Gravity Well Co", tier: 7, baseCost: 10000000000000000000000, baseIncome: 400000000000000000000, greedPerUnit: 35, heatPerUnit: 8, repPerUnit: 0, unlockAt: { money: 10000000000000000000000, day: 124 }, desc: "Bend space.", icon: "gravity.png" },
  { id: "dark_matter", name: "Dark Matter Farm", tier: 7, baseCost: 1000000000000000000000000, baseIncome: 40000000000000000000000, greedPerUnit: 50, heatPerUnit: 10, repPerUnit: -2, unlockAt: { money: 1000000000000000000000000, day: 128 }, desc: "Sell what cannot be seen.", icon: "dark.png" },
  { id: "multiverse_bank", name: "Multiverse Bank", tier: 7, baseCost: 100000000000000000000000000000000, baseIncome: 4000000000000000000000000000000, greedPerUnit: 100, heatPerUnit: 22, repPerUnit: 0, unlockAt: { money: 100000000000000000000000000000000, day: 144 }, desc: "Holds every currency.", icon: "multi.png" },
  { id: "singularity_inc", name: "Singularity Inc", tier: 7, baseCost: 1000000000000000000000000000000000000, baseIncome: 40000000000000000000000000000000000, greedPerUnit: 150, heatPerUnit: 32, repPerUnit: -5, unlockAt: { money: 1000000000000000000000000000000000000, day: 152 }, desc: "The AI runs everything.", icon: "singularity.png" },
  { id: "you_inc", name: "You, Inc", tier: 7, baseCost: 10000000000000000000000000000000000000000, baseIncome: 400000000000000000000000000000000000000, greedPerUnit: 250, heatPerUnit: 50, repPerUnit: -10, unlockAt: { money: 10000000000000000000000000000000000000000, day: 160 }, desc: "You sold yourself.", icon: "you.png" },
  { id: "the_end", name: "THE END", tier: 7, baseCost: 100000000000000000000000000000000000000000000, baseIncome: 4000000000000000000000000000000000000000000, greedPerUnit: 500, heatPerUnit: 100, repPerUnit: -50, unlockAt: { money: 100000000000000000000000000000000000000000000, day: 200 }, desc: "You won. Now what?", icon: "end.png" }
];

export function getBusinessById(id) { return BUSINESSES.find(b => b.id === id) || null; }
export function getBusinessesByTier(tier) { return BUSINESSES.filter(b => b.tier === tier); }
export function getUnlockedBusinesses(state) {
  return BUSINESSES.filter(b => {
    const u = b.unlockAt;
    if (u.money != null && state.money < u.money) return false;
    if (u.day != null && state.day < u.day) return false;
    return true;
  });
}

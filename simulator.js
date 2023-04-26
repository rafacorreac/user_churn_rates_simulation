
let users = {
    NU: [0],
    CU: [0],
    WAU: [0],
    MAU: [0],
    DU: [0],
    RU: [0],
    SU: [0],
    CHU: [0],
    TU: [0]
}

let normalRates = {
    curr: 0.38,
    nurr: 0.48,
    surr: 0.2,
    rurr: 0.2,
    iwaurr: 0.3,
    imaurr: 0.22,
    duss: 0.05,
    wauLoss: 0.68,
    mauLoss: 0.75
};

const churnRates = {
    NU: 0.02,
    CU: 0.02,
    WAU: 0.02,
    MAU: 0.03,
    DU: 0.1,
    RU: 0.02,
    SU: 0.02,
};

let periods = 120;
const results = [];
let runs = 20;

for (let run = 1; run <= runs; run++) {
    // console.log(`Run #${run}`);
    function simulateUserBehavior(users, normalRates, churnRates, periods) {
        for (let i = 1; i <= periods; i++) {
            users.NU[i] = Math.floor(Math.random() * ((i * 1.5) - i + 1)) + i;
            users.CU[i] = Math.floor((users.CU[i - 1] * normalRates.curr) + (users.NU[i - 1] * normalRates.nurr) + (users.SU[i - 1] * normalRates.surr) + (users.WAU[i - 1] * normalRates.iwaurr) + (users.RU[i - 1] * normalRates.rurr) - (users.CU[i - 1] * churnRates.CU));
            users.WAU[i] = Math.floor(users.WAU[i - 1] + (users.CU[i] * (1 - normalRates.curr - churnRates.CU)) - (users.WAU[i - 1] * normalRates.iwaurr) - (users.WAU[i - 1] * normalRates.wauLoss) + (users.NU[i] * (1 - normalRates.nurr - churnRates.NU)) + (users.SU[i - 1] * (1 - normalRates.surr)) + (users.RU[i - 1] * (1 - normalRates.rurr)) - (users.WAU[i - 1] * churnRates.WAU));
            users.MAU[i] = Math.floor(users.MAU[i - 1] + (users.WAU[i] * normalRates.wauLoss) - (users.MAU[i - 1] * normalRates.mauLoss) - (users.MAU[i - 1] * churnRates.MAU));
            users.DU[i] = Math.floor(users.DU[i - 1] + (users.MAU[i] * normalRates.mauLoss) - (users.TU[i - 1] * churnRates.DU));
            users.RU[i] = Math.floor((users.MAU[i] * normalRates.imaurr) - (users.RU[i - 1] * churnRates.RU));
            users.SU[i] = Math.floor((users.DU[i] * normalRates.duss) - (users.SU[i - 1] * churnRates.SU));
            users.CHU[i] = Math.floor((users.NU[i - 1] * churnRates.NU) + (users.CU[i - 1] * churnRates.CU) + (users.WAU[i - 1] * churnRates.WAU) + (users.MAU[i - 1] * churnRates.MAU) + (users.DU[i - 1] * churnRates.DU) + (users.RU[i - 1] * churnRates.RU) + (users.SU[i - 1] * churnRates.SU));
            users.TU[i] = Math.floor(users.NU[i] + users.CU[i] + users.WAU[i] + users.MAU[i] + users.DU[i] + users.RU[i] + users.SU[i]);
        }
        return users;
    }

    const simulatedUsers = simulateUserBehavior(users, normalRates, churnRates, periods);
    // console.log("Initial Run - No modifications")
    const simulatedTuUsers = simulatedUsers.TU[periods];
    // console.log(simulatedTuUsers);

    const majorObject = {};

    for (const key in churnRates) {
        majorObject[key] = { ...churnRates }; // Create a copy of churnRates
        majorObject[key][key] = churnRates[key] * 0.8; // Apply the 80% rule to the specific churn rate
    }

    let majorObjectresults = [];
    const modifiedRunResults = {};

    for (const key in majorObject) {
        const modifiedChurnRates = majorObject[key];
        const simulatedUsersModified = simulateUserBehavior(users, normalRates, modifiedChurnRates, periods);
        // console.log(`Simulation with modified ${key} churn rate:`);
        // console.log(simulatedUsersModified.TU[periods]);
        modifiedRunResults[key] = simulatedUsersModified.TU[periods];
        majorObjectresults.push(modifiedRunResults);
    }
    let resultSimulation = {initial: simulatedTuUsers, modified : modifiedRunResults}
    results.push(resultSimulation);
    
}

console.log("Results array:");
console.log(results);

let finalResults = {
    initial: 0,
    modified: {
        NU: 0,
        CU: 0,
        WAU: 0,
        MAU: 0,
        DU: 0,
        RU: 0,
        SU: 0
    }
};

for (let i = 0; i < runs; i++) {
    finalResults.initial += results[i].initial;

    for (const key in finalResults.modified) {
        finalResults.modified[key] += results[i].modified[key];
    }
}

finalResults.initial /= runs;

for (const key in finalResults.modified) {
    finalResults.modified[key] /= runs;
}

console.log("Averages Array - Churn Rates -20%");
console.log(finalResults);

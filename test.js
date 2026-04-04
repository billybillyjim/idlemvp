const testvm = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            test: "This is a test.",
            gameApp:null,
            ageRatios:{
                "Infant":0.2,
                "Child":0.3,
                "Adult":0.5,
            },
            population:50,
            ratioChart:null,
        }
    },
    mounted: function(){
        console.log('mounted');
        Vue.nextTick(() => {
            console.log("setting game vueapp reference in testvm");
            this.gameApp = window.VM;
            console.log(this.gameApp);
            this.gameApp.isPaused = true;
            this.gameApp.technologies.sort((a, b) => a.Complexity - b.Complexity);
        });
    },
    methods:{
        setPopulation(newPop){
            this.gameApp.test_ResetPopulation();
            let adults = newPop * this.ageRatios["Adult"];
            let children = newPop * this.ageRatios["Child"];
            let infants = newPop * this.ageRatios["Infant"];
            this.gameApp.test_SetPopulation(adults, children, infants);
            this.population = newPop;
        },
        updateAgeRatios(target){
            let remaining = 1 - this.ageRatios[target];
            let otherKeys = Object.keys(this.ageRatios).filter(k => k !== target);
            let otherTotal = otherKeys.reduce((sum, k) => sum + this.ageRatios[k], 0);
            otherKeys.forEach(k => {
                this.ageRatios[k] = (this.ageRatios[k] / otherTotal) * remaining;
            });
        },
        getGameAppFoodProduction(){
            if(!this.gameApp) return 0;
            let farmer = this.gameApp.professions.find(x => x.Name == 'Farmer');
            let prod = this.gameApp.getActualProduction(farmer);
            //console.log(prod, farmer.Count);
            let foodProd = prod.find(x => x[0] == 'Food')[1];
            return foodProd
        },
        unlockTechnology(tech){
            if(!this.gameApp) return;
            if(tech.isLocked == false){
                tech.isLocked = true;
                this.gameApp.processProductionModifiers();
                return;
            }
            tech.Unlock(this.gameApp);
            this.gameApp.processProductionModifiers();
            this.setPopulation(this.population);
        },
        canSustainPopulation(infantRatio, childRatio, adultRatio, farmerCount){
            if (!this.gameApp) return false;
            const farmerProf = this.gameApp.professions.find(x => x.Name == 'Farmer');
            farmerProf.Count = farmerCount;
            this.gameApp.processDemand();
            const foodProd = this.getGameAppFoodProduction();
            const foodDemand = this.gameApp.demand['Food'] ?? 0;
            return foodDemand < foodProd;
        },
        findMinFarmers(infants, children, maxFarmers = 1000){
            const gameApp = this.gameApp;
            if (!gameApp) return 0;

            const infantProf  = gameApp.professions.find(x => x.Name == 'Infant');
            const childProf   = gameApp.professions.find(x => x.Name == 'Child');
            const farmerProf  = gameApp.professions.find(x => x.Name == 'Farmer');
            const unemployedProf = gameApp.professions.find(x => x.Name == 'Unemployed');

            // Clear all profession counts, age buckets
            gameApp.test_ResetPopulation();

            // Set infants and children directly (no age buckets needed for production calc)
            infantProf.Count  = infants;
            childProf.Count   = children;
             // Start with all remaining as unemployed
            farmerProf.Count  = 0;
            unemployedProf.Count = 0;
            // Quick sanity: check if maxFarmers is even enough
            farmerProf.Count = maxFarmers;
            gameApp.processDemand();
            if ((gameApp.demand['Food'] ?? 0) >= this.getGameAppFoodProduction()) {
                farmerProf.Count = 0;
                return -1; // unsustainable even at ceiling
            }
            unemployedProf.Count = maxFarmers - infants - children;
            // Binary search for the minimum farmer count where food production > demand
            let lo = 0, hi = maxFarmers;
            while (lo < hi) {
                const mid = Math.floor((lo + hi) / 2);
                farmerProf.Count = mid;
                unemployedProf.Count = maxFarmers - infants - children - mid;
                gameApp.processDemand();
                const foodProd   = this.getGameAppFoodProduction();
                const foodDemand = gameApp.demand['Food'] ?? 0;
                if (foodDemand < foodProd) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }

            farmerProf.Count = 0;
            unemployedProf.Count = maxFarmers - infants - children - lo;
            return [lo, unemployedProf.Count ];
        },
        testTechTimes(){
            if (!this.gameApp) return;
            let maxTicks = 4000;
            this.gameApp.isPaused = false;
            this.gameApp.settingsMenu.autoSaveEnabled = false;
            this.gameApp.settingsMenu.enableCharts = false;
            for(let i = 0; i < maxTicks; i++){
                this.gameApp.gameTick();
                this.testTechTimes_FocusTech();
                let foodProd = this.getGameAppFoodProduction();
                let foodDemand = this.gameApp.demand['Food'] ?? 0;
                if(foodProd < foodDemand){
                    let farmer = this.gameApp.professions.find(x => x.Name == 'Farmer');
                    this.gameApp.hire(farmer, 1);
                    console.log("Hired a farmer");
                }
                if(i % 1000 == 0){
                    console.log(`Tick ${i+1}: Food Production = ${foodProd}, Food Demand = ${foodDemand}`);
                }

            }
            this.gameApp.isPaused = true;
        },
        testTechTimes_FocusTech(){
            if(this.gameApp.focusedTechnology){
            }
            else{
                for(let t of this.gameApp.getTechnologies(true, true)){
                    if(t.isLocked){
                        this.gameApp.focusTechnology(t);
                        break;
                    }
                }
            }
            if(!this.gameApp.focusedTechnology){
                console.log("No available tech to focus on.");
            }
        },
        findOptimalRatios(){
            if (!this.gameApp) return;

            const FIXED_INFANTS  = 200;
            const FIXED_CHILDREN = 350;
            const MAX_FARMERS    = 1000;
            const gameApp        = this.gameApp;

            // Save current technology locked state so we can restore it
            const savedTechState = gameApp.technologies.map(t => ({ name: t.Name, isLocked: t.isLocked }));

            // Lock every technology as a baseline
            for (const tech of gameApp.technologies) tech.isLocked = true;
            gameApp.processProductionModifiers();

            const results = [];

            // Baseline: no technologies at all
            const baseMin = this.findMinFarmers(FIXED_INFANTS, FIXED_CHILDREN, MAX_FARMERS);
            results.push({ techName: 'No Technology', farmersNeeded: baseMin[0], unemployed: baseMin[1] });

            // Unlock each technology cumulatively (already sorted by Complexity in mounted)
            for (const tech of gameApp.technologies) {
                tech.isLocked = false;
                gameApp.processProductionModifiers();

                const minFarmers = this.findMinFarmers(FIXED_INFANTS, FIXED_CHILDREN, MAX_FARMERS);
                console.log(`Tech: ${tech.Name}, Min Farmers: ${minFarmers}`);
                results.push({ techName: tech.Name, farmersNeeded: minFarmers[0], unemployed: minFarmers[1] });
            }

            // Restore original technology states
            for (const saved of savedTechState) {
                const tech = gameApp.technologies.find(t => t.Name === saved.name);
                if (tech) tech.isLocked = saved.isLocked;
            }
            gameApp.processProductionModifiers();
            gameApp.test_ResetPopulation();

            this.chartResults(results);
            this.renderRatioChart(results);
        },
        chartResults(results){
            console.log('=== Optimal Farmer Ratios by Technology Level ===');
            console.log(`Fixed population: 100 Infants + 150 Children`);
            console.table(results.map((r, i) => ({
                '#': i,
                'Tech Unlocked': r.techName,
                'Min Farmers':   r.farmersNeeded === -1 ? 'Unsustainable' : r.farmersNeeded,
                'Unemployed':    r.unemployed,
                'Change':        i === 0 ? '—' : (r.farmersNeeded === -1 ? 'N/A' :
                                    (results[i - 1].farmersNeeded === -1 ? 'N/A' :
                                        r.farmersNeeded - results[i - 1].farmersNeeded))
            })));
        },
        renderRatioChart(chartData){
            const canvas = document.getElementById('ratioChart');
            if (!canvas) return;

            // Destroy any existing chart instance
            if (this.ratioChart) {
                this.ratioChart.destroy();
                this.ratioChart = null;
            }

            const labels = chartData.map(r => r.techName);
            // Use null for unsustainable entries so Chart.js skips them
            const data   = chartData.map(r => r.farmersNeeded === -1 ? null : r.farmersNeeded);

            this.ratioChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Min farmers to sustain 100 infants + 150 children',
                        data,
                        borderColor:     'rgba(233, 137, 73, 1)',
                        backgroundColor: 'rgba(233, 137, 73, 0.15)',
                        tension: 0.2,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        spanGaps: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Minimum Farmers to Sustain 100 Infants + 150 Children — Cumulative Tech Unlocks'
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => ctx.raw === null
                                    ? 'Unsustainable at ceiling'
                                    : `${ctx.raw} farmers needed`
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 90,
                                minRotation: 45,
                                font: { size: 9 }
                            }
                        },
                        y: {
                            title: { display: true, text: 'Minimum Farmers Needed' },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
});

window.testVM = testvm.mount('#testvm');
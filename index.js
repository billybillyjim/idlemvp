
import buildings from './components/buildings.js'
import population from './components/population.js'
import timeinfo from './components/timeinfo.js'
import currencies from './components/currencies.js'
import technology from './components/technology.js'
import settings from './components/settings.js'
import laws from './components/laws.js'
import Tooltip from './components/tooltip.js'
import tooltipwrapper from './components/tooltipwrapper.js'
import codetester from './components/codetest.js'
import stockpiles from './components/stockpiles.js'

import pluralize from './lib/pluralize.js'
import weather from './lib/weather.js'
import levenshtein from './lib/levenshtein.js'
import Mori from './lib/mori.js'

import currencydata from './data/currencydata.js'
import unlockablesdata from './data/unlockablesdata.js'
import technologies from './data/technologydata.js'
import productionModifiers from './data/productionModifiers.js'
import buildingdata from './data/buildingdata.js'


const gamevm = Vue.createApp({
    components: {
        buildings,
        population,
        currencies,
        timeinfo,
        technology,
        settings,
        laws,
        codetester,
        Tooltip,
        tooltipwrapper,
        stockpiles
    },
    delimiters: ['[[', ']]'],
    data: function () {
        return {
            Mori: Mori,
            Verbose: true,
            gravity: 9.81,
            sunlight: 1,
            isPaused: false,
            keyboardModifiers: {
                Shift: false,
                Control: false,
            },
            basePopulationGrowthChance: 0.0025,
            baseChildLaborProductionBoost:0.5,
            civilizationName: "",
            currentMenu: "Main",
            menus: ["Main", "Population", "Stockpiles", "Buildings", "Technology", "Government", "Laws", "Modifiers", "Log", "Charts", "Settings"],
            currentDate: new Date(2000, 0, 1),
            populationMenu: {
                amount: 1,
                customSelected: false,
            },
            technologyMenu: {
                showCompleted: false,
            },
            buildingMenu: {
                hoverIndex: -1,
                amount:1,
            },
            chartMenu: {
                currentChart: '',
                chartTime: 'Every Tick',
            },
            stockpileMenu: {
                importantStockpiles: ['Food', 'Water'],
            },
            settingsMenu: {
                enableCharts: true,
                logsDisabled: false,
                renderDate: true,
                renderWeather: true,
                autoSaveEnabled: true,
            },
            government: {
                currentLeader: {
                    Name: null,
                    isDead: true,
                    trueApproval: 60
                },
                currentLeaders: [],
                type: "Tribal",
                currency: "Pottery",
                currencyStockpile: 0,
                stockpileMaxSize: 100,
                taxRate: 0.001,

            },
            governmentTypes: {
                Tribal: {
                    baseEfficiency: 0.5,
                    efficiencyPerCapita: 0.01,
                    efficiencyPerEmployee: 0.1,
                    collapse: this.collapseTribalGovernment()
                }
            },
            debug: {
                calculateTickTime: true,
                previousTickTime: null,
                pastHundredTicks: [],
            },
            log: [],
            consoleOutputs: [],
            uploadedSaveFile: null,
            activeTooltipData: null,
            growthThreshold: 2,
            QOLDecay: 0.95,
            tickspeed: 300,
            currentTick: 0,
            minuteTick: 0,
            hourTick: 0,
            workingHours: 12,
            hoursInDay: 24,
            synodicDays: 29.530588853,
            epoch: Date.UTC(2000, 0, 6, 18, 14, 0),
            monthNames: [
                "Wolf Moon", "Snow Moon", "Worm Moon", "Pink Moon",
                "Flower Moon", "Strawberry Moon", "Buck Moon", "Sturgeon Moon",
                "Harvest Moon", "Blood Moon", "Beaver Moon", "Cold Moon"
            ],
            QOL: 1,
            showSidebar: false,
            focusedTechnology: null,
            currencyDailyChange: {},
            tutorialStage: 0,
            currentGoalLevel: 0,
            goalLevelHints: [
                "Your people are cold at night. There must be something we can do.",
                "Your people want something to drink water out of aside from their hands.",
                "Your people have many arguments about who owes who what.",
                "Your people wish they could communicate without repeating themselves.",
                "Your people desire a way to show how many things there are.",
                "You've done so much for your people. Maybe you deserve some of their work.",
                "You seem to have this ruling thing figured out.",
                ""
            ],
            currencyPotentialChange: {},
            activeComponents: [
                { Name: 'CodeTester', component: 'codetester', isActive: true, },
                { Name: 'Population', component: 'population', isActive: true, },
                { Name: 'Laws', component: 'laws', isActive: true, },
                { Name: 'Time Info', component: 'timeinfo', isActive: true, },
                { Name: 'Currencies', component: 'currencies', isActive: true, },
                { Name: 'House', component: 'house', isActive: true, },
                { Name: 'Technology', component: 'technology', isActive: true, },
                { Name: 'Settings', component: 'settings', isActive: true, },

            ],
            buildingdata,
            missingProfessionCounts: {},
            relocationInfo: {},
            professions: [
                {
                    Name: 'Unemployed',
                    Count: 5,
                    Cost: {},
                    Produces: { 'Food': 0.8 },
                    BaseDemand: { Food: 4, Water:2 },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                    Mortal: true,
                    Description:"Unemployed people gather most of their own food, but they are generally more productive if you assign them a job."
                },
                {
                    Name: 'Infant',
                    Count: 3,
                    Cost: {},
                    Produces: {},
                    BaseDemand: { Food: 0.15, Water:0.1 },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                    Mortal: false,
                    Description:"Infants require a small amount of food and produce no labor. They turn into children at the age of 1."
                },
                {
                    Name: 'Child',
                    Count: 14,
                    Cost: {},
                    Produces: {},
                    BaseDemand: { Food: 1.05, Water:0.2 },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                    Mortal: false,
                    Description:"Children provide a production boost to every adult profession. They turn into unemployed workers at the age of 15."
                },
                {
                    Name: 'Farmer',
                    Count: 10,
                    Cost: {},
                    Produces: { 'Food': 10.0, 'Grain': 5, },
                    BaseDemand: {
                        Food: 4,
                        Water:4,
                    },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                    Mortal: true,
                    Description:"Farmers are the lifeblood of the early civilization. They produce food and grain, which can be turned into food later."
                },
                // {Name:'Test', Count:0, Cost:{}, Produces:{}, Unlocked:true, Visible:true,},

            ],
            productionModifiers,
            prodModCache: {},
            technologies,
            techDict: {},
            currencydata,
            endTickCurrencyValues: {},
            beginTickCurrencyValues: {},
            preCostTickCurrencyValues: {},
            tickProductionValues: {},
            uncappedTickProductionValues: {},
            uncappedTickConsumptionValues: {},
            previousTickProductionValues: {},
            previousTickConsumptionValues: {},
            currencyDemandDescriptions: {},
            currencyProductionDescriptions: {},
            currencyConsumptionDescriptions: {},
            demand: {},
            unmetdemand: {},
            unlockablesdata,
            civNameConfirmed: false,
            gameProcess: null,
            currentVillagerNameIndex: 0,
            negativeDemandThreshold: -20,
            positiveDemandThreshold: 20,
            possibleVillagerNames: [
                "Anerkos", "Bratharos", "Drekos", "Elnos", "Fenika", "Kasethos", "Harnis", "Inekos", "Jibnos", "Karnidra",
                "Likros", "Manethos", "Nerthos", "Ophelos", "Perknas", "Qiarthos", "Rosnos", "Seknos", "Tharwen", "Elkidros",
                "Narnika", "Wekonar", "Xalnor", "Yernos", "Zalktha", "Albrinos", "Borwetha", "Kndralos", "Drimoros", "Estherna",
                "Franalos", "Kaldrira", "Hedralos", "Eldronar", "Jarwena", "Kesthortha", "Linara", "Melthos", "Nidrnar", "Ortha",
                "Poketha", "Ridros", "Selwen", "Tharnak", "Elbera", "Belthon", "Wenika", "Zarnis", "Drokaros", "Jarnika",
                "Thonaros", "Aldonar", "Brinika", "Kortha", "Drelkos", "Ermina", "Farkoth", "Klennar", "Hesdrik", "Ellortha",
                "Krenika", "Lomrik", "Marelos", "Ninara", "Osthel", "Perdrik", "Qiarlen", "Rohika", "Seldrik", "Thorlos",
                "Irdreth", "Naldrik", "Wernik", "Xarlos", "Yalkren", "Zorbeth", "Anrika", "Basthel", "Kndrak", "Drelwen",
                "Elbrana", "Fornak", "Kralthos", "Helnara", "Isdrik", "Jelnar", "Kroswen", "Lanther", "Morbek", "Nornala",
                "Orbeth", "Paldrik", "Qiarneth", "Relska", "Sornith", "Thalwen", "Elthor", "Vrenka", "Wedrinak", "Xenrik",
                "Yornath", "Zelvra", "Ardrwen", "Breloth", "Kornak", "Dranith", "Elsinar", "Faldrik", "Korthen", "Herwen",
                "Isweth", "Jalros", "Kendrik", "Lorneth", "Mavrel", "Nethortha", "Orthan", "Pernik", "Qiasthel", "Ravdrik",
                "Selnara", "Thornan", "Irnika", "Lorwen", "Wesrik", "Xaneth", "Yorhik", "Zalrik", "Althen", "Bovrik",
                "Kaldros", "Drenrik", "Esdrik", "Fendrira", "Kribeth", "Holben", "Isthal", "Jernik", "Korhin", "Lestha",
                "Melrik", "Nolbeth", "Orlen", "Pavrik", "Qialna", "Rendrik", "Sornan", "Therhik", "Elkren", "Lornik"
            ],
            passedLaws: [],
            reservedNames: new Set(),
            currencyReservedNames: new Set(),
            professionReservedNames: new Set(),
            buildingReservedNames: new Set(),
            parser: {
                i: 0,
                tokens: [],
            },
            pluralizer: pluralize,
            previousWeather: null,
            checkHistoricalValues: true,
            historicalValues: {},
            historicalValuesMinute: {},
            historicalValuesHour: {},
            historicalLeaders:[],
            maxHistory: 1000,
            testMode: false,
            technologyEnhancedSurvivability: 30,
            monthlyAgeBuckets: [
                0, 0, 0,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1
            ],
            yearlyAgeBuckets: [//3 infants, 3 children, 20 adults
                3, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
                2, 1, 2, 1, 1, 2, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            ageDeathProbabilityTable: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0.000622,
                0.000826,
                0.001026,
                0.001182,
                0.001301,
                0.001404,
                0.001498,
                0.001586,
                0.001679,
                0.001776,
                0.001881,
                0.001985,
                0.002095,
                0.002219,
                0.002332,
                0.002445,
                0.002562,
                0.002653,
                0.002716,
                0.002791,
                0.002894,
                0.002994,
                0.003091,
                0.003217,
                0.003353,
                0.003499,
                0.003642,
                0.003811,
                0.003996,
                0.004175,
                0.004388,
                0.004666,
                0.004973,
                0.005305,
                0.005666,
                0.006069,
                0.006539,
                0.007073,
                0.007675,
                0.008348,
                0.009051,
                0.009822,
                0.010669,
                0.011548,
                0.012458,
                0.013403,
                0.014450,
                0.015571,
                0.016737,
                0.017897,
                0.019017,
                0.020213,
                0.021569,
                0.023088,
                0.024828,
                0.026705,
                0.028761,
                0.031116,
                0.033861,
                0.037088,
                0.041126,
                0.045241,
                0.049793,
                0.054768,
                0.060660,
                0.067027,
                0.073999,
                0.081737,
                0.090458,
                0.100525,
                0.111793,
                0.124494,
                0.138398,
                0.153207,
                0.169704,
                0.187963,
                0.208395,
                0.230808,
                0.253914,
                0.277402,
                0.300882,
                0.324326,
                0.347332,
                0.369430,
                0.391927,
                0.414726,
                0.437722,
                0.460800,
                0.483840,
                0.508032,
                0.533434,
                0.560105,
                0.588111,
                0.617516,
                0.648392,
                0.680812,
                0.714852,
                0.750595,
                0.788125,
                0.827531,
                0.868907,
                0.912353,
                0.957970,
                1.000000
            ],
            starvationDeathOdds:0.15,
            charts: [{ Name: 'UnmetDemands' }, { Name: 'Currencies' }, { Name: 'Population' }, { Name: 'Real Production' }, { Name: 'Uncapped Production' }, { Name: 'agebrackets' }],
            keyColors: {
                'Space': 'rgba(224, 224, 224, 1)',
                'Wood': 'rgba(146, 91, 54, 1)',
                'Food': 'rgba(233, 137, 73, 1)',
                'Water': 'rgba(101, 208, 250, 1)',
                'Rope': 'rgba(145, 106, 62, 1)',
                'Housing': 'rgba(178, 246, 248, 1)',
                'Knowledge': 'rgba(94, 123, 134, 1)',
                'Pottery': 'rgba(224, 162, 45, 1)',
                'Clay': 'rgba(170, 102, 63, 1)',
                'Stone': 'rgba(126, 126, 126, 1)',
                'Ore': 'rgba(73, 73, 73, 1)',
                'Grain': 'rgba(252, 240, 135, 1)',
            },
            tickTime: 2,
        }
    },
    created() {
        this.Mori.initialize(this);
        this.endTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
        this.beginTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
        for (let tech of this.technologies) {
            this.techDict[tech.Name] = tech;
            if ((location.hostname === "localhost" || location.hostname === "127.0.0.1") && this.testMode) {
                // tech.Unlock(this);
            }
        }
        this.generateReservedNames();
    },
    mounted: async function () {
        this.gameProcess = setInterval(this.gameTick, this.tickspeed);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    },
    methods: {
        getKeyboardModifiers() {
            let base = 1;
            if (this.keyboardModifiers.Shift) {
                base *= 10;
            }
            if (this.keyboardModifiers.Control) {
                base *= 5;
            }
            return base;
        },
        onKeyDown(e) {
            if (e.key === 'Shift') {
                this.keyboardModifiers.Shift = true;
            }
            if (e.key === 'Control') {
                this.keyboardModifiers.Control = true;
            }
        },
        onKeyUp(e) {
            if (e.key === 'Shift') {
                this.keyboardModifiers.Shift = false;
            }
            if (e.key === 'Control') {
                this.keyboardModifiers.Control = false;
            }
        },
        tickMonth() {
            if (this.testMode || true) {
                this.doSanityChecks('Before');
            }
            this.professions.find(x => x.Name == 'Infant').Count -= this.monthlyAgeBuckets[11];
            this.professions.find(x => x.Name == 'Child').Count += this.monthlyAgeBuckets[11];
            this.yearlyAgeBuckets[1] += this.monthlyAgeBuckets[11];

            this.monthlyAgeBuckets[11] = 0;
            let sum = 0;
            for (let i = 10; i >= 0; i--) {
                this.monthlyAgeBuckets[i + 1] = this.monthlyAgeBuckets[i];
                sum += this.monthlyAgeBuckets[i];
            }
            this.monthlyAgeBuckets[0] = 0;
            this.yearlyAgeBuckets[0] = sum;
            if (this.testMode || true) {
                this.doSanityChecks('After');
            }
        },
        tickYear() {
            for (let i = 119; i > 0; i--) {
                this.yearlyAgeBuckets[i + 1] = this.yearlyAgeBuckets[i];
                this.yearlyAgeBuckets[i] = 0;
            }
            if (this.yearlyAgeBuckets[15] > 0) {
                let amountAvailableToHire = this.yearlyAgeBuckets[15];
                this.professions.find(x => x.Name == 'Child').Count -= amountAvailableToHire;
                this.professions.find(x => x.Name == 'Unemployed').Count += amountAvailableToHire;
                for (let [prof, missingCount] of Object.entries(this.missingProfessionCounts)) {
                    if (missingCount > 0) {
                        let actual = this.hire(this.professions.find(x => x.Name == prof), missingCount);
                        this.missingProfessionCounts[prof] -= actual;
                        break;
                    }
                }
            }
            if (this.testMode || true) {
                this.doSanityChecks();
            }
        },
        doSanityChecks(when) {
            //Does infant count match profession count?
            let anyError = false;
            let arrayTotal = 0;
            for (let i = 0; i < this.monthlyAgeBuckets.length; i++) {
                arrayTotal += this.monthlyAgeBuckets[i];
            }
            let profTotal = this.professions.find(x => x.Name == 'Infant').Count;
            if (arrayTotal != profTotal) {
                anyError = true;
                console.error("Infant array mismatch:", arrayTotal, profTotal, when);
            }
            //Child Counts?
            arrayTotal = 0;
            for (let i = 1; i < 15; i++) {
                arrayTotal += this.yearlyAgeBuckets[i];
            }
            profTotal = this.professions.find(x => x.Name == 'Child').Count;
            if (arrayTotal != profTotal) {
                anyError = true;
                console.error("Child array mismatch:", arrayTotal, profTotal, when);
            }
            //adult Counts?
            arrayTotal = 0;
            for (let i = 15; i < this.yearlyAgeBuckets.length; i++) {
                arrayTotal += this.yearlyAgeBuckets[i];
            }
            profTotal = this.professions.filter(x => x.Mortal).map(x => x.Count).reduce((a, b) => a + b, 0);
            if (arrayTotal != profTotal) {
                console.error("Adult array mismatch:", arrayTotal, profTotal, when);
                anyError = true;
            }
            if (anyError) {
                this.isPaused = true;
            }
        },
        setCurrentChart(menuName) {
            if (this.currentMenu != 'Charts') {
                return;
            }
            this.chartMenu.currentChart = menuName;

            if (this.chartMenu.currentChart == 'agebrackets') {
                this.generateAgeBracketChart();
            }
            else {
                if (this.chartMenu.chartTime == 'Every Tick') {
                    this.generateChart(this.historicalValues[menuName], menuName);
                }
                else if (this.chartMenu.chartTime == 'Minute') {
                    this.generateChart(this.historicalValuesMinute[menuName], menuName);
                }
                else if (this.chartMenu.chartTime == 'Hour') {
                    this.generateChart(this.historicalValuesHour[menuName], menuName);
                }
            }

        },
        setChartTimeline(time) {
            this.chartMenu.chartTime = time;
            this.setCurrentChart(this.chartMenu.currentChart);
        },
        incrementGoalLevel(newValue) {
            if (newValue > this.currentGoalLevel) {
                this.currentGoalLevel = newValue;
            }
        },
        getAvailableMenus() {
            if (this.testMode) {
                return this.menus;
            }
            let alwaysAvailable = ["Main", "Population", "Buildings", "Stockpiles", "Technology", "Government", "Charts"];
            if (this.hasTechnology('Firemaking')) {
                alwaysAvailable.push("Buildings");
            }
            if (this.hasTechnology('Basic Societal Structure')) {
                alwaysAvailable.push('Laws');
            }
            if (this.hasTechnology('Numbers')) {
                alwaysAvailable.push('Modifiers');
            }
            alwaysAvailable.push("Log");
            alwaysAvailable.push("Settings");
            return alwaysAvailable;
        },
        confirmCivName() {
            this.civNameConfirmed = true;
        },
        setMenu(menu) {
            this.currentMenu = menu;
        },
        formatDate(date) {
            if (typeof date === "string") {
                date = new Date(date);
            }
            let calTech = this.getCalendarTech()
            if (calTech == 'Solar') {
                const year = date.getFullYear() - 2000;
                const month = date.toLocaleString('en-US', { month: 'long' });
                const day = String(date.getDate()).padStart(2, '0');

                return `${year} ${month} ${day}`;
            }
            else if (calTech == 'Lunar') {
                let [day, month] = this.getLunarDate(date);
                return `${day} ${month}`;
            }
            else {
                return this.getPrecalendarDate(date);
            }
        },
        processLaws() {
            for (let law of this.passedLaws) {
                if (law.isActive && this.shouldRunLawToday(law)) {
                    this.runCode(law.code);
                    law.lastRun = this.currentDate;
                }
            }
        },
        addToDailyLaws(code) {
            this.passedLaws.push(
                {
                    frequency: 'Daily',
                    code: code,
                    isActive: true,
                    Name: 'Test'
                }
            )
        },
        shouldRunLawToday(law) {
            if (law.lastRun) {
                let lastRun = new Date(law.lastRun);
                if (lastRun.getFullYear() == this.currentDate.getFullYear() &&
                    lastRun.getMonth() == this.currentDate.getMonth() &&
                    lastRun.getDate() == this.currentDate.getDate()) 
                {
                    return false;
                }
            }
            if (law.frequency == 'Daily') {
                return true;
            }
            if (law.frequency == 'Weekly') {
                return currentDate.getDay() == 1;
            }
            if (law.frequency == 'Monthly') {
                return currentDate.getDate() == 1;
            }
            if (law.frequency == 'Yearly') {
                return ((Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate()) - Date.UTC(this.currentDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) == 1;
            }
        },
        generateReservedNames() {
            for (let currency of Object.keys(this.currencydata)) {
                let lower = currency.toLowerCase();
                this.reservedNames.add(lower);
                this.reservedNames.add(pluralize.plural(lower));
                this.reservedNames.add(pluralize.singular(lower));
                this.currencyReservedNames.add(lower);
                this.currencyReservedNames.add(pluralize.plural(lower));
                this.currencyReservedNames.add(pluralize.singular(lower));
            }
            for (let prof of this.professions) {
                let lower = prof.Name.toLowerCase();
                this.reservedNames.add(lower);
                this.reservedNames.add(pluralize.plural(lower));
                this.reservedNames.add(pluralize.singular(lower));
                this.professionReservedNames.add(lower);
                this.professionReservedNames.add(pluralize.plural(lower));
                this.professionReservedNames.add(pluralize.singular(lower));
            }
            for (let building of this.buildingdata) {
                let lower = building.Name.toLowerCase();
                this.reservedNames.add(lower);
                this.reservedNames.add(pluralize.plural(lower));
                this.reservedNames.add(pluralize.singular(lower));
                this.buildingReservedNames.add(lower);
                this.buildingReservedNames.add(pluralize.plural(lower));
                this.buildingReservedNames.add(pluralize.singular(lower));
            }
            for (let unlockable of this.unlockablesdata) {
                let lower = unlockable.Name.toLowerCase();
                this.reservedNames.add(lower);
                this.reservedNames.add(pluralize.plural(lower));
                this.reservedNames.add(pluralize.singular(lower));
                if (unlockable.Type == 'Profession') {
                    this.professionReservedNames.add(lower);
                    this.professionReservedNames.add(pluralize.plural(lower));
                    this.professionReservedNames.add(pluralize.singular(lower));
                }
            }
            this.reservedNames.add('total population');
            this.reservedNames.add('current population');
            this.reservedNames.add('total housing');
            this.reservedNames.add('available housing');
            this.reservedNames.add('current housing');
        },
        runCode(code, outputTokens, outputAST, outputOutput) {
            if (this.reservedNames.size == 0) {
                this.generateReservedNames();
            }
            const tokens = this.tokenize(code);
            if (outputTokens) {
                console.log(tokens);
            }
            this.parser.tokens = tokens;
            const ast = this.parse(tokens);
            if (outputAST) {
                console.log(ast);
            }
            let output = this.evaluate(ast, tokens);
            if (outputOutput) {
                console.log(output);
            }
            return output;
        },
        getLaws() {
            return this.passedLaws;
        },
        getVillagerName() {
            let name = this.possibleVillagerNames[this.currentVillagerNameIndex % this.possibleVillagerNames.length];
            this.currentVillagerNameIndex++;

            return name;
        },
        getNameOrProfession(profession, count) {
            if (count == 1) {
                if (this.getPopulation() < 200) {
                    return this.getVillagerName();
                }
                else {
                    return profession.Name;
                }
            }
            if (this.getPopulation() < 200) {
                let output = [];
                for (let i = 0; i < count; i++) {
                    output.push(this.getVillagerName());
                }
                if (output.length == 0) {
                    return '';
                }
                if (output.length == 1) {
                    return output[0];
                }
                if (output.length == 2) {
                    return output[0] + ' and ' + output[1];
                }

                return `${output.slice(0, -2).join(', ')}, ${output[output.length - 2]} and ${output[output.length - 1]}`;
            }
            else {
                return count + ' ' + profession.Name + 's';
            }
        },
        async setSpeed(value, ticksPerTick) {

            clearInterval(this.gameProcess);
            if (value >= 1) {
                this.tickspeed = value;
                this.gameProcess = setInterval(this.gameTick, this.tickspeed);
                if (value == 1) {
                    this.checkHistoricalValues = false;
                }
                else {
                    this.checkHistoricalValues = true;
                }
            }
            else {
                this.tickspeed = 1;

                let multiTick = () => {
                    let start = performance.now();
                    for (let i = 0; i < ticksPerTick; i++) {

                        this.gameTick();
                    }
                    let stop = performance.now();
                    this.debug.previousTickTime = stop - start;
                    this.debug.pastHundredTicks.push(this.debug.previousTickTime);
                    if (this.debug.pastHundredTicks.length > 100) {
                        this.debug.pastHundredTicks.shift();
                    }
                }

                this.gameProcess = setInterval(multiTick, this.tickspeed);
                this.settingsMenu.logsDisabled = true;
                this.settingsMenu.renderDate = false;
                this.settingsMenu.renderWeather = false;
                this.checkHistoricalValues = false;


            }
        },
        collapseTribalGovernment() {

        },
        getTechnologies(sort = false, includeResearched = false) {
            let techs = [];
            for (let tech of this.technologies) {
                if (!tech.Visible) {
                    let hasResources = this.canAfford(tech.Cost);
                    let hasRequirements = this.hasRequirements(tech);
                    if (hasResources && hasRequirements) {
                        techs.push(tech);
                    }
                }
            }
            if (sort) {
                techs.sort((a, b) => b.IsUnlocked - a.IsUnlocked);
            }
            if (includeResearched == false) {
                return techs.filter(x => x.isLocked == true);
            }
            return techs;
        },
        hasTechnology(techName) {
            return this.techDict[techName]?.isLocked == false;
        },
        buildDependencyGraph() {
            const graph = {};

            // Initialize graph with all tech nodes
            for (const tech of this.technologies) {
                graph[tech.Name] = {
                    dependsOn: [],
                    requiredBy: []
                };
            }

            // Populate dependencies
            for (const tech of this.technologies) {
                const requirements = tech.Requirements?.Technologies || [];

                for (const dep of requirements) {
                    if (!graph[dep]) {
                        console.warn(`Warning: Missing tech node for dependency "${dep}"`);
                        graph[dep] = { dependsOn: [], requiredBy: [] }; // placeholder if undefined
                    }
                    graph[tech.Name].dependsOn.push(dep);
                    graph[dep].requiredBy.push(tech.Name);
                }
            }

            return graph;
        },
        saveState() {
            try {
                let { Mori, ...data } = this.$data;
                let snapshotData = JSON.parse(JSON.stringify(data));
                snapshotData.log = [];
                const json = JSON.stringify(snapshotData);
                const compressed = LZString.compressToUTF16(json);
                localStorage.setItem('saveData', compressed);
                this.logit("Saved game.");
                return true;
            } catch (err) {
                console.error('saveState failed:', err);
                this.logit("Something went wrong... Failed to save game.");
                return false;
            }
        },
        loadState() {
            try {
                const compressed = localStorage.getItem('saveData');
                if (!compressed) return null;
                const json = LZString.decompressFromUTF16(compressed);
                let data = JSON.parse(json);
                Object.assign(this.$data, data);
                this.currentDate = new Date(this.currentDate);

                this.reservedNames = new Set();
                this.currencyReservedNames = new Set();
                this.professionReservedNames = new Set();
                this.buildingReservedNames = new Set();
                this.generateReservedNames();
            } catch (err) {
                console.error('loadState failed:', err);
                return null;
            }
        },
        downloadSave() {
            try {
                let data = this.$data;
                data.log = [];
                const json = JSON.stringify(data);
                const compressed = LZString.compressToUTF16(json);
                const blob = new Blob([compressed], { type: 'text/plain;charset=UTF-16' });
                const url = URL.createObjectURL(blob);

                const a = Object.assign(document.createElement('a'), {
                    href: url,
                    download: 'vanitasiasave.txt',
                });
                a.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('downloadStateTxt failed:', err);
            }
        },
        uploadSave() {
            if (!this.uploadedSaveFile) {
                //console.log("No uploaded save file.");
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const compressed = reader.result;
                    const json = LZString.decompressFromUTF16(compressed);
                    const loaded = JSON.parse(json);
                    Object.assign(this.$data, loaded);
                    this.uploadedSaveFile = null;
                } catch (err) {
                    console.error('Failed to parse save file:', err);
                    alert('Invalid or corrupted save file.');
                }
            };

            reader.readAsText(this.uploadedSaveFile, 'utf-16');
        },
        hasRequirements(requireable) {
            if (!requireable.Requirements) {
                return true;
            }
            if (requireable.IsUnlocked) {
                return true;
            }
            if (requireable.Requirements.Technologies) {
                for (let techName of requireable?.Requirements?.Technologies) {
                    let tech = this.techDict[techName];
                    if (!tech) {
                        console.error("Invalid tech name for requirement in hasRequirements:", requireable, techName);
                    }
                    else if (tech.isLocked) {
                        return false;
                    }

                }
            }

            if (requireable.Requirements.Populations) {
                for (let [population, count] of Object.entries(requireable?.Requirements?.Populations)) {
                    if (population == 'Global') {
                        let enough = this.getPopulation() >= count;
                        if (!enough) {
                            return false;
                        }
                    }
                    else {
                        const prof = this.professions.find(p => p.Name == population);
                        let enough = prof.Count >= count;
                        if (!enough) {
                            return false;
                        }
                    }
                }
            }

            if (requireable.Requirements.Buildings) {
                for (let [buildingName, count] of Object.entries(requireable.Requirements.Buildings)) {
                    let building = this.buildingdata.find(x => x.Name == buildingName);
                    if (building.Count < count) {
                        return false;
                    }
                }
            }

            requireable.IsUnlocked = true;
            return true;
        },
        getCalendarTech() {
            let solarUnlocked = this.techDict['Solar Calendar']?.isLocked == false;
            let lunarUnlocked = this.techDict['Lunar Calendar']?.isLocked == false;
            if (solarUnlocked) {
                return 'Solar';
            }
            if (lunarUnlocked) {
                return 'Lunar';
            }
            return 'None';
        },
        focusTechnology(tech) {
            this.focusedTechnology = tech;
        },
        setUploadedFile(e) {
            this.uploadedSaveFile = e.target.files[0];
        },
        // formatDate(date) {
        //     const year = date.getFullYear();
        //     const month = date.toLocaleString('en-US', { month: 'long' });
        //     const day = String(date.getDate()).padStart(2, '0');

        //     return `${year} ${month} ${day}`;
        // },
        logit(msg) {
            if (this.settingsMenu.logsDisabled) {
                return;
            }
            if (typeof msg === 'string') {
                msg = { message: msg };
            }
            msg.Time = this.formatDate(this.currentDate);
            this.log.unshift(msg);
            if (this.log.length > 100) {
                this.log.splice(100);
            }
        },
        getWorkRatio() {
            return (this.workingHours / this.hoursInDay);
        },
        gameTick() {
            if (this.isPaused) {
                return;
            }
            this.advanceTime();
            this.initializeTickValues();
            this.runAllProcesses();
            this.handlePeriodicTasks();
        },
        advanceTime() {
            this.currentTick++;
            let currentMonth = this.currentDate.getMonth();
            let currentYear = this.currentDate.getFullYear();
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), this.currentDate.getHours() + this.tickTime);
            if (this.currentDate.getMonth() != currentMonth) {
                this.tickMonth();
            }
            if (this.currentDate.getFullYear() != currentYear) {
                this.tickYear();
            }
        },
        initializeTickValues() {
            this.beginTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
            this.previousTickProductionValues = JSON.parse(JSON.stringify(this.tickProductionValues));
            this.previousTickUncappedProductionValues = JSON.parse(JSON.stringify(this.uncappedTickProductionValues));
            this.previousTickConsumptionValues = JSON.parse(JSON.stringify(this.uncappedTickConsumptionValues));
            this.tickProductionValues = {};
            for (let currency of Object.keys(this.currencydata)) {
                this.tickProductionValues[currency] = 0;
                this.uncappedTickProductionValues[currency] = 0;
                this.uncappedTickConsumptionValues[currency] = 0;
                this.currencyPotentialChange[currency] = 0;
            }
            this.currencyDemandDescriptions = {};
            this.currencyProductionDescriptions = {};
            this.currencyConsumptionDescriptions = {};
        },
        runAllProcesses() {
            this.processBaseGrowth();
            this.processProductionModifiers();
            this.processGovernment();
            this.processProfessions();
            this.processBuildings();
            this.processTechnology();
            this.processQOL();
            this.checkUnlocks();
            this.preCostTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
            this.processCosts();
            this.endTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
            this.processDemand();
            this.processLaws();
            this.processDeaths();
        },
        handlePeriodicTasks() {
            if (this.currentTick % 100 == 0 && this.settingsMenu.autoSaveEnabled) {
                this.saveState(this.$data);
            }
            if (this.checkHistoricalValues && this.settingsMenu.enableCharts) {
                this.processHistoricalValues();
                if (this.chartMenu.currentChart) {
                    this.setCurrentChart(this.chartMenu.currentChart);
                }
            }
        },
        processGovernment() {
            if (this.government.type == "Oligarchy") {
                if (this.government.currentLeaders.length != 3) {
                    this.government.currentLeaders = [
                        this.generateRandomPerson(),
                        this.generateRandomPerson(),
                        this.generateRandomPerson()
                    ];
                }
                for (let leader of this.government.currentLeaders) {
                    if (leader.isDead) {
                        if(leader.Name){
                            this.logit(leader.Name + " has died.");
                            console.log(leader.Name + " has died at age " + leader.Age + ".");
                            this.historicalLeaders.push(leader);
                        }
                        
                        this.getNewGovernmentLeader();
                    }
                }


            }
            else {
                if (this.government.currentLeader.isDead) {
                    if(this.government.currentLeader.Name){
                        this.logit(this.government.currentLeader.Name + " has died.");
                        console.log(this.government.currentLeader.Name + " has died at age " + this.government.currentLeader.Age + ".");
                    }

                    this.getNewGovernmentLeader();
                }
                else {
                    //assumes every game tick is still one hour
                    this.government.currentLeader.Age += 0.000114;
                    //Technology can reduce this, but it's a 3x chance to die compared to the modern numbers
                    let yearlyDeathChance = this.ageDeathProbabilityTable[Math.floor(this.government.currentLeader.Age)] * this.technologyEnhancedSurvivability;
                    let ticklyDeathChance = 0;
                    if (yearlyDeathChance == 1) {
                        ticklyDeathChance = 1;
                    }
                    else {
                        //8760 ticks per year
                        ticklyDeathChance = 1 - Math.pow(1 - yearlyDeathChance, 1 / 8760);
                    }
                    if (Math.random() < ticklyDeathChance) {
                        this.government.currentLeader.isDead = true;
                    }
                }
            }


            let taxIncome = this.currencyDailyChange[this.government.currency] * this.government.taxRate;
            taxIncome = Math.min(taxIncome, this.government.stockpileMaxSize - this.government.currencyStockpile);

            if (taxIncome > 0) {
                let income = this.payCurrency(this.government.currency, taxIncome);
                this.government.currencyStockpile += income;
                if (this.government.currencyStockpile > this.government.stockpileMaxSize) {
                    this.government.currencyStockpile = this.government.stockpileMaxSize;
                }
            }
        },
        getNewGovernmentLeader() {
            if (this.government.type == "Tribal") {
                let leader = this.generateRandomPerson();
                this.government.currentLeader = leader;
            }
            if (this.government.type == "Oligarchy") {
                let leader0 = this.government.currentLeaders[0]?.isDead ? this.generateRandomPerson() : this.government.currentLeaders[0];
                let leader1 = this.government.currentLeaders[1]?.isDead ? this.generateRandomPerson() : this.government.currentLeaders[1];
                let leader2 = this.government.currentLeaders[2]?.isDead ? this.generateRandomPerson() : this.government.currentLeaders[2];
                this.government.currentLeaders = [
                    leader0,
                    leader1,
                    leader2
                ]
            }
        },
        getGovernmentEfficiency() {
            let govType = this.governmentTypes[this.government.type];
            if (!govType) {
                return 0;
            }
            let base = govType.baseEfficiency;
            let reduction = this.getPopulation() * this.government.efficiencyPerCapita;
            let governmentWorker = this.professions.find(x => x.Name == 'Government Worker');
            let boost = (governmentWorker?.Count ?? 0) * govType.efficiencyPerEmployee;
            let calculated = base - reduction + boost;
            return Math.max(calculated, 0);
        },
        generateRandomPerson(minAge = 30, maxAge = 60) {
            let person = {
                Name: this.getVillagerName(),
                Age: Math.random() * (maxAge - minAge) + minAge,
                isDead: false,
            }
            return person;
        },
        processHistoricalValues() {
            let pairs = [
                ['UnmetDemands', this.unmetdemand],
                ['Real Production', this.previousTickProductionValues],
                ['Uncapped Production', this.uncappedTickProductionValues],
                ['Uncapped Consumption', this.uncappedTickConsumptionValues],
                ['Currencies', Object.fromEntries(
                    Object.entries(this.currencydata)
                        .filter(([_, v]) => v.Amount && v.Amount > 0)
                        .map(([key, val]) => [key, val.Amount ?? 0])
                )],
                ['Population', {
                    ...Object.fromEntries(
                        Object.entries(this.getVisibleProfessions())
                            .map(([key, val]) => [val.Name, val.Count ?? 0])
                    ),
                    Total: this.getPopulation()
                }],
            ];
            for (let pair of pairs) {
                this.processHistoricalValue(pair[0], pair[1]);
                if (this.currentTick % 33 == 0) {
                    this.processHistoricalValueMinute(pair[0], pair[1]);
                    this.minuteTick++;
                    if (this.currentTick % 60 == 0) {
                        this.processHistoricalValueHour(pair[0], pair[1]);
                        this.hourTick++;
                    }
                }
            }
        },
        pushHistoricalValues(store, key, idx, data){
            if (!store[key]) {
                store[key] = [];
            }
            let jsonData = JSON.parse(JSON.stringify(data));
            store[key].push({ [idx]: jsonData });
            if (store[key].length >= this.maxHistory) {
                store[key].shift();
            }
        },
        processHistoricalValue(key, data) {
            this.pushHistoricalValues(this.historicalValues, key, this.currentTick, data);
        },
        processHistoricalValueMinute(key, data) {
            this.pushHistoricalValues(this.historicalValuesMinute, key, this.minuteTick, data);
        },
        processHistoricalValueHour(key, data) {
            this.pushHistoricalValues(this.historicalValuesHour, key, this.hourTick, data);
        },
        generateAgeBracketChart() {
            const existingChart = Chart.getChart('agebrackets');
            const mappedData = Object.entries(this.yearlyAgeBuckets).map(([age, count]) => ({
                x: Number(age),
                y: count
            }));
            const datasets = [{
                label: 'Count',
                data: mappedData,
                borderWidth: 3,
                borderColor: 'red',
                fill: true,
                pointStyle: false,
                tension: 0.5
            }
            ];
            if (existingChart) {
                Vue.nextTick(() => {
                    existingChart.data.datasets[0].data = mappedData;
                    existingChart.update('none');
                });
            }
            else {
                Vue.nextTick(() => {
                    new Chart(document.getElementById('agebrackets'), {
                        type: 'bar',
                        data: {
                            datasets
                        },
                        options: {
                            responsive: true,
                            animations: { y: false },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Age Brackets'
                                },
                                legend: {
                                    position: 'bottom'
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                }
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            },
                            scales: {
                                x: {
                                    type: 'linear',
                                    title: {
                                        display: true,
                                        text: 'Age'
                                    },
                                    min: 0,
                                    max: 120,
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Population'
                                    },
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });

            }



        },
        generateChart(data, id) {
            if (this.currentMenu != 'Charts') {
                return;
            }
            if (!data || data.length == 0) {
                return;
            }
            const labels = data.map(obj => Object.keys(obj)[0]);

            let label = labels.at(-1);
            let last = data.at(-1);

            let resourceKeys = Object.keys(last[label]);

            const datasets = resourceKeys.map(key => ({
                label: key,
                data: data.map(obj => obj[Object.keys(obj)[0]][key]),
                borderWidth: 3,
                borderColor: this.keyColors[key],
                fill: false,
                pointStyle: false,
                tension: 0.5
            }));
            const existingChart = Chart.getChart(id);

            if (existingChart) {
                Vue.nextTick(() => {
                    const hiddenStates = existingChart.legend.legendItems.map(x => x.hidden);

                    existingChart.data = {
                        labels,
                        datasets
                    };
                    if (this.chartMenu.chartTime == 'Every Tick' && this.currentTick > 1000) {
                        existingChart.options.scales.x.min = this.currentTick - 1000;
                        existingChart.options.scales.x.max = this.currentTick;
                    }
                    else if (this.chartMenu.chartTime == 'Minute') {
                        if (this.minuteTick > 1000) {
                            existingChart.options.scales.x.min = this.minuteTick - 1000;
                            existingChart.options.scales.x.max = this.minuteTick;
                        }
                        else {
                            existingChart.options.scales.x.min = 0;
                            existingChart.options.scales.x.max = 1000;
                        }
                    }
                    else if (this.chartMenu.chartTime == 'Hour') {
                        if (this.hourTick > 1000) {
                            existingChart.options.scales.x.min = this.hourTick - 1000;
                            existingChart.options.scales.x.max = this.hourTick;
                        }
                        else {
                            existingChart.options.scales.x.min = 0;
                            existingChart.options.scales.x.max = 1000;
                        }
                    }

                    hiddenStates.forEach((hidden, i) => {
                        existingChart.setDatasetVisibility(i, !hidden)
                    });
                    existingChart.update('none');


                });
            }
            else {
                Vue.nextTick(() => {
                    new Chart(document.getElementById(id), {
                        type: 'line',
                        data: {
                            labels,
                            datasets
                        },
                        options: {
                            responsive: true,
                            animations: { y: false },
                            plugins: {
                                title: {
                                    display: true,
                                    text: id
                                },
                                legend: {
                                    position: 'bottom'
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                }
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            },
                            scales: {
                                x: {
                                    type: 'linear',
                                    title: {
                                        display: true,
                                        text: 'Ticks'
                                    },
                                    min: 1,
                                    max: 1000,
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Resource Amount'
                                    },
                                    beginAtZero: false
                                }
                            }
                        }
                    });
                });
            }

        },
        processProductionModifiers() {
            for (let prodMod of this.productionModifiers) {
                if (prodMod.IsUnlocked == false) {
                    prodMod.IsUnlocked = this.hasRequirements(prodMod);
                    if (prodMod.IsUnlocked) {
                        this.prodModCache = {};
                    }
                }
            }
        },
        buildBuilding(houseType, amount = 1) {
            let target = this.buildingdata.find(x => x.Name.toLowerCase() == houseType.Name.toLowerCase());
            let actual = 0;
            if (target) {
                for (let i = 0; i < amount; i++) {
                    if (this.buy(target.Cost, 1, 'Building ' + target.Name)) {
                        target.Count++;
                        actual++;
                    }
                    else {
                        console.log("Failed to build");
                        break;
                    }
                }

            }
            return actual;
        },
        demolishBuilding(houseType, amount = 1) {
            let target = this.buildingdata.find(x => x.Name.toLowerCase() == houseType.Name.toLowerCase());
            let actual = 0;
            let spaceCost = this.getBuildingSpaceCost(houseType);
            if (target) {
                for (let i = 0; i < amount; i++) {
                    if (this.canDemolish(houseType)) {
                        target.Count--;
                        actual++;
                    }
                    else {
                        break;
                    }
                }

            }
            this.addCurrency("Space", spaceCost * actual, "Demolishing " + actual + ' ' + this.toProperPluralize(houseType.Name, actual));
            return actual;
        },
        canDemolish(houseType) {
            if (houseType.Name == 'Hut' && houseType.Count == 1) {
                return false;
            }
            if (houseType.Count == 0) {
                return false;
            }
            return true;
        },
        getCurrencyStorage(currencyName) {
            let currency = this.currencydata[currencyName];
            if (currency.Type == 'Nonphysical Good') {
                return -1;
            }
            return currency.MaxStock;
        },
        getCurrencyStorageUpgradeCostDescription(currencyName) {
            let currency = this.currencydata[currencyName];
            if (currency.Type == 'Nonphysical Good') {
                return 'This currency has no physical storage, so you can\'t upgrade it even if you want to. You might wonder why this button even exists, then. What is the purpose of a button that you can\'t ever click? Is it just a waste of space? I mean, yeah, kinda.';
            }
            let cost = currency.MaxStock / 2;
            return `Upgrade ${currencyName} storage by 2x for the cost of ${this.formatNumber(cost)} <img class="image-icon" src="${currency.Icon}" />.`;
        },
        canAffordCurrencyStorageUpgrade(currencyName) {
            let currency = this.currencydata[currencyName];
            if (currency.Type == 'Nonphysical Good') {
                return false;
            }
            let cost = currency.MaxStock / 2;
            return this.canAfford({ [currencyName]: cost });
        },
        upgradeCurrencyStorage(currencyName, amount) {
            let currency = this.currencydata[currencyName];
            if (currency.Type == 'Nonphysical Good') {
                return false;
            }
            let cost = currency.MaxStock / 2;
            if(this.buy({ [currencyName]: cost }, 1, `Upgrading ${currencyName} Storage`)){
                currency.MaxStock *= 2;
                return true;
            }
            return false;
        },
        getCurrencyByName(currencyName) {
            return this.currencydata[currencyName];
        },
        getCurrentModifiers() {
            return this.productionModifiers.filter(x => x.IsUnlocked == true).flatMap(modifier =>
                modifier.Boosts.map(boost => ({
                    modifierName: modifier.Name,
                    boost,
                    requirements: modifier.Requirements
                }))
            );
        },
        getModifierTypeDescription(modifierType) {
            if (modifierType == 'Additive') {
                return '+';
            }
            else if (modifierType == 'Multiplicative') {
                return 'x';
            }
            console.error('Yo this modifier type doesn\'t exist!', modifierType);
            return '';
        },
        processDeaths() {
            let { deathOdds, possibleCauses } = this.calculateDeathOdds();
            this.applyDeathsToAgeBuckets(deathOdds, possibleCauses);
            if (this.getPopulation() == 0) {
                this.logit('Everyone is dead.');
            }
        },
        calculateDeathOdds() {
            let deathOdds = 0;
            let homelessRate = this.getHomelessnessRatio();
            let possibleCauses = {
                "Natural Causes": "has died of natural causes.",
            };

            if(this.currencydata.Food.Amount == 0){
                deathOdds += this.starvationDeathOdds;
                possibleCauses["Starvation"] = "has died of starvation.";
            }

            if (homelessRate > 0) {
                deathOdds += homelessRate / 10;
                possibleCauses["Homelessness"] = "has died homeless.";
            }

            if (this.gravity == 0) {
                deathOdds = 1;
                possibleCauses["No Gravity"] = "has floated off into space.";
            }
            else if (this.gravity > 25) {
                deathOdds = 0.03 * this.gravity;
                possibleCauses["High Gravity"] = "has been crushed by extreme gravity.";
            }

            if (this.previousWeather?.temp < -40) {
                deathOdds += (Math.abs(this.previousWeather?.temp) - 40) / 100;
                possibleCauses["Low Sun"] = "has frozen in the low sunlight.";
            }
            else if (this.previousWeather?.temp > 120) {
                deathOdds += (this.previousWeather?.temp - 120) / 100;
                possibleCauses["Extreme Sun"] = "has fried in the sun.";
            }
            return { deathOdds, possibleCauses };
        },
        applyDeathsToAgeBuckets(deathOdds, possibleCauses) {
            for (let i = 119; i > 15; i--) {
                let totalDeathOdds = deathOdds + this.ageDeathProbabilityTable[i];
                let bucketSize = this.yearlyAgeBuckets[i];

                if (bucketSize == 0) {
                    continue;
                }
                let roll = Math.random();
                let out = roll * totalDeathOdds * this.yearlyAgeBuckets[i];
                let deaths = Math.round(out) + (Math.random() < (out % 1) ? 1 : 0);
                if (deaths <= 0) {
                    continue;
                }

                deaths = Math.min(deaths, bucketSize);
                console.log("Processing deaths for age", i, "deaths: ", deaths);
                this.yearlyAgeBuckets[i] -= deaths;
                this.distributeDeathsToProfessions(deaths, possibleCauses);
            }
        },
        distributeDeathsToProfessions(deaths, possibleCauses) {
            let remaining = deaths;
            let mortals = this.professions.filter(x => x.Mortal);
            let totalMortals = mortals.reduce((a, b) => a + b.Count, 0);
            if (totalMortals == 0) {
                return;
            }

            for (let prof of mortals) {
                if (remaining <= 0) {
                    break;
                }

                let scaled = Math.round((prof.Count / totalMortals) * deaths);
                let toDie = Math.min(scaled, prof.Count, remaining);
                if (toDie > 0) {
                    this.doDeathSteps(prof, toDie);
                    remaining -= toDie;

                    let keys = Object.keys(possibleCauses);
                    let reason = keys[Math.floor(Math.random() * keys.length)];
                    if (this.getPopulation() < 1000) {
                        this.logit(this.getNameOrProfession(prof, toDie) + ` ${possibleCauses[reason]}`);
                    }

                }
            }
            if (remaining > 0) {
                let largest = mortals.filter(p => p.Count > 0).sort((a, b) => b.Count - a.Count)[0];
                if (largest) {
                    let absorb = Math.min(remaining, largest.Count);
                    this.doDeathSteps(largest, absorb);
                    let keys = Object.keys(possibleCauses);
                    let reason = keys[Math.floor(Math.random() * keys.length)];
                    if (this.getPopulation() < 1000) {
                        this.logit(this.getNameOrProfession(largest, remaining) + ` ${possibleCauses[reason]}`);
                    }
                }
            }

            if (remaining > 0) {
                console.log("Somebody shoulda got got but didnt get got.");
            }
        },
        doDeathSteps(profession, amount){
            this.fire(profession, amount);
            this.modifyUnemployed(-amount);
            if(!this.missingProfessionCounts[profession.Name]){
                this.missingProfessionCounts[profession.Name] = 0;
            }
            if(profession.Name != 'Unemployed'){
                this.missingProfessionCounts[profession.Name] += amount;
            }
            
        },  
        getHomelessnessRatio() {
            let population = this.getPopulation();
            if (population == 0) {
                return 0;
            }
            let housing = this.getTotalHousing();
            if (housing >= population) {
                return 0;
            }

            return Math.abs((housing - population) / population);
        },
        reduceRandomYearlyBucket(amount) {
            const total = this.yearlyAgeBuckets.reduce((a, b) => a + b, 0);
            if (amount > total) {
                return;
            }
            const nonZero = [];
            for (let i = 0; i < this.yearlyAgeBuckets.length; i++) {
                if (this.yearlyAgeBuckets[i] > 0) {
                    nonZero.push(i);
                }
            }

            while (amount > 0) {
                const r = Math.floor(Math.random() * nonZero.length);
                const idx = nonZero[r];

                this.yearlyAgeBuckets[idx]--;
                amount--;

                if (this.yearlyAgeBuckets[idx] === 0) {
                    nonZero[r] = nonZero[nonZero.length - 1];
                    nonZero.pop();
                }
            }

        },
        die(profession, amount, reason = '') {
            if (profession.Count == 0) {
                return;
            }
            let actual = 0;
            for (var i = 0; i < amount; i++) {
                if (this.fire(profession)) {
                    this.modifyUnemployed(-1);
                    this.reduceRandomYearlyBucket(1);
                    actual++;
                }
            }
            if (!this.missingProfessionCounts[profession.Name]) {
                this.missingProfessionCounts[profession.Name] = 0;
            }
            if (profession.Name != 'Unemployed' && profession.Mortal) {
                this.missingProfessionCounts[profession.Name] += amount;
            }

            if (actual == 0) {
                if (amount != 0) {
                    console.error("Yo " + amount + " " + profession.Name + " were supposed to die but we couldn't fire them. ");
                }
            }
            else {
                if (this.getPopulation() < 1000) {
                    this.logit(this.getNameOrProfession(profession, actual) + ` ${reason}.`);
                }
            }
        },
        getTimeToFullStockpile(currency) {
            if (currency.Name == "Housing") {
                return "Housing is as much as is built. We can build more housing in the Buildings menu.";
            }
            if (currency.Type == "Nonphysical Good") {
                return currency.Name + " isn't real, and has no known limits of storage.";
            }
            let full = this.getCurrencyStorage(currency.Name);
            let current = currency.Amount;
            let change = this.currencyDailyChange[currency.Name];
            if (change > 0) {
                let timeToHappen = Math.abs((full - current) / change);
                let time = this.ticksToTime(timeToHappen);
                return "Our " + currency.Name + " will fill our storage in " + time;
            }
            if (change < 0) {
                let timeToHappen = Math.abs(current / change);
                let time = this.ticksToTime(timeToHappen);
                return "Our " + currency.Name + " will run out in " + time;
            }
            else {
                return "Our " + currency.Name + " is unchanging.";
            }
        },
        resetDemands() {
            for (let key in this.demand) {
                if (Object.prototype.hasOwnProperty.call(this.demand, key)) {

                    this.demand[key] = 0;

                }
            }
            this.currencyDemandDescriptions = {};
        },
        modifyDemand(good, amount, reason) {
            if (amount == 0) {
                return;
            }
            if (this.currencyDemandDescriptions[good]) {
                this.currencyDemandDescriptions[good].push([good, this.formatNumber(amount), reason]);
            }
            else {
                this.currencyDemandDescriptions[good] = [[good, this.formatNumber(amount), reason]];
            }
            this.demand[good] = (this.demand[good] ?? 0) + amount;
        },
        processProfessionDemand() {
            let totalPop = 0;
            for (let prof of this.professions) {
                for (let demandedGood of Object.keys(prof.BaseDemand)) {
                    this.modifyDemand(demandedGood, prof.BaseDemand[demandedGood] * prof.Count, prof.Name + ' Base Demand');
                }
                for (let demandedGood of Object.keys(prof.ModifiedDemand)) {
                    this.modifyDemand(demandedGood, prof.ModifiedDemand[demandedGood] * prof.Count, prof.Name + ' Modified Demand');
                }
                if(prof.Mortal){
                    totalPop += prof.Count;
                }
                
            }
        },
        processTechnologyDemand() {
            let population = this.getEffectivePopulation();
            for (let tech of this.technologies) {
                if (tech.isLocked == false) {
                    for (let [good, mod] of Object.entries(tech.demandModifiers.Global)) {
                        this.modifyDemand(good, mod, "From " + tech.Name);
                    }
                    for (let [good, mod] of Object.entries(tech.demandModifiers.PerCapita)) {
                        this.modifyDemand(good, mod * population, "Per Capita from " + tech.Name);
                    }
                    for (let [profName, goods] of Object.entries(tech.demandModifiers)) {
                        if (profName == 'Global' || profName == 'PerCapita') {
                            continue;
                        }
                        const prof = this.professions.find(p => p.Name == profName);

                        for (let [good, mod] of Object.entries(goods)) {
                            this.modifyDemand(good, mod * prof.Count, `From ${prof.Name} and Tech ${tech.Name}`);
                        }
                    }
                }
            }
        },
        processUnmetDemand() {
            for (let currency of Object.values(this.currencydata)) {
                let beginTickAmount = this.beginTickCurrencyValues[currency.Name]?.Amount;
                let endAmount = this.endTickCurrencyValues[currency.Name]?.Amount;
                let dailyChange = (endAmount - beginTickAmount);
                this.currencyDailyChange[currency.Name] = dailyChange;
            }
        },
        processDemand() {
            this.resetDemands();
            this.processProfessionDemand();
            this.processTechnologyDemand();
            this.processUnmetDemand();
        },
        getDailyChange(currencyName) {
            return (this.endTickCurrencyValues[currencyName]?.Amount - this.beginTickCurrencyValues[currencyName]?.Amount) * 24;
        },
        processQOL() {
            let hides = Math.min(this.getPopulation(), this.currencydata.Hides.Amount);
            let hideConsumptionRate = 0.1;
            let hideQOLBoost = hides * hideConsumptionRate;
            this.QOL += hideQOLBoost;
            this.QOL *= this.QOLDecay;
        },
        processTechnology() {
            if (!this.focusedTechnology) {
                return;
            }
            let scholars = this.professions.filter(x => x.Name == "Scholar");
            if (!scholars) {
                return;
            }

            const needed = this.focusedTechnology.Complexity - this.focusedTechnology.Progress;
            let usable = Math.min(this.focusedTechnology.Complexity / 10, this.currencydata["Knowledge"].Amount, needed);
            if (usable <= 0) {
                return;
            }

            this.focusedTechnology.Progress += usable;
            this.payCurrency('Knowledge', usable, 'For the advancement of ' + this.focusedTechnology.Name);

            if (this.focusedTechnology.Progress >= this.focusedTechnology.Complexity) {
                this.focusedTechnology.Unlock(this);
                if (this.focusedTechnology.Name == "Firemaking") {
                    this.incrementGoalLevel(1);
                }
                else if (this.focusedTechnology.Name == "Pottery") {
                    this.incrementGoalLevel(2);
                }
                else if (this.focusedTechnology.Name == "Clay Bullae") {
                    this.incrementGoalLevel(3);
                }
                else if (this.focusedTechnology.Name == "Writing") {
                    this.incrementGoalLevel(4);
                }
                else if (this.focusedTechnology.Name == "Numbers") {
                    this.incrementGoalLevel(5);
                }
                else if (this.focusedTechnology.Name == "Taxation") {
                    this.incrementGoalLevel(6);
                }
                else if (this.currentGoalLevel == 6) {
                    this.incrementGoalLevel(7);
                }
                console.log("Finished technology:", this.focusedTechnology.Name, this.currentTick * this.tickspeed / 1000, "seconds");
                this.focusedTechnology = null;

            }
        },
        processBuildings() {
            for (let building of this.buildingdata) {
                this.processBuildingConsumption(building.Name);
                this.processBuildingProduction(building.Name);
            }
        },
        toProperPluralize(word, number) {
            if (number == 1) {
                return pluralize.singular(word);
            }
            return pluralize.plural(word);
        },
        hasAvailableHousing() {
            return this.getPopulation() < this.getTotalHousing();
        },
        getAvailableHousing() {
            return this.getTotalHousing() - this.getPopulation();
        },
        getAvailableHousingMessage() {
            let housing = this.getAvailableHousing();
            if (housing <= 0) {
                return "We are out of housing. We need to build more to keep growing.";
            }
            if (housing == 1) {
                return `We have housing for ${this.formatNumber(housing)} more person. We should consider building more soon.`;
            }
            return `We have housing for ${this.formatNumber(housing)} more people.`;
        },
        checkUnlocks() {
            for (let unlockable of this.unlockablesdata) {
                if (unlockable.isLocked) {
                    let hasResources = this.canAfford(unlockable.Cost);
                    let hasRequirements = unlockable.Requirements ? this.hasRequirements(unlockable) : true;
                    if (hasResources && hasRequirements) {
                        unlockable.Unlock(this);
                    }
                }
            }
            for (let currency of Object.keys(this.currencydata)) {
                if (this.currencydata[currency].Unlocked == false && this.currencydata[currency].Amount > 0) {
                    this.currencydata[currency].Unlocked = true;
                }
            }
        },
        getDailyChangeDescription(currency) {
            let output = '';
            let anyreason = false;
            for (let reason of this.currencyProductionDescriptions[currency.Name] ?? []) {
                output += reason[2] + ': ' + reason[1] + '\n';
                anyreason = true;
            }

            for (let reason of this.currencyConsumptionDescriptions[currency.Name] ?? []) {
                output += reason[2] + ': ' + reason[1] + '\n';
                anyreason = true;
            }
            if (currency.Name == 'Housing') {
                return "Housing is a special resource. It is consumed by population, and created by specific buildings. If you run out of housing, your population will stop growing. If you destroy housing, your population might become homeless.";
            }
            if (!anyreason) {
                return "This is neither currently produced nor consumed.";
            }
            return output;
        },
        getDailyDemandDescription(currency) {
            let output = '';
            for (let reason of this.currencyDemandDescriptions[currency.Name] ?? []) {
                output += reason[2] + ': ' + reason[1] + '\n';
            }
            if (output == '') {
                return "There doesn't appear to be any reason for any demand here.";
            }
            return output;
        },
        getDemolishInfo(housingType) {
            if (housingType.Count == 0) {
                return "You can't demolish a building that doesn't exist.";
            }
            if (housingType.Name == 'Hut' && housingType.Count == 1) {
                return "You can't demolish our last hut, even if you think it would be really funny.";
            }
            let spaceCost = this.getBuildingSpaceCost(housingType);
            return "Demolishing this building would free up " + this.formatNumber(spaceCost) + " Space for our people. None of the costs of building would be returned.";
        },
        getBuildingSpaceCost(housingType) {
            let spaceCost = 0;

            for (let [c, price] of Object.entries(housingType.Cost)) {
                if (c == "Space") {
                    spaceCost = price;
                    break;
                }
            }
            return spaceCost;
        },
        getTechnologyProgressDescription(technology) {
            let output = 'We have researched ' + this.formatNumber(technology.Progress) + ' of ' + this.formatNumber(technology.Complexity) + ' so far.';
            let knowledgeSpeed = this.tickProductionValues['Knowledge'];
            let currentKnowledge = this.currencydata['Knowledge'].Amount ?? 0;
            if (knowledgeSpeed <= 0) {
                return output + '\n' + "We will never finish researching this.";
            }
            let timeRequired = (technology.Complexity - technology.Progress - currentKnowledge) / knowledgeSpeed;
            let t = this.ticksToTime(timeRequired);
            if (this.focusedTechnology == technology) {
                return output + '\n' + 'This will be completed in ' + t;
            }

            return output + '\n' + 'This could be completed in ' + t;
        },
        addCurrency(currencyName, amount, reason) {
            let storage = this.getCurrencyStorage(currencyName);
            this.currencyPotentialChange[currencyName] = (this.currencyPotentialChange[currencyName] ?? 0) + amount;
            let c = this.currencydata[currencyName];
            this.uncappedTickProductionValues[currencyName] += amount;
            if (c.Amount + amount > storage && storage != -1) {
                amount = this.getCurrencyStorage(currencyName) - c.Amount;
                reason += " (Capped by Storage)";
                c.IsCapped = true;
            }

            if (this.currencyProductionDescriptions[currencyName]) {
                this.currencyProductionDescriptions[currencyName].push([currencyName, this.formatNumber(amount), reason]);
            }
            else {
                this.currencyProductionDescriptions[currencyName] = [[currencyName, this.formatNumber(amount), reason]];
            }
            if (isNaN(amount)) {
                console.error("bad(NaN) value for pay currency", currencyName, reason);
                return false;
            }
            this.tickProductionValues[currencyName] += amount;
            c.Amount += amount;
        },
        payCurrency(currencyName, amount, reason, payEvenIfYouCantAfford = false) {
            if (isNaN(amount)) {
                console.error("bad(NaN) value for pay currency", currencyName, reason);
                return false;
            }
            this.currencyPotentialChange[currencyName] = (this.currencyPotentialChange[currencyName] ?? 0) - amount;
            this.uncappedTickConsumptionValues[currencyName] -= amount;
            let c = this.currencydata[currencyName];
            if (!c) {
                console.error(currencyName, 'is not in the currency data.');
                return 0;
            }
            c.IsCapped = false;
            if (this.currencyConsumptionDescriptions[currencyName]) {
                this.currencyConsumptionDescriptions[currencyName].push([currencyName, this.formatNumber(amount), reason]);
            }
            else {
                this.currencyConsumptionDescriptions[currencyName] = [[currencyName, this.formatNumber(amount), reason]];
            }
            if (c.Amount < amount && !payEvenIfYouCantAfford) {
                return 0;
            }
            if (payEvenIfYouCantAfford && amount > c.Amount) {
                amount = c.Amount
            }

            c.Amount -= amount;

            return amount;
        },
        processBaseGrowth() {
            if (this.getPopulation() == 0) {
                if (this.gravity == 0) {
                    this.logit("There isn't enough gravity for anyone to join your civilization.");
                }
                else if (this.gravity > 25) {
                    this.logit("There's way too much gravity for anyone to join your civilization.");
                }
                else if (this.sunlight > 1.5) {
                    this.logit("There's way too much sunlight for anyone to join your civilization.");
                }
                else if (this.sunlight < 0.8) {
                    this.logit("There's not enough sunlight for anyone to join your civilization.");
                }
                else {
                    this.logit("Despite extreme mismanagement of your state, some wanderers have joined your civilization.");
                    this.professions.find(x => x.Name == "Unemployed").Count = 5;
                    this.yearlyAgeBuckets[17] = 5;
                }

            }

            let canGrow = this.nationCanGrow();

            this.addCurrency('Food', 10, 'Base Production');
            this.addCurrency('Water', 15, 'Base Production');
            this.addCurrency('Knowledge', this.getAdultPopulation() * 0.005, 'From Population');

            if (canGrow) {
                let foodRatio = Math.min((this.currencydata.Food.Amount / this.growthThreshold), 1);
                let waterRatio = Math.min((this.currencydata.Water.Amount / this.growthThreshold), 1);
                let parentToChildRatio = this.getInfantToParentRatio();
                let growthChance = this.basePopulationGrowthChance * foodRatio * waterRatio * parentToChildRatio;
                //console.log("Growth Chance: ", growthChance);
                let rand = Math.random();
                if (rand < growthChance) {
                    this.professions.find(x => x.Name == "Infant").Count += 1;
                    this.monthlyAgeBuckets[0] += 1;

                    this.addPopulationGrowthMessage();
                }
            }
        },
        nationCanGrow(includeReason = false) {
            if(!this.previousTickUncappedProductionValues){
                return false;
            }
            let foodProd = this.previousTickUncappedProductionValues['Food'];
            let waterProd = this.previousTickUncappedProductionValues['Water'];
            let foodConsumpt = this.previousTickConsumptionValues['Food'];
            let waterConsumpt = this.previousTickConsumptionValues['Water'];
            let growthThreshold = this.growthThreshold;
            let foodTotal = this.currencydata['Food'].Amount;
            let waterTotal = this.currencydata['Water'].Amount;
            let hasFood = foodProd + foodConsumpt >= growthThreshold && foodTotal > 0;
            let hasWater = waterProd + waterConsumpt >= growthThreshold && waterTotal > 0;
            if (includeReason && (!hasFood || !hasWater)) {
                let reasons = ['Our nation cannot grow right now:'];
                if (foodProd + foodConsumpt > growthThreshold == false) {
                    reasons.push('Our people are consuming almost all our food production.');
                }
                if (waterProd + waterConsumpt > growthThreshold == false) {
                    reasons.push('Our people are consuming almost all our water.');
                }
                if (foodTotal <= 0) {
                    reasons.push('Our people are out of food');
                }
                if (waterTotal <= 0) {
                    reasons.push('Our people are out of water.');
                }
                let parents = 0;
                for (let i = 15; i < 40; i++) {
                    parents += this.yearlyAgeBuckets[i];
                }
                if(parents == 0){
                    reasons.push('We have no parents to have children.');
                }
                let piRatio = this.getInfantToParentRatio();
                if(piRatio == 0){
                    reasons.push('All possible parents already have as many children as they can.');
                }
                return [hasFood && hasWater, reasons];
            }
            return hasFood && hasWater;
        },
        getNationGrowthIssues() {
            return this.nationCanGrow(true)[1];
        },
        getInfantToParentRatio() {
            let infants = 0;
            for (let i = 0; i < 10; i++) {
                infants += this.monthlyAgeBuckets[i];
            }
            let parents = 0;
            for (let i = 15; i < 40; i++) {
                parents += this.yearlyAgeBuckets[i];
            }
            //console.log(parents, infants);
            if (parents == 0) {
                return 0;
            }

            return 1 - (infants / parents);
        },
        addPopulationGrowthMessage() {
            if (this.hasAvailableHousing()) {
                if (this.getPopulation() < 200) {
                    this.logit(`A new child has been born to our people. Their name is ${this.getVillagerName()}.`);
                }
                else {
                    this.logit(`Your population has grown. (${this.formatNumber(this.getPopulation())})`);
                }
            }
            else {
                this.logit(`Your population has grown to ${this.formatNumber(this.getPopulation())} and now is filling your housing. Build more houses to continue to grow.`);
            }
            if (this.getPopulation() == 200) {
                this.logit("Your population has grown beyond what a person can individually manage. Now you must direct our people through vague lies and secret processes.");
            }
        },
        setTooltipData(text, isHtml, eventData, calcfrom) {
            this.activeTooltipData = { text: text, isHtml: isHtml, visible: true, data: eventData, calcfrom };
        },
        clearTooltipData() {
            this.activeTooltipData = {};
        },
        processCosts() {
            for (let profession of this.professions) {
                if (profession.Count > 0 && !this.canAfford(profession.Cost, profession.Count, "Cost of " + profession.Name)) {
                    for (const key in profession.Cost) {
                        if (Object.hasOwn(this.unmetdemand, key)) {
                            this.unmetdemand[key] += profession.Cost[key];
                        } else {
                            this.unmetdemand[key] = profession.Cost[key];
                        }
                    }
                }
            }
            for (let [good, demand] of Object.entries(this.demand)) {
                if (good == 'Space' || good == 'Knowledge' || good == 'Housing') {
                    continue;
                }
                //demand is NaN on first run for some reason.
                if (!isNaN(demand)) {
                    let obj = {}
                    obj[good] = demand;
                    this.pay(obj, 1, "Demand for " + good);
                    this.unmetdemand[good] -= demand;
                }

            }
        },
        processProfessions() {
            this.processUnemployed();
            this.processFarmers();
            this.processLumberjacks();
            this.processFishermen();
            this.processCarpenters();
            this.processTanners();
            this.processOverseers();
            this.processIrrigationWorkers();
            this.processMiners();
            this.processMetalurgists();
            this.processMetalworkers();
            this.processSurveyors();

            this.processPotters();
            this.processConstructionWorkers();
        },
        processConstructionWorkers() {
            this.processWorker('Construction Worker');
        },
        processUnemployed() {
            //Check if any jobs are missing workers and assign them there
            for (let [prof, missingCount] of Object.entries(this.missingProfessionCounts)) {
                if (missingCount > 0) {
                    let actual = this.hire(this.professions.find(x => x.Name == prof), missingCount);
                    this.missingProfessionCounts[prof] -= actual;
                    if (actual == 0) {
                        break;
                    }
                }
            }
            this.processWorker('Unemployed');
        },
        processSurveyors() {
            this.processWorker('Surveyor');
        },
        processOverseers() {
            this.processWorker('Overseer');
        },
        processIrrigationWorkers() {
            this.processWorker('Irrigation Worker');
        },
        processTanners() {
            this.processWorker('Tanner');
        },
        processCarpenters() {
            this.processWorker('Carpenter');
        },
        processLumberjacks() {
            this.processWorker('Lumberjack');
        },
        processFishermen() {
            this.processWorker('Fisherman');
        },
        processFarmers() {
            this.processWorker('Farmer');
        },
        processMetalurgists() {
            this.processWorker('Bronze Metalurgist');
            this.processWorker('Iron Metalurgist');
        },
        processMetalworkers() {
            this.processWorker('Bronze Metalworker');
        },
        processMiners() {
            this.processWorker('Miner');
        },
        processPotters() {
            this.processWorker('Potter');
        },
        processWorker(name) {
            const worker = this.professions.find(p => p.Name == name);
            if (!worker) {
                return;
            }
            const count = worker ? worker.Count : 0;
            if (count == 0) {
                return;
            }
            let fullAffordProdMod = 1;
            if (!this.canAfford(worker.Cost)) {
                fullAffordProdMod = this.getWorkerCostRatio(worker.Cost, worker.CostIsRequiredForOutput);
            }
            for (let [currency, production] of this.getActualProduction(worker)) {
                let reason = "Produced by " + name;
                let finalProd = production;
                let costIsRequired = worker.CostIsRequiredForOutput?.[currency];
                if (costIsRequired) {
                    finalProd *= fullAffordProdMod;
                    if (fullAffordProdMod != 1) {
                        reason += `(Reduced by ${Math.round(fullAffordProdMod * 100)}% due to lack of resources.)`;
                    }
                }


                this.addCurrency(currency, finalProd, reason);
            }
        },
        getWorkerCostRatio(cost) {
            let actual = 1;
            for (let [currency, amount] of Object.entries(cost)) {
                let current = this.currencydata[currency];

                if(!current){
                    console.error("Invalid currency name for cost:", cost, currency);
                }
                if (current.Amount == 0) {
                    return 0;
                }
                if(amount == 0){
                    return 1;
                }
                let ratio = current / amount;
                if (ratio < actual) {
                    actual = ratio;
                }
            }
            return actual;
        },
        processBuildingConsumption(name) {
            const building = this.buildingdata.find(x => x.Name == name);
            if (!building.Consumes) {
                return;
            }

            let count = building.Count;
            for (let [currency, amount] of Object.entries(building.Consumes)) {
                let produced = amount * count;
                this.payCurrency(currency, produced, "Consumed by " + name);
            }
        },
        processBuildingProduction(name) {
            const building = this.buildingdata.find(x => x.Name == name);
            if (!building.Produces) {
                return;
            }

            for (let [currency, production] of this.getActualProduction(building)) {
                this.addCurrency(currency, production, "Produced by " + name);
            }
        },
        getActualProduction(producer, customAmount = -1) {
            let output = [];
            let count = producer.Count;
            if (customAmount != -1) {
                count = customAmount;
            }
            const [additiveModifiers, multModifiers] = this.getProductionModifiers(producer.Name);
            let childLaborProductionBoost = 0;
            if(this.getPopulation() > 0){
                childLaborProductionBoost = this.baseChildLaborProductionBoost * (this.getChildPopulation() / this.getPopulation());
            }
            const allKeys = new Set([
                ...Object.keys(producer.Produces),
                ...Object.keys(additiveModifiers)
            ]);

            for (const currency of allKeys) {
                const producedAmount = producer.Produces[currency] ?? 0;
                const additive = additiveModifiers[currency] ?? 0;
                let baseMult = (multModifiers[currency] || 1) * (multModifiers['All'] || 1);
                let baseProduction = (producedAmount + additive) * baseMult;
                let totalBase = baseProduction * count;
                let withRatio = totalBase * this.getWorkRatio();
                let produced = withRatio * (1 + childLaborProductionBoost);
                output.push([currency, produced]);
            }

            return output;
        },
        getProductionModifiers(name) {
            let cached = this.prodModCache[name];
            if (cached) {
                return cached;
            }
            let additiveModifiers = {};
            let multModifiers = {};
            for (let prod of this.productionModifiers) {
                if (prod.IsUnlocked) {
                    for (let boost of prod.Boosts) {
                        if (boost.Name == name || boost.Name == "Global") {
                            if (boost.ModifierType == "Additive") {
                                if (!additiveModifiers[boost.Currency]) {
                                    additiveModifiers[boost.Currency] = boost.Amount;
                                }
                                else {
                                    additiveModifiers[boost.Currency] += boost.Amount;
                                }
                            }
                            else if (boost.ModifierType == 'Multiplicative') {
                                if (!multModifiers[boost.Currency]) {
                                    multModifiers[boost.Currency] = boost.Amount;
                                }
                                else {
                                    multModifiers[boost.Currency] *= boost.Amount;
                                }
                            }
                        }
                    }

                }
            }
            this.prodModCache[name] = [additiveModifiers, multModifiers];
            return [additiveModifiers, multModifiers];
        },
        productionToNiceString(profession) {
            if (!profession.Produces) {
                return {};
            }
            let output = {};
            for (let [currency, produced] of this.getActualProduction(profession, 1)) {
                output[currency] = this.formatNumber(produced);
            }
            return output;
        },
        getProfessionTotalOutput(profession) {
            if (!profession.Produces) {
                return '';
            }
            let o = this.getActualProduction(profession);
            let output = {};
            for (let [k, v] of o) {
                output[k] = v;
            }
            return output;
        },
        deleteSave() {
            localStorage.removeItem('saveData');
            location.reload();
        },
        removeFromImportantStockpilesList(currencyName){
            this.stockpileMenu.importantStockpiles = this.stockpileMenu.importantStockpiles.filter(x => x != currencyName);
        },
        addToImportantStockpilesList(currencyName){
            this.stockpileMenu.importantStockpiles.push(currencyName);
        },
        getTechnologyFocusDescription(technology) {
            //Get production modifiers caused by the tech
            let output = technology.Description + '\n';
            for(let prodMod of this.productionModifiers){
                if(prodMod.Requirements && prodMod.Requirements.Technologies){
                    if(prodMod.Requirements.Technologies[0] == technology.Name){
                        output += this.getProductionModifierDescription(prodMod);
                    }
                }
            }
            //Get unlocked buildings from tech
            //Is this evil? I mean, kinda yeah but it's JS so might as well take advantage
            let src = technology?.Unlock?.toString?.() ?? "";
            const getCalls = (fnName) =>
                [...src.matchAll(new RegExp(`\\b${fnName}\\s*\\(\\s*['"\`]([^'"\`]+)['"\`]\\s*\\)`, "g"))]
                .map(m => m[1]);

            let buildings = getCalls("unlockBuilding");
            if(buildings.length > 0){
                output += `Unlocks the following buildings: ${buildings.join(', ')}.\n`;
            }
            let currencies = getCalls("unlockCurrency");
            if(currencies.length > 0){
                output += `Unlocks the following currencies:\n`;
                for(let c of currencies){
                    let currency = this.currencydata[c];
                    if(currency){
                        output += `- <img class="image-icon" src="${currency.Icon}" /> ${currency.Name}\n`;
                    }
                    else{
                        console.error("Invalid currency unlocked by tech:", c, "in tech", technology.Name);
                    }
                }
            }
                
            return output;
        },
        getProductionModifierDescription(prodMod){
            let output = '';
            for(let boost of prodMod.Boosts){
                if(boost.Currency == 'All'){
                    output += `${boost.ModifierType == 'Additive' ? `+ ${this.formatNumber(boost.Amount)}` : '+' + this.formatNumber((boost.Amount - 1) * 100) + '%'} <img class="image-icon" src="/icons/world.svg" /> for all production.\n`;

                }
                else{
                    let c = this.currencydata[boost.Currency];
                    if(!c){
                        console.error("Invalid currency for production modifier boost:", boost.Currency, prodMod);
                    }
                    output += `${boost.ModifierType == 'Additive' ? `+ ${this.formatNumber(boost.Amount)}` : '+' + this.formatNumber((boost.Amount - 1) * 100) + '%'} <img class="image-icon" src="${c.Icon}" /> for ${this.toProperPluralize(boost.Name, 2)}.\n`;

                }
            }
            return output;
        },
        hireByName(name) {
            let prof = this.professions.find(x => x.Name == name);
            if (prof) {
                this.hire(prof);
            }
        },
        tryHire(profession, amount = 1) {
            if (isNaN(amount)) {
                return false;
            }
            let maxPossible = Math.min(amount, this.getAvailableWorkers());
            if (maxPossible == 0) {
                if (!this.missingProfessionCounts[profession.Name]) {
                    this.missingProfessionCounts[profession.Name] = 0;
                }
                if (profession.Name != 'Unemployed') {
                    this.missingProfessionCounts[profession.Name] += amount;
                }
            }
            if (maxPossible > 0) {
                this.hire(profession, amount);
            }
        },
        hire(profession, amount = 1) {
            if (isNaN(amount)) {
                return false;
            }
            let maxPossible = Math.min(amount, this.getAvailableWorkers());
            if (profession.RequiredBuilding) {
                let building = this.buildingdata.find(x => x.Name == profession.RequiredBuilding);
                if (!building) {
                    console.error("Invalid building name for required building for " + profession.Name);
                }
                else {
                    let available = building.Count - profession.Count;
                    if (available <= 0) {
                        return 0;
                    }
                    maxPossible = Math.min(maxPossible, available);
                }
            }

            profession.Count += maxPossible;
            this.modifyUnemployed(-maxPossible);

            return maxPossible;
        },
        hireInfo(profession, amount = 1) {
            if (isNaN(amount)) {
                return '';
            }
            let maxPossible = Math.min(amount, this.getAvailableWorkers());
            if (profession.RequiredBuilding) {
                let building = this.buildingdata.find(x => x.Name == profession.RequiredBuilding);
                if (!building) {
                    console.error("Invalid building name for required building for " + profession.Name);
                }
                else {
                    let available = (profession.Count + amount) - building.Count;
                    if (available < 0) {
                        available = 1;
                    }
                    maxPossible = Math.min(maxPossible, available);
                }
            }
            let minimumForUsefulInfo = maxPossible;
            if (maxPossible == 0) {
                minimumForUsefulInfo = 1;
            }

            let prodDict = {};
            this.getActualProduction(profession, minimumForUsefulInfo).map(x => prodDict[x[0]] = x[1]);

            //prodDict comes pre-packed with the amount, so set the amount to 1 or the final output will ^2 the amount.
            let modified = this.relativeProductionChangeToString(profession, prodDict, 1);

            if (this.hasNumbers() == false) {
                return modified;
            }

            if (maxPossible == amount) {
                return `Hiring ${amount} ${this.toProperPluralize(profession.Name, maxPossible)} will result in:${modified}`;
            }
            return `Hiring ${amount} (Can afford ${maxPossible}) ${this.toProperPluralize(profession.Name, maxPossible)} will result in:${modified}`;

        },
        relocateInfo(profession, amount = 1) {
            if (isNaN(amount)) {
                return '';
            }
            let fireInfo = this.fireInfo(this.relocationInfo.Profession, this.relocationInfo.Amount);
            let hireInfo = this.hireInfo(profession, this.relocationInfo.Amount);
            return fireInfo + '\n' + hireInfo;
        },
        setRelocationPrimary(profession, amount) {
            if (!this.canRelocate(profession)) {
                return;
            }
            this.relocationInfo = {
                IsRelocating: true,
                Profession: profession,
                Target: null,
                Amount: amount
            }
        },
        clearRelocation() {
            this.relocationInfo = {
                IsRelocating: false,
                Profession: null,
                Target: null,
                Amount: 1
            }
        },
        tryRelocate(profession, amount = 1) {
            if (!this.relocationInfo) {
                return;
            }
            let actualAmount = Math.min(amount, this.relocationInfo.Profession.Count);
            if (actualAmount <= 0) {
                return;
            }
            this.fire(this.relocationInfo.Profession, actualAmount);
            this.hire(profession, actualAmount);
        },
        tryFire(profession, amount = 1) {
            if (!this.missingProfessionCounts[profession.Name]) {
                this.missingProfessionCounts[profession.Name] = 0;
            }

            if (this.missingProfessionCounts[profession.Name] == 0) {
                this.fire(profession, amount);
            }

            if (this.missingProfessionCounts[profession.Name] >= amount) {
                this.missingProfessionCounts[profession.Name] -= amount;
            }

            if (this.missingProfessionCounts[profession.Name] > 0 && this.missingProfessionCounts[profession.Name] < amount) {
                let remainder = amount - this.missingProfessionCounts[profession.Name];
                this.missingProfessionCounts[profession.Name] = 0;
                this.fire(profession, remainder);
            }

        },
        fire(profession, amount = 1) {
            let maxPossible = Math.min(amount, profession.Count);
            profession.Count -= maxPossible;
            this.modifyUnemployed(maxPossible);

            return maxPossible;
        },
        fireInfo(profession, amount = 1) {
            let maxPossible = Math.min(amount, profession.Count);
            let prodDict = {};
            this.getActualProduction(profession, maxPossible).map(x => prodDict[x[0]] = x[1]);
            let modified = this.relativeProductionChangeToString(profession, prodDict, -amount);

            if (this.hasNumbers() == false) {
                return modified;
            }

            return `Firing ${maxPossible} ${this.toProperPluralize(profession.Name, maxPossible)} will result in:<br/><br/>${modified}`;

        },
        canFire(profession) {
            if (profession.Count > 0) {
                return true;
            }
            if (this.missingProfessionCounts[profession.Name] > 0) {
                return true;
            }
            return false;
        },
        canHire(profession) {
            return profession.Unlocked == true
                && this.getAvailableWorkers() > 0;
        },
        canRelocate(profession) {
            if (!this.relocationInfo || !this.relocationInfo.Profession) {
                return profession.Count > 0;
            }
            return this.relocationInfo.Profession.Count > 0;
        },
        canAfford(cost, amount = 1) {
            for (const c in cost) {
                const req = cost[c] * amount;
                const current = this.currencydata[c]?.Amount;
                if (current < req) {
                    return false;
                }
            }
            return true;
        },
        modifyUnemployed(amount) {
            this.professions.find(x => x.Name == 'Unemployed').Count += amount;
        },
        getPopulation() {
            return this.professions.map(x => x.Count).reduce((a, b) => a + b);
        },
        getAdultPopulation() {
            return this.professions.filter(x => x.Name != 'Infant' && x.Name != 'Child').map(x => x.Count).reduce((a, b) => a + b);
        },
        getChildPopulation() {
            return this.professions.find(x => x.Name == 'Child').Count;
        },
        getEffectivePopulation(){
            let infant = this.professions.find(x => x.Name == 'Infant').Count * 0.1;
            let child = this.professions.find(x => x.Name == 'Child').Count * 0.3;
            let adult = this.getAdultPopulation();
            return infant + child + adult;
        },
        test_ResetPopulation(){
            for(let profession of this.professions){
                profession.Count = 0;
            }
            for(let i = 0; i < this.yearlyAgeBuckets.length; i++){
                this.yearlyAgeBuckets[i] = 0;
            }
            for(let i = 0; i < this.monthlyAgeBuckets.length; i++){
                this.monthlyAgeBuckets[i] = 0;
            }
        },
        test_SetPopulation(adults, children, infants){
            for(let i = 0; i < adults; i++){
                this.professions.find(x => x.Name == 'Unemployed').Count += 1;
                let randomAge = Math.floor(Math.random() * (60 - 15 + 1)) + 15;
                this.yearlyAgeBuckets[randomAge] += 1;
            }
            for(let i = 0; i < children; i++){
                this.professions.find(x => x.Name == 'Child').Count += 1;
                let randomAge = Math.floor(Math.random() * (14 - 2 + 1)) + 2;
                this.yearlyAgeBuckets[randomAge] += 1;
            }
            for(let i = 0; i < infants; i++){
                this.professions.find(x => x.Name == 'Infant').Count += 1;
                let randomAge = Math.floor(Math.random() * 12);
                this.monthlyAgeBuckets[randomAge] += 1;
            }
            let max = adults;
            let farmers = this.professions.find(x => x.Name == 'Farmer');
            this.processDemand();
            let totalConsumption = this.demand['Food'] ?? 0;
            while(max > 0){
                let prod = this.getActualProduction(farmers);
                let foodProd = prod.find(x => x[0] == 'Food')[1];
                if(foodProd >= totalConsumption){
                    break;
                }
                max -= 1;
                this.hire(farmers, 1);
                this.processDemand();
            }
            console.log(this.professions);
        },
        getAvailableWorkers() {
            return this.professions.find(x => x.Name == 'Unemployed').Count;
        },
        /**
         * Pay but only if you can afford it. If you can't afford it, the function returns 0.
         * 
         * @param {number} cost - The cost to pay of currency key value pairs.
         * @param {number} amount - The number of times the cost will be paid. Like, buy 4 huts, pay the cost x4.
         * @param {string} reason - This gets passed through to payCurrency and shows up for the user to see.
         * @returns {number} The amount actually paid. IDK.
         */
        buy(cost, amount = 1, reason = "Lazy Developer") {
            if (amount == 0) {
                return 0;
            }
            if (this.objectIsEmpty(cost)) {
                return amount;
            }
            if (!this.canAfford(cost, amount)) {
                return 0;
            }
            for (const [k, v] of Object.entries(cost)) {
                this.payCurrency(k, v * amount, reason);
            }
            return amount;
        },
        /**
         * Pay regardless of if you can afford it or not. If you can't afford it, you just give what you have.
         * 
         * @param {number} cost - The cost to pay of currency key value pairs.
         * @param {number} amount - The number of times the cost will be paid. Like, buy 4 huts, pay the cost x4.
         * @param {string} reason - This gets passed through to payCurrency and shows up for the user to see.
         * @returns {number} The amount actually paid. IDK.
         */
        pay(cost, amount, reason = "Lazy Developer") {
            if (amount == 0) {
                return 0;
            }
            if (this.objectIsEmpty(cost)) {
                return amount;
            }
            for (const [k, v] of Object.entries(cost)) {
                this.payCurrency(k, v * amount, reason, true);
            }
            return amount;
        },
        objectIsEmpty(obj) {
            return Object.keys(obj).length === 0;
        },
        getTotalHousing() {
            return this.buildingdata.map(x => x.Count * (x.Houses ?? 0)).reduce((a, b) => a + b);
        },
        getVisibleHouseTypes() {
            return this.buildingdata.filter(x => x.Visible && x.Type == 'Housing');
        },
        getVisibleBuildings() {
            return this.buildingdata.filter(x => x.Visible && x.Type != 'Housing');
        },
        getVisibleProfessions() {
            return this.professions.filter(x => x.Visible);
        },
        getBuildingCostTooltip(houseType) {
            if (this.canAfford(houseType.Cost)) {
                return 'You can afford this building.';
            }

            let output = this.playerCantAffordCostToString(houseType.Cost, 1);
            output += '<br/><br/>';
            let timeToCompletion = this.getTimeToAffordCost(houseType.Cost);
            if (timeToCompletion == 'Never') {
                return output + 'Time to afford: Never';
            }

            output += '<span style="color:white;"> Time to afford: ' + timeToCompletion + '</span>';
            return output;
        },
        unlockBuilding(buildingName) {
            let building = this.buildingdata.find(x => x.Name == buildingName);
            if (!building) {
                console.error('Invalid building name in building unlock: ', buildingName);
            }
            else {
                building.Visible = true;
                building.Unlocked = true;
            }
        },
        unlockCurrency(currencyName) {
            let currency = this.currencydata[currencyName];
            if (!currency) {
                console.error("Bad currency name: ", currencyName);
            }
            else {
                currency.Unlocked = true;
            }
        },
        getTimeToAffordCost(cost, amount = 1) {
            let maxTime = 0;

            for (let [key, value] of Object.entries(cost)) {
                if (this.currencydata[key].Amount > value * amount) {
                    continue;
                }

                let change = this.currencyDailyChange[key];
                if (change <= 0) {
                    return "Never";
                }
                let missing = (value * amount) - this.currencydata[key].Amount;
                let ticks = missing / change;
                if (ticks > maxTime) {
                    maxTime = ticks;
                }

            }

            return this.ticksToTime(maxTime);

        },
        ticksToTime(ticks) {
            let seconds = ticks * (this.tickspeed / 1000);
            if (seconds <= 60) {
                let rounded = Math.floor(seconds);
                return this.formatNumber(rounded) + ' ' + this.toProperPluralize('second', rounded) + '.';
            }
            let minutes = Math.floor(seconds / 60);
            if (minutes <= 60) {
                return this.formatNumber(minutes) + ' ' + this.toProperPluralize('minute', minutes) + ' ' + this.formatNumber(Math.round(seconds % 60)) + ' ' + this.toProperPluralize('second', Math.round(seconds % 60)) + '.';
            }
            let hours = Math.floor(seconds / 60 / 60);

            return this.formatNumber(hours) + ' ' + this.toProperPluralize('hour', hours) + ' ' + this.formatNumber(Math.round(minutes % 60)) + ' ' + this.toProperPluralize('minute', minutes) + '.';
        },
        playerCantAffordCostToString(cost, amount = 1) {
            if (!cost) {
                return '';
            }
            return Object.entries(cost).map(([key, value]) => [key, value])
                .filter(key => this.currencydata[key[0]].Amount > key[1] * amount == false)
                .map(([key, value]) => {
                    return `<img class="image-icon" src="${this.currencydata[key].Icon}" /><span style="color:red"> ${this.formatNumber((value * amount) - this.currencydata[key].Amount)}</span>`
                })
                .join(', ');
        },
        costToString(cost, amount = 1) {
            if (!cost) {
                return '';
            }
            return Object.entries(cost)
                .map(([key, value]) => `<img class="image-icon" src="${this.currencydata[key].Icon}" /> ${this.formatNumber(value * amount)}`)
                .join(', ');
        },
        relativeProductionChangeToString(profession, produced, amount = 1) {
            if (!produced) {
                return '';
            }
            if (this.hasNumbers() == false) {
                return "If we had a better way of keeping track of how many things there are, we could know more about what doing this would do.";
            }

            const unemployed = this.professions.find(x => x.Name === 'Unemployed');
            const unemployedProdDict = {};
            const keys = new Set();

            for (const [k, v] of (this.getActualProduction(unemployed, amount) || [])) {
                unemployedProdDict[k] = v;
                keys.add(k);
            }
            for (const [k, v] of (this.getActualProduction(profession, amount) || [])) {
                keys.add(k);
            }

            const row = (current, op, change, result, reason, extraClass = '') =>
                `<tr class="${extraClass}"><td></td><td style="text-align:left">${reason}</td><td>${current}</td><td>${op}</td><td>${change}</td><td>=</td><td>${result}</td></tr>`;

            const sectionHeader = (label, initialValue) =>
                `<tr style="text-align:left;font-weight:bold;vertical-align:bottom""><td colspan="6">${label}</td><td style="text-align:right">${initialValue}</td></tr>`;

            let tableRows = [];
            tableRows.push(`<table style="text-align:right">`);

            for (const key of keys) {
                const icon = `<img class="image-icon" src="${this.currencydata[key]?.Icon || ''}" />`;

                let currentVal = this.currencyDailyChange[key] || 0;
                let sectionsToAdd = [];

                const prodDelta = (produced[key] || 0) * amount;
                const prodDeltaChangeAbs = Math.abs(prodDelta);

                const consDeltaRaw = (profession.BaseDemand?.[key] || 0) * amount;
                const consDelta = -consDeltaRaw;
                const consDeltaChangeAbs = Math.abs(consDelta);

                const lostUnempRaw = (unemployedProdDict[key] || 0) * amount;
                const lostDelta = -lostUnempRaw;
                const lostDeltaChangeAbs = Math.abs(lostDelta);

                const prodDeltaPot = this.currencyPotentialChange[key] || 0;
                const prodDeltaReal = this.currencyDailyChange[key] || 0;

                currentVal += prodDelta;

                let prodDeltaNewOutputDescription = 'Will Produce';

                if (prodDeltaPot > 0 && prodDeltaReal == 0 && prodDeltaChangeAbs > 0) {
                    prodDeltaNewOutputDescription += ' (Capped)';
                }

                if (prodDeltaChangeAbs != 0) {
                    sectionsToAdd.push(row('', this.getSignOfValue(prodDelta), this.formatNumber(prodDeltaChangeAbs), this.formatNumber(currentVal), prodDeltaNewOutputDescription));
                }

                currentVal += consDelta;

                if (consDeltaChangeAbs != 0) {
                    sectionsToAdd.push(row('', this.getSignOfValue(consDelta), this.formatNumber(consDeltaChangeAbs), this.formatNumber(currentVal), 'Will Consume'));
                }

                currentVal += lostDelta;

                if (lostDeltaChangeAbs != 0) {
                    sectionsToAdd.push(row('', this.getSignOfValue(lostDelta), this.formatNumber(lostDeltaChangeAbs), this.formatNumber(currentVal), 'Lost Unemployed Production'));
                }

                tableRows.push(sectionHeader(`${icon} <span style="vertical-align:middle">Current ${key}</span>`.trim(), this.formatNumber(this.currencyDailyChange[key] || 0)));
                for (let section of sectionsToAdd) {
                    tableRows.push(section);
                }

                const netSpan = `<span style="${currentVal < 0 ? 'color:red' : ''}">${this.formatNumber(currentVal)}</span>`;

                tableRows.push(
                    `<tr class="net" style="border-top:solid 1px #555;border-bottom:solid 1px #888;background-color:#222"><td>${icon}</td><td colspan="4" style="text-align:left">New ${key}</td><td>=</td><td>${netSpan}</td></tr>`
                );
            }

            tableRows.push(`</table>`);
            return tableRows.join('');

        },
        getSignOfValue(value) {
            return value >= 0 ? '+' : '-';
        },
        costToText(cost, amount = 1) {
            return Object.entries(cost)
                .map(([key, value]) => `${key}: ${this.formatNumber(value * amount)}`)
                .join(', ');
        },
        getProduction(profession) {
            return this.professions.find(x => x.Name == profession).Produces;
        },
        hasNumbers() {
            if (this.techDict['Numbers']?.isLocked) {
                return false;
            }
            return true;
        },
        toOrdinal(n) {
            const rem10 = n % 10, rem100 = n % 100;
            if (rem10 == 1 && rem100 != 11) return n + "st";
            if (rem10 == 2 && rem100 != 12) return n + "nd";
            if (rem10 == 3 && rem100 != 13) return n + "rd";
            return n + "th";
        },
        getLunarDate(date) {
            const daysSinceEpoch = (date.getTime() - this.epoch) / 86_400_000;
            const lunations = Math.floor(daysSinceEpoch / this.synodicDays);
            const name = this.monthNames[((lunations % 12) + 12) % 12];
            let dayInMonth = Math.floor(daysSinceEpoch - lunations * this.synodicDays) + 1;
            if (this.hasNumbers() == false) {
                if (dayInMonth < 2) {
                    dayInMonth = "The day of the ";
                }
                else if (dayInMonth < 10) {
                    dayInMonth = 'Early';
                }
                else if (dayInMonth == 15) {
                    dayInMonth = 'The day of the Missing ';
                }
                else if (dayInMonth > 20) {
                    dayInMonth = 'Late';
                }
                else {
                    dayInMonth = 'Mid';
                }
                return [dayInMonth, name];
            }
            else {
                return [this.toOrdinal(dayInMonth) + ' day of the ', name];
            }
        },
        getPrecalendarDate(date) {
            const daysSinceEpoch = (date.getTime() - this.epoch) / 86_400_000;

            const lunations = Math.floor(daysSinceEpoch / this.synodicDays) + 1;
            const currentSeason = lunations % 12;
            let sunLengths = ['very short', 'short', 'medium', 'medium', 'long', 'very long'];
            let nightLengths = ['very long', 'long', 'medium', 'medium', 'short', 'very short'];
            let sunrises = [8, 7, 7, 6, 6, 5, 4, 5, 5, 6, 6, 7];
            let sunsets = [4, 5, 6, 6, 6, 7, 8, 7, 6, 5, 5, 5];
            let sunLength = sunLengths[Math.floor(currentSeason / 2)];
            let nightLength = nightLengths[Math.floor(currentSeason / 2)];
            let currentSunrise = sunrises[currentSeason];
            let currentSunset = sunsets[currentSeason] + 12;
            const timeOfDay = date.getHours() % 24;

            if (timeOfDay < currentSunrise || timeOfDay > currentSunset) {
                return 'The night is ' + nightLength + '.';
            }
            return 'The day is ' + sunLength + ".";

        },
        getWeatherForDate(date) {
            const timeOfDay = date.getHours() % 24;
            let startOfYear = new Date(date.getFullYear(), 0, 0);
            let diff = date - startOfYear;
            let oneDay = 1000 * 60 * 60 * 24;
            let currentDay = Math.floor(diff / oneDay);
            let hourInYear = currentDay * 24 + timeOfDay;
            let quantizedHour = Math.floor(hourInYear / 12) * 12;
            let currentWeatherTemp = weather.Weathers[hourInYear % weather.Weathers.length];
            let currentWeather = weather.Weathers[quantizedHour % weather.Weathers.length];

            let weatherDescription = this.getWeatherDescription(currentWeatherTemp.temp, currentWeather);

            return 'The weather is ' + weatherDescription + '.';
        },
        getWeatherDescription(temp, weatherData) {
            let { _, rain, humid, wind, cloud } = weatherData;

            let description = [];
            if (this.sunlight != 1) {
                let K = (temp - 32) * (5 / 9) + 273.15;
                K *= this.sunlight;
                temp = (K - 273.15) * (9 / 5) + 32;
            }
            if (this.hasTechnology('Temperature')) {
                description.push(this.formatNumber(temp) + " degrees");
            }
            else {

                if (temp <= -10) description.push("freezing cold");
                else if (temp <= 0) description.push("very cold");
                else if (temp <= 10) description.push("chilly");
                else if (temp <= 20) description.push("cool");
                else if (temp <= 30) description.push("warm");
                else description.push("hot");
            }

            if (rain > 0) {
                let state = 'rain';
                let minimal = 'drizzling';
                if (temp <= 0) {
                    state = 'snow';
                    minimal = 'flurries'
                }
                if (rain > 2) description.unshift("heavy " + state);
                else if (rain >= 1) description.unshift("light " + state);
                else description.unshift(minimal);
            }
            else {
                if (cloud > 75) description.push("overcast");
                else if (cloud > 40) description.push("partly cloudy");
                else if (cloud > 0) description.push("mostly clear");
                else description.push("clear skies");
            }

            if (wind > 30) description.push("very windy");
            else if (wind > 10) description.push("windy");

            if (humid >= 90) description.push("humid");
            else if (humid < 25) description.push("dry");

            this.previousWeather = { ...weatherData, temp };
            return description.join(", ");
        },
        getRelativeNumber(n) {
            if(n < 0){
                return "Going Down";
            }
            if (n == 0) {
                return "None";
            }
            if (n < 1) {
                return "Not Even One";
            }
            if (n == 1) {
                return "One";
            }
            if (n > 1 && n < 3) {
                return "Few";
            }
            if (n < 5) {
                return "Some";
            }
            if (n == 5) {
                return "A Hand";
            }
            if (n < 10) {
                return "Less Than Both Hands";
            }
            if (n == 10) {
                return "Both Hands";
            }
            if (n < 100) {
                return "Many";
            }
            else {
                return "Lots!";
            }
        },
        getEnvironment() {
            let env = {};
            for (let [good, data] of Object.entries(this.currencydata)) {
                let goodLower = good.toLowerCase();
                env[goodLower] = data.Amount;
                let preCostAmount = this.preCostTickCurrencyValues[good]?.Amount ?? 0;
                let beginTickAmount = this.beginTickCurrencyValues[good]?.Amount;
                let endAmount = this.endTickCurrencyValues[good]?.Amount;

                env[goodLower + ' production'] = preCostAmount - beginTickAmount;
                env[goodLower + ' consumption'] = preCostAmount - endAmount;

            }
            for (let prof of this.professions) {
                let lowername = prof.Name.toLowerCase();
                env[pluralize.plural(lowername)] = prof.Count;
                env[pluralize.singular(lowername)] = prof.Count;
            }
            for (let building of this.buildingdata) {
                let lowername = building.Name.toLowerCase();
                env[pluralize.plural(lowername)] = building.Count;
                env[pluralize.singular(lowername)] = building.Count;
            }
            env['current population'] = this.getPopulation();
            env['total population'] = this.getPopulation();
            env['unemployed people'] = this.getAvailableWorkers();
            env['total housing'] = this.getTotalHousing();
            env['available housing'] = this.getAvailableHousing();
            return env;
        },
        isReservedName(name) {
            return this.reservedNames.has(name);
        },
        sanitizeProfName(name) {
            if (!name) {
                return '';
            }
            if (name.startsWith('a ')) {
                name = name.substring(2);
            }
            const lower = pluralize.singular(name.toLowerCase());
            let prof = this.professions.find(x => pluralize.singular(x.Name.toLowerCase()) == lower);
            return prof;
        },
        unlockAllProfessions() {
            for (let unlockable of this.unlockablesdata) {
                if (unlockable.isLocked) {
                    unlockable.Unlock(this);
                }
            }
        },
        formatNumber(n, isInteger = false) {
            if (this.hasNumbers() == false) {
                return this.getRelativeNumber(n);
            }
            if (typeof n !== 'number' || isNaN(n)) return '0';
            if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
            if (n === 0) return '0';
            if (n < 1) {
                return n.toFixed(2);
            }

            const abs = Math.abs(n);
            let log = Math.log10(abs);
            if (log === undefined) {
                return n.toFixed(2);
            }
            const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
            const maxTier = units.length - 1;

            const tier = Math.floor(Math.log10(abs) / 3);

            // Too small: scientific notation
            if (abs < 0.001) {
                return n.toExponential(2); // e.g. "5.00e-324"
            }

            // Too large: scientific fallback
            if (tier > maxTier) {
                return n.toExponential(2); // e.g. "1.79e+308"
            }

            const scale = Math.pow(10, tier * 3);
            const scaled = n / scale;
            if (isInteger) {
                return scaled.toFixed(2).replace(/\.?0+$/, '') + units[tier];
            }
            return scaled.toFixed(2) + units[tier];
        }
    }
});

window.VM = gamevm.mount('#vm');
//console.log(window.VM);
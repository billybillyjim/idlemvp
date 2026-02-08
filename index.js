
import house from './components/house.js'
import population from './components/population.js'
import timeinfo from './components/timeinfo.js'
import currencies from './components/currencies.js'
import technology from './components/technology.js'
import settings from './components/settings.js'
import laws from './components/laws.js'
import Tooltip from './components/tooltip.js'
import tooltipwrapper from './components/tooltipwrapper.js'
import codetester from './components/codetest.js'

import pluralize from './lib/pluralize.js'
import weather from './lib/weather.js'
import levenshtein from './lib/levenshtein.js'

import currencydata from './data/currencydata.js'
import unlockablesdata from './data/unlockablesdata.js'
import technologies from './data/technologydata.js'
import productionModifiers from './data/productionModifiers.js'
import buildingdata from './data/buildingdata.js'

const gamevm = Vue.createApp({
    el: '#vm',
    components: {
        house,
        population,
        currencies,
        timeinfo,
        technology,
        settings,
        laws,
        codetester,
        Tooltip,
        tooltipwrapper
    },
    delimiters: ['[[', ']]'],
    data: function () {
        return {
            Verbose: true,
            gravity: 9.81,
            sunlight: 1,
            basePopulationGrowthChance: 0.03,
            civilizationName: "",
            currentMenu: "Laws",
            menus: ["Main", "Population", "Stockpiles", "Buildings", "Technology", "Laws", "Modifiers", "Log", "Charts", "Settings"],
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
            },
            chartMenu: {
                currentChart: '',
                chartTime: 'Every Tick',
            },
            log: [],
            consoleOutputs: [],
            uploadedSaveFile: null,
            activeTooltipData: null,
            population: 1,
            growthThreshold: 2,
            QOLDecay: 0.95,
            ticksOfUnmetSpaceDemand: 0,
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
            professions: [
                {
                    Name: 'Unemployed',
                    Count: 5,
                    Cost: {},
                    Produces: { 'Food': 0.8 },
                    BaseDemand: { Food: 6 },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                },
                {
                    Name: 'Farmer',
                    Count: 0,
                    Cost: {},
                    Produces: { 'Food': 2.1, 'Grain': 5, },
                    BaseDemand: {
                        Food: 1
                    },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
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
            previousTickProductionValues: {},
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
            buildingReservedNames:new Set(),
            parser: {
                i: 0,
                tokens: [],
            },
            pluralizer: pluralize,
            previousWeather: null,
            overcrowdspacing: 1,
            checkHistoricalValues: true,
            historicalValues: {},
            historicalValuesMinute: {},
            historicalValuesHour: {},
            maxHistory: 1000,
            charts: [{ Name: 'UnmetDemands' }, { Name: 'Currencies' }, { Name: 'Population' }, { Name: 'Real Production' }, { Name: 'Uncapped Production' }],
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
            }
        }
    },
    created() {
        this.endTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
        this.beginTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
        for (let tech of this.technologies) {
            this.techDict[tech.Name] = tech;
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
                tech.Unlock(this);
            }
        }
        const input = `
                if Wood >= 0 then hire Test until there are 10.
                `;
        this.generateReservedNames();
    },
    mounted: async function () {
        this.gameProcess = setInterval(this.gameTick, this.tickspeed);
    },
    methods: {
        setCurrentChart(menuName) {
            this.chartMenu.currentChart = menuName;
            if (this.chartMenu.chartTime == 'Every Tick') {
                this.generateChart(this.historicalValues[menuName], menuName);
            }
            else if (this.chartMenu.chartTime == 'Minute') {
                this.generateChart(this.historicalValuesMinute[menuName], menuName);
            }
            else if (this.chartMenu.chartTime == 'Hour') {
                this.generateChart(this.historicalValuesHour[menuName], menuName);
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
            if (true) {
                return this.menus;
            }
            let alwaysAvailable = ["Main", "Population", "Technology"];
            if (this.hasTechnology('Firemaking')) {
                alwaysAvailable.push("Buildings");
            }
            if (this.hasTechnology('Pottery')) {
                alwaysAvailable.push('Stockpiles');
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
                return ((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(currentDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) == 1;
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
        setSpeed(value) {
            clearInterval(this.gameProcess);
            this.tickspeed = value;
            this.gameProcess = setInterval(this.gameTick, this.tickspeed);
        },
        getTechnologies(sort = false, includeResearched = false) {
            //const allTechByName = Object.fromEntries(this.technologies.map(t => [t.Name, t]));
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
        saveState(state) {
            try {
                let data = JSON.parse(JSON.stringify(this.$data));
                data.log = [];
                const json = JSON.stringify(data);
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
                return JSON.parse(json);
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
                const blob = new Blob([json], { type: 'text/plain;charset=UTF-16' });
                const url = URL.createObjectURL(blob);

                const a = Object.assign(document.createElement('a'), {
                    href: url,
                    download: 'idlesave.txt',
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
                    Object.assign(this.$data, loaded); // merge into reactive state
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
            this.currentTick++;
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), this.currentDate.getHours() + 1);
            this.beginTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
            this.previousTickProductionValues = JSON.parse(JSON.stringify(this.tickProductionValues));
            this.tickProductionValues = {};
            for (let currency of Object.keys(this.currencydata)) {
                this.tickProductionValues[currency] = 0;
                this.uncappedTickProductionValues[currency] = 0;
                this.currencyPotentialChange[currency] = 0;
            }
            this.currencyDemandDescriptions = {};
            this.currencyProductionDescriptions = {};
            this.currencyConsumptionDescriptions = {};
            this.processBaseGrowth();
            this.processProductionModifiers();
            this.processProfessions();
            this.processBuildings();
            this.processTechnology();
            this.processQOL();
            this.checkUnlocks();
            this.preCostTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
            this.processCosts();
            this.endTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
            this.processHousingDemand();
            this.processDemand();
            this.processPopulation();
            this.processLaws();
            this.processDeaths();
            if (this.currentTick % 100 == 0) {
                this.saveState(this.$data);
            }
            if (this.checkHistoricalValues) {
                this.processHistoricalValues();
                if (this.chartMenu.currentChart) {
                    this.setCurrentChart(this.chartMenu.currentChart);
                }
            }
        },
        processHistoricalValues() {
            let pairs = [
                ['UnmetDemands', this.unmetdemand],
                ['Real Production', this.previousTickProductionValues],
                ['Uncapped Production', this.uncappedTickProductionValues],
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
        processHistoricalValue(key, data) {
            if (!this.historicalValues[key]) {
                this.historicalValues[key] = [];
            }
            let idx = this.currentTick;
            let jsonData = JSON.parse(JSON.stringify(data));
            this.historicalValues[key].push({ [idx]: jsonData });
            if (this.historicalValues[key].length >= this.maxHistory) {
                this.historicalValues[key].shift();
            }
        },
        processHistoricalValueMinute(key, data) {
            if (!this.historicalValuesMinute[key]) {
                this.historicalValuesMinute[key] = [];
            }
            let idx = this.minuteTick;
            let jsonData = JSON.parse(JSON.stringify(data));
            this.historicalValuesMinute[key].push({ [idx]: jsonData });
            if (this.historicalValuesMinute[key].length >= this.maxHistory) {
                this.historicalValuesMinute[key].shift();
            }
        },
        processHistoricalValueHour(key, data) {
            if (!this.historicalValuesHour[key]) {
                this.historicalValuesHour[key] = [];
            }
            let idx = this.hourTick;
            let jsonData = JSON.parse(JSON.stringify(data));
            this.historicalValuesHour[key].push({ [idx]: jsonData });
            if (this.historicalValuesHour[key].length >= this.maxHistory) {
                this.historicalValuesHour[key].shift();
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
        processHousingDemand() {
            this.currencydata.Housing.Amount = this.getTotalHousing();
            this.modifyDemand('Housing', (this.getPopulation() / ((this.getAvailableHousing() - this.getPopulation()) + 1)) * 5, "Base Population Housing Desire");
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
            this.addCurrency("Space", spaceCost, "Demolishing " + actual + ' ' + this.toProperPluralize(houseType.Name, actual));
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
            let base = 1000;
            for (let building of this.buildingdata) {
                if (building.Stores) {

                    let storage = building.Stores[currencyName] * building.Count;
                    if (storage) {
                        base += storage;
                    }
                }
            }
            return base;
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
            let deathOdds = 0.01;
            let homelessRate = this.getHomelessnessRatio();
            let possibleCauses = {
                "Natural Causes": "has died of natural causes.",
            };

            if (homelessRate > 0) {
                deathOdds += homelessRate;
                possibleCauses["Homelessness"] = "has died homeless.";
            }
            if (this.gravity == 0) {
                deathOdds = 1;
                possibleCauses["No Gravity"] = "has floated off into space.";
            }
            if (this.gravity > 25) {
                deathOdds *= this.gravity;
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

            for (let prof of this.professions) {
                let rand = Math.random();
                if (rand < deathOdds) {
                    //https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
                    let keys = Object.keys(possibleCauses);
                    let reason = [keys[keys.length * Math.random() << 0]];

                    this.die(prof, Math.max(deathOdds - 1, 1), possibleCauses[reason]);
                }
            }
            if (this.getPopulation() == 0) {
                this.logit('Everyone is dead.');
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
        die(profession, amount, reason = '') {
            if (profession.Count == 0) {
                return;
            }
            let actual = 0;
            for (var i = 0; i < amount; i++) {
                if (this.fire(profession)) {
                    this.modifyUnemployed(-1);
                    actual++;
                }
            }
            if (!this.missingProfessionCounts[profession.Name]) {
                this.missingProfessionCounts[profession.Name] = 0;
            }
            if (profession.Name != 'Unemployed') {
                this.missingProfessionCounts[profession.Name] += amount;
            }

            if (actual == 0) {
                if (amount != 0) {
                    console.error("Yo " + amount + " " + profession.Name + " were supposed to die but we couldn't fire them. ");
                }
            }
            else if (actual == 1) {
                if (this.getPopulation() < 1000) {
                    this.logit(this.getNameOrProfession(profession, actual) + ` ${reason}.`);
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
            this.demand[good] += amount;
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
                totalPop += prof.Count;
            }

            let baseHideDemand = 0.01;
            let baseClayDemand = 0.01;
            let baseWoodDemand = 0.015;
            let baseOreDemand = 0.002;
            let baseSpaceDemand = 0.015;
            let baseHousingDemand = 0.01;
            let baseFurnitureDemand = 0.001;
            let unmetSpaceDemand = 0.001;
            this.modifyDemand('Hides', baseHideDemand * totalPop, 'Global Demand');
            this.modifyDemand('Clay', baseClayDemand * totalPop, 'Global Demand');
            this.modifyDemand('Wood', baseWoodDemand * totalPop, 'Global Demand');
            this.modifyDemand('Ore', baseOreDemand * totalPop, 'Global Demand');
            this.modifyDemand('Space', baseSpaceDemand * totalPop, 'Global Demand');
            if (this.currencydata.Space.Amount == 0) {
                this.ticksOfUnmetSpaceDemand += 1;
                this.modifyDemand('Space', unmetSpaceDemand * totalPop * this.ticksOfUnmetSpaceDemand, 'Unmet Demand');
            }
            else {
                this.ticksOfUnmetSpaceDemand = 0;
            }


            this.modifyDemand('Housing', baseHousingDemand * totalPop, 'Global Demand');
            this.modifyDemand('Furniture', baseFurnitureDemand * totalPop, 'Global Demand');
        },
        processTechnologyDemand() {
            let population = this.getPopulation();
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
                //     if (currency.Name == 'Housing') {
                //         if (this.getAvailableHousing() < 10) {
                //             this.unmetdemand['Housing'] += 0.1;
                //         }
                //         if (this.getAvailableHousing() > 15) {
                //             this.unmetdemand['Housing'] = 0;
                //         }
                //         continue;
                //     }

                //     let preCostAmount = this.preCostTickCurrencyValues[currency.Name]?.Amount;
                let beginTickAmount = this.beginTickCurrencyValues[currency.Name]?.Amount;
                let endAmount = this.endTickCurrencyValues[currency.Name]?.Amount;

                //     let change = (preCostAmount - beginTickAmount);
                let dailyChange = (endAmount - beginTickAmount);
                this.currencyDailyChange[currency.Name] = dailyChange;
                //     if (currency.Name == 'Space') {
                //         continue;
                //     }
                //     if (change >= 0 && this.demand[currency.Name]) {
                //         this.modifyDemand(currency.Name, -change, "Met by production ");

                //         if (!this.unmetdemand[currency.Name]) {
                //             this.unmetdemand[currency.Name] = -change;
                //         }
                //         else {
                //             this.unmetdemand[currency.Name] -= change;
                //         }
                //         if (this.unmetdemand[currency.Name] < 0) {
                //             this.unmetdemand[currency.Name] = 0;
                //         }
                //         if (this.demand[currency.Name] < 0) {

                //             this.demand[currency.Name] = 0;
                //         }
            }

            //     if (endAmount < dailyChange) {
            //         this.modifyDemand(currency.Name, Math.abs(-change - endAmount), "Lowering stockpiles");

            //     }
            // }

            // for (let [k, v] of Object.entries(this.unmetdemand)) {
            //     if (v > 0) {
            //         this.modifyDemand(k, v, "Unmet demand");
            //     }
            // }
        },
        processDemand() {
            this.resetDemands();
            this.processProfessionDemand();
            this.processTechnologyDemand();
            this.processUnmetDemand();
        },
        processPopulation() {
            if (this.getPopulation() < 100 || true) {
                return;
            }
            //Find most important work and make workers to do it.
            if (this.endTickCurrencyValues.Food.Amount < this.growthThreshold
                || this.getDailyProduction('Food') < 0) {
                let anyFired = false;
                for (let Type of ['Luxury Good', 'Processed Material', 'Nonphysical Good', 'Raw Material', "Invisible"]) {
                    let mats = Object.values(this.currencydata).filter(x => x.Type == Type).sort((a, b) => b.Amount - a.Amount);
                    for (let mat of mats) {
                        let producer = this.professions.find(x => x.Produces[mat.Name] != null);
                        if (producer) {
                            if (this.fire(producer)) {
                                anyFired = true;
                                break;
                            }
                        }
                    }
                    if (anyFired) {
                        break;
                    }
                }

                let farmer = this.professions.find(x => x.Name == "Farmer");
                this.hire(farmer);
                return;
            }

            if (this.getAvailableWorkers() > 0) {

                for (let Type of ['Raw Material', 'Processed Material', 'Tool', 'Nonphysical Good', 'Luxury Good', "Invisible"]) {
                    let mats = Object.values(this.currencydata).filter(x => x.Type == Type);
                    let priority = null
                    let maxDemand = 0;

                    for (let mat of mats) {
                        let dailyChange = this.getDailyProduction(mat.Name);
                        if (this.demand[mat.Name] > maxDemand + dailyChange) {
                            priority = mat;
                            maxDemand = this.demand[mat.Name];
                        }
                    }
                    if (priority) {
                        let producer = this.professions.find(x => x.Produces[priority.Name] != null);
                        if (producer) {
                            if (this.hire(producer)) {
                                return;
                            }
                        }
                    }
                }

            }
            else {
                if (this.currentTick % 100 == 0) {
                    let mats = Object.values(this.currencydata).sort((a, b) => b.Amount - a.Amount);
                    //overproduced is when a material is being produced to a level
                    //that reduces demand below the item of highest demand.
                    let maxDemand = this.negativeDemandThreshold;
                    let priority = null;
                    let anyFired = false;
                    for (let mat of mats) {
                        if (this.demand[mat.Name] - this.getDailyProduction(mat.Name) < maxDemand) {

                            maxDemand = this.demand[mat.Name];
                            if (maxDemand < this.negativeDemandThreshold) {
                                priority = mat;
                            }
                        }
                        if (priority) {
                            let producer = this.professions.find(x => x.Produces[mat.Name] != null);
                            if (producer) {
                                if (this.fire(producer)) {
                                    anyFired = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (anyFired) {
                        return;
                    }
                }
            }
        },
        getDailyProduction(currencyName) {
            return (this.endTickCurrencyValues[currencyName]?.Amount - this.beginTickCurrencyValues[currencyName]?.Amount) * 24;
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

            this.uncappedTickProductionValues[currencyName] += amount;
            if (this.currencydata[currencyName].Amount + amount > storage && storage != -1) {
                amount = this.getCurrencyStorage(currencyName) - this.currencydata[currencyName].Amount;
                reason += " (Capped by Storage)";
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
            this.currencydata[currencyName].Amount += amount;
        },
        payCurrency(currencyName, amount, reason, payEvenIfYouCantAfford = false) {
            if (isNaN(amount)) {
                console.error("bad(NaN) value for pay currency", currencyName, reason);
                return false;
            }
            this.currencyPotentialChange[currencyName] = (this.currencyPotentialChange[currencyName] ?? 0) - amount;
            if (!this.currencydata[currencyName]) {
                console.error(currencyName, 'is not in the currency data.');
            }

            if (this.currencyConsumptionDescriptions[currencyName]) {
                this.currencyConsumptionDescriptions[currencyName].push([currencyName, this.formatNumber(amount), reason]);
            }
            else {
                this.currencyConsumptionDescriptions[currencyName] = [[currencyName, this.formatNumber(amount), reason]];
            }
            if (this.currencydata[currencyName].Amount < amount && !payEvenIfYouCantAfford) {
                return 0;
            }
            if (payEvenIfYouCantAfford && amount > this.currencydata[currencyName].Amount) {
                amount = this.currencydata[currencyName].Amount
            }
            
            this.currencydata[currencyName].Amount -= amount;

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
                    this.logit("Despite extreme mismanagement of your state, a wanderer has joined your civilization as the sole member.");
                    this.professions.find(x => x.Name == "Unemployed").Count = 1;
                }

            }
            this.addCurrency('Food', 5, 'Base Production');
            this.addCurrency('Water', 15, 'Base Production');
            this.addCurrency('Knowledge', this.getPopulation() * 0.005, 'From Population');
            let hasFood = this.uncappedTickProductionValues['Food'] >= this.growthThreshold;
            let hasWater = this.uncappedTickProductionValues['Water'] >= this.growthThreshold;
            if (hasFood && hasWater && this.hasAvailableHousing()) {
                let foodRatio = Math.min((this.currencydata.Food.Amount / this.growthThreshold), 1);
                let waterRatio = Math.min((this.currencydata.Water.Amount / this.growthThreshold), 1);

                let growthChance = 1 - this.basePopulationGrowthChance * foodRatio * waterRatio;
                let rand = Math.random();
                if (rand > growthChance) {
                    this.professions.find(x => x.Name == "Unemployed").Count += 1;
                    for (let [prof, missingCount] of Object.entries(this.missingProfessionCounts)) {
                        if (missingCount > 0) {
                            let actual = this.hire(this.professions.find(x => x.Name == prof), missingCount);
                            this.missingProfessionCounts[prof] -= actual;
                            break;
                        }
                    }

                    this.addPopulationGrowthMessage();
                }
            }
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
                this.payCurrency('Food', profession.Count, "Feeding " + this.toProperPluralize(profession.Name, profession.Count));
                this.payCurrency('Water', profession.Count, "Watering " + this.toProperPluralize(profession.Name, profession.Count));

                if (profession.Count > 0 && !this.canAfford(profession.Cost, profession.Count, "Cost of " + profession.Name)) {
                    for (const key in profession.Cost) {
                        if (Object.hasOwn(this.unmetdemand, key)) {
                            this.unmetdemand[key] += profession.Cost[key];
                        } else {
                            this.unmetdemand[key] = profession.Cost[key];
                        }
                    }
                }
                else {
                    ////console.log("Could afford profession cost.", profession);
                }
            }
            for (let [good, demand] of Object.entries(this.demand)) {
                if (good == 'Space' || good == 'Knowledge' || good == 'Housing' || good == 'Food') {
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
            if (this.currencydata.Food.Amount < 0) {
                this.starvePeople();
            }
            if (this.currencydata.Water.Amount < 0) {
                this.dehydratePeople();
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

                if (current.Amount == 0) {
                    return 0;
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
            const allKeys = new Set([
                ...Object.keys(producer.Produces),
                ...Object.keys(additiveModifiers)
            ]);
            for (const currency of allKeys) {
                const producedAmount = producer.Produces[currency] ?? 0;
                const additive = additiveModifiers[currency] ?? 0;
                let baseProduction = producedAmount + additive;
                let totalBase = baseProduction * count;
                let withRatio = totalBase * this.getWorkRatio();
                let withMult = withRatio * (multModifiers[currency] || 1);
                let produced = withMult;
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
                        if (boost.Name == name) {
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
                                    multModifiers[boost.Currency] += boost.Amount;
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
            const [additiveModifiers, multModifiers] = this.getProductionModifiers(profession.Name);
            const allKeys = new Set([
                ...Object.keys(profession.Produces),
                ...Object.keys(additiveModifiers)
            ]);
            let o = [];
            for (const currency of allKeys) {
                const producedAmount = profession.Produces[currency] ?? 0;
                const additive = additiveModifiers[currency] ?? 0;
                let baseProduction = producedAmount + additive;
                let withRatio = baseProduction * this.getWorkRatio();
                let withMult = withRatio * (multModifiers[currency] || 1);
                let produced = withMult;
                o.push([currency, this.formatNumber(produced)]);
            }

            let output = {};
            for (let [k, v] of o) {
                output[k] = v;
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
        starvePeople() {

            let foodDebt = -this.currencydata.Food.Amount;
            if (foodDebt < 0) {
                return;
            }
            this.currencydata.Food.Amount = 0;

            // Priority list: 1) Unemployed, 2) non-Farmers, 3) Farmers
            const groups = [
                p => p.Name === 'Unemployed',
                p => p.Name !== 'Unemployed' && p.Name !== 'Farmer',
                p => p.Name === 'Farmer'
            ];

            for (const filter of groups) {
                for (const prof of this.professions.filter(filter)) {
                    const take = Math.ceil(Math.min(prof.Count, foodDebt));
                    prof.Count -= take;
                    this.die(prof, take, ' of starvation.');
                    foodDebt -= take;
                    if (foodDebt <= 0) {
                        return;
                    }
                }
            }
        },
        dehydratePeople() {
            let waterDebt = -this.currencydata.Water.Amount;
            if (waterDebt < 0) {
                return;
            }
            this.currencydata.Water.Amount = 0;

            // Priority list: 1) Unemployed, 2) non-Farmers, 3) Farmers
            const groups = [
                p => p.Name === 'Unemployed',
                p => p.Name !== 'Unemployed' && p.Name !== 'Farmer',
                p => p.Name === 'Farmer'
            ];

            for (const filter of groups) {
                for (const prof of this.professions.filter(filter)) {
                    const take = Math.ceil(Math.min(prof.Count, waterDebt));
                    prof.Count -= take;
                    this.die(prof, take, ' of dehydration.');
                    waterDebt -= take;
                    if (waterDebt <= 0) {
                        return;
                    }
                }
            }
        },
        deleteSave() {
            localStorage.clear();
            location.reload();
        },
        hireByName(name) {
            let prof = this.professions.find(x => x.Name == name);
            if (prof) {
                this.hire(prof);
            }
        },
        tryHire(profession, amount = 1) {
            if(isNaN(amount)){
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
            if(isNaN(amount)){
                return false;
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
                        return;
                    }
                    maxPossible = Math.min(maxPossible, available);
                }
            }
            //let actual = this.buy(profession.Cost, maxPossible, "Hiring " + profession.Name);
            profession.Count += maxPossible;
            this.modifyUnemployed(-maxPossible);

            return maxPossible;
        },
        hireInfo(profession, amount = 1) {
            if(isNaN(amount)){
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
        canAfford(cost, amount = 1) {
            return Object.entries(cost).every(([k, v]) =>
                this.currencydata[k]?.Amount >= v * amount
            );
        },
        modifyUnemployed(amount) {
            this.professions.find(x => x.Name == 'Unemployed').Count += amount;
        },
        getPopulation() {
            return this.professions.map(x => x.Count).reduce((a, b) => a + b);
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

            this.previousWeather = weatherData;
            this.previousWeather.temp = temp;
            return description.join(", ");
        },
        getRelativeNumber(n) {
            if (n <= 0) {
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
        tokenize(input) {
            const tokenSpec = [
                ['SKIP', /^,/],
                ['SKIP', /^[ \t\n]+/],                
                ['SKIP', /^(a )\b/],
                ['NUMBER', /^\d+/],
                ['TEXT_NUMBER', /^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|quadrillion|quintillion)\b/i],
                ["TEXT_NUMBER", /^no\b/],
                ["TEXT_NUMBER", /^eleventyleven\b/],
                ['COMPARATOR', /^((?:is|are)* *(?:greater|more|less|fewer|equal) *(?:than)* *(?:or equal )* *(?:to|with)*)/i],
                ['COMPARATOR', /^(is the same as|are the same as)/i],
                ['COMPARATOR', /^(is >|is <|is <=|is >=|is =|is ==|are >|are <|are <=|are >=|are =|are ==|>=|<=|>|<|==)/],
                ['MORE', /^more/],
                ['LESS', /^less/],
                ['LESS', /^fewer/],
                ['THAN', /^than\b/],
                ['AND', /^and\b/],
                ['OR', /^or\b/],
                ['NOT', /^not\b/],
                ['XOR', /^xor\b/],
                ['ASSIGN', /^(is\b|=|are\b)/],
                ['STRING', /^"[^"]*"/],
                ['STRING', /^'[^']*'/],
                ['ARITHMETIC', /^\+/],
                ['ARITHMETIC', /^-/],
                ['ARITHMETIC', /^\*/],
                ['ARITHMETIC', /^\//],
                ['ARITHMETIC', /^%/],
                ['LPAREN', /^\(/],
                ['RPAREN', /^\)/],
                ['CONDITIONAL', /^(if|when)/],
                ['DOT', /^\./],
                ['THEN', /^then\b/],
                ['ANY', /^any\b/],
                ['NONE', /^none\b/],
                ['UNTIL', /^until\b/],
                ['ELSE', /^else\b/],
                ['ELSE', /^otherwise\b/],
                ['PRINT', /^print\b/],
                ['THERE_ARE', /^(there are|there is)\b/],
                ['IT_IS', /^it is\b/],
                ['ACTION', /^(hire|fire|build|demolish)\b/],
                ['IDENT', /^(construction worker|construction workers)\b/],
                ['IDENT', /^(homeless people|homeless person)\b/],
                ['IDENT', /^(unemployed people)\b/],
                ['IDENT', /^(large (?:hut|huts))\b/],
                ['IDENT', /^(available housing)\b/],
                ['IDENT', /^(total housing)\b/],
                ['IDENT', /^(total population)\b/],
                ['IDENT', /^(current population)\b/],
                ['IDENT', /^[a-zA-Z_]\w*\s*(consumption|production)/],
                ['IDENT', /^[a-zA-Z_]\w*/],
                
            ];


            const tokens = [];
            let remaining = input;
            let line = 1;
            let id = 0;
            let lastWasTextNumber = false;
            let textNum = "";

            while (remaining.length > 0) {
                let matched = false;

                for (let [type, regex] of tokenSpec) {
                    let lowerForMatching = remaining.toLowerCase();
                    const match = regex.exec(lowerForMatching);
                    if (match) {
                        matched = true;

                        let start = match.index;
                        let end = start + match[0].length;

                        let raw = remaining.slice(start, end);

                        let text = type == "STRING" ? raw : raw.toLowerCase();
                        let inText = text;
                        
                        if(type == 'SKIP'){
                            var newlines = (text.match(/\n/g) || []).length;
                            line += newlines;
                            remaining = remaining.slice(text.length);
                            continue;
                        }
                        if(type == "TEXT_NUMBER" && !lastWasTextNumber){
                            textNum = inText + ' ';
                            type = "NUMBER";
                            lastWasTextNumber = true;
                        }
                        else if(type == "TEXT_NUMBER" && lastWasTextNumber){
                            textNum += inText + ' ';
                            lastWasTextNumber = true;
                            type = "NUMBER";
                        }
                        else if(type != "TEXT_NUMBER" && lastWasTextNumber){
                            //Get whatever the number was as a number token
                            let numToken = this.textNumberToNumber(textNum);
                            tokens.push({ type:"NUMBER", value: numToken, line: line, id: id });
                            lastWasTextNumber = false;
                            textNum = "";
                            if (type !== 'SKIP') {
                                tokens.push({ type, value: inText, line: line, id: id });
                                id++;
                            }
                        }
                        else{
                            lastWasTextNumber = false;

                            if (type !== 'SKIP') {
                                tokens.push({ type, value: inText, line: line, id: id });
                                id++;
                            }
                        }
                        var newlines = (text.match(/\n/g) || []).length;
                        line += newlines;
                        remaining = remaining.slice(text.length);
                        break;
                    }
                }

                if (!matched) {
                    console.error(`Unexpected token: '${remaining[0]}'`);
                    break;
                }
            }
            // console.log(tokens);
            tokens.push({ type: 'EOF' });
            return tokens;
        },
        textNumberToNumber(text){
            text = text.replace(/\s+$/, '');
            if(text == ""){
                return '';
            }
            if(text == "no" || text == "zero"){
                return "0";
            }
            if(text == "eleventyleven"){
                return 1111;
            }

            let numDict = {
                'one': [1, 1],
                'two': [2, 1], 
                'three': [3, 1], 
                'four': [4, 1], 
                'five': [5, 1], 
                'six': [6, 1], 
                'seven': [7, 1], 
                'eight': [8, 1], 
                'nine': [9, 1], 
                'ten': [10, 1], 
                'eleven': [11, 1], 
                'twelve': [12, 1], 
                'thirteen': [13, 1], 
                'fourteen': [14, 1], 
                'fifteen': [15, 1], 
                'sixteen': [16, 1], 
                'seventeen': [17, 1], 
                'eighteen': [18, 1], 
                'nineteen': [19, 1], 
                'twenty': [20, 1], 
                'thirty': [30, 1], 
                'forty': [40, 1], 
                'fifty': [50, 1], 
                'sixty': [60, 1], 
                'seventy': [70, 1], 
                'eighty': [80, 1], 
                'ninety': [90, 1],
                'hundred': [0, 100],
                'thousand': [0, 1000],
                'million': [0, 1000000],
                'billion': [0, 1000000000],
                'trillion': [0, 1000000000000],
                'quadrillion': [0, 1000000000000000],
                'quintillion': [0, 1000000000000000000],
                'sextillion': [0, 1000000000000000000000],
                'septillion': [0, 1000000000000000000000000],
                'octillion': [0, 1000000000000000000000000000],
                'nonillion': [0, 1000000000000000000000000000000],
                'decillion': [0, 1000000000000000000000000000000000],
            }
            if(numDict[text]){
                return numDict[text];
            }
            let numWords = text.split(' ');
            let current = 0;
            let result = 0;
            for(let word of numWords){
                let num = numDict[word];
                if(!num){
                    console.error("somehow we got a non-number in the textNumberToNumber......");
                }
                current = current * num[1] + num[0];
                if(num[1] > 100){
                    result += current;
                    current = 0;
                }
            }
            return result + current;
            
        },
        peek(offset = 0) {
            return this.parser.tokens[this.parser.i + offset] || {};
        },
        expect(type, offset = 0) {
            const token = this.peek(offset);
            if (token.type !== type) {
                throw new SyntaxError(`Expected ${type} at position ${this.parser.i + offset}, got ${token.type}`);
            }
            return token;
        },
        consume(count = 1) {
            this.parser.i += count;
        },
        next() {
            return this.parser.tokens[this.parser.i++];
        },
        isReservedName(name) {
            return this.reservedNames.has(name);
        },
        parseAction(){
            //Hire, fire, or build
            let action = this.next();
            //Actions can be followed by identities or numbers.
            let next = this.peek();
            let target = null;
            let amount = 1;
            //Hire Y
            //Hire Farmer
            if(next.type == 'IDENT'){
                //IDENT is either a value or a reference to a population type.
                //If an identity follows a number, it references the type of population. Otherwise it references the amount of population.
                //In this case, we should always assume it's the direct object, a target of what we are trying to do.

                
                //This identity could either be a variable or the target you wanna grab. Maybe
                //The smart thing to do is check if the ident is a reserved keyword or not
                //TODO:check if its a reserved keyword. If it is, do this
                //Otherwise we might have an expression here
                //Assume the target is this identity
                //Hire farmer
                if(this.isReservedName(next.value)){
                    console.log("Using reserved keyword", next.value);
                    target = next;
                    this.consume();
                }
                else{
                    console.log("Identity is not reserved:", next.value);
                    amount = this.parseExpression();
                }

                //Hire Y ___
                next = this.peek();

                if(next.type == "THEN"){
                    //THEN is only valid inside a conditional
                    //Hire farmer then
                    //Syntax error
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "THAN"){
                    //THAN is only valid inside a comparison
                    //Hire farmer than
                    //Syntax error
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "ARITHMETIC"){
                    //Hire farmer +
                    //We have an equation to solve for the amount
                    //At this point it's too late, I should have already done the math somewhere else. if We have a +, 
                    // It will try to parse the expression with lhs as + and it will make no sense.
                    let amount = this.parseExpression();
                    //Hire farmer + 7 farmers
                    let target = this.peek();
                    if(target.type != 'IDENT'){
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                    this.consume();
                    return {
                        type:"Action",
                        action:action,
                        target:target,
                        amount:amount,
                        tokenid: action.id
                    }
                }

                if(next.type == "PRINT"){
                    //PRINT can only be the main action or an otherwise or result of an evaluatable
                    //Hire farmer print
                    //Syntax error
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "ASSIGN"){
                    //ASSIGN can only be the main action or an otherwise or result of an evaluatable
                    //Hire farmer print
                    //Syntax error
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "ELSE"){
                    //If there are 8 farmers hire y farmers else print 'nope'
                    //Syntax error
                    this.consume();
                    next = this.peek();
                    if(next.type == "ACTION"){
                        let elseAction = this.parseAction();
                        return {
                            type:"Action",
                            action:action,
                            target:target,
                            amount:amount,
                            elseAction:elseAction,
                            tokenid: action.id
                        }
                    }
                    else if(next.type == "PRINT"){
                        let elseAction = this.parsePrint();
                        return {
                            type:"Action",
                            action:action,
                            target:target,
                            amount:amount,
                            elseAction:elseAction,
                            tokenid: action.id
                        }
                    }
                    

                }
                
                if(next.type == 'DOT'){
                    //We are done. Hire Y Farmers.
                    return {
                        type:"Action",
                        action:action,
                        target:target,
                        amount:amount,
                        tokenid: action.id
                    }
                }
                
                if(next.type == "UNTIL"){
                    let untilClause = this.parseUntil();
                    return {
                        type:"Action",
                        action:action,
                        target:target,
                        amount:amount,
                        untilClause:untilClause,
                        tokenid: action.id
                    }
                }
                
                if(next.type == "CONDITIONAL"){
                    let conditionalClause = this.parseConditional();
                    return {
                        type:"Action",
                        action:action,
                        target:target,
                        amount:amount,
                        conditional:conditionalClause,
                        tokenid: action.id
                    }
                }

                if(next.type == "IDENT"){
                    //Hire Y farmers.
                    target = next;
                    this.consume();
                    return {
                        type:"Action",
                        action:action,
                        target:next,
                        amount:amount,
                        tokenid: action.id
                    }
                }

                if(next.type == "COMPARATOR"){
                    //Hire Y > 
                    //Syntax error
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "ACTION"){
                    //Hire Y Fire
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                
                //Identities can be followed by almost anything normally.

            }
            else if(next.type == 'NUMBER'){
                //Hire 7
                next = this.next();
                amount = next.value;
                next = this.peek();
                if(next.type == "IDENT"){
                    //Hire 7 Farmers
                    this.consume();
                    let optionalUntil = this.peek();
                    if(optionalUntil.type == "UNTIL"){
                        let untilClause = this.parseUntil();
                        return {
                            type:"Action",
                            action:action,
                            target:next,
                            amount:amount,
                            untilClause:untilClause,
                            tokenid: action.id
                        }
                    }
                    return {
                        type:"Action",
                        action:action,
                        target:next,
                        amount:amount,
                        tokenid: action.id
                    }
                }

                if(next.type == "DOT"){
                    //Hire 7.
                    //This is technically a syntax error but we can probably figure it out from context.
                    return {
                        type:"Action",
                        action:action,
                        target:null,
                        amount:amount,
                        tokenid: action.id
                    }
                }

                if(next.type == "UNTIL"){
                    let untilClause = this.parseUntil();
                    return {
                        type:"Action",
                        action:action,
                        target:target,
                        amount:amount,
                        untilClause:untilClause,
                        tokenid: action.id
                    }
                }

                if(next.type == "AND"){
                    //Hire 7 and
                    //Syntax error.
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "COMPARATOR"){
                    //Hire 7 >
                    //Syntax error.
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "THEN"){
                    //Hire 7 then
                    //Syntax error.
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "ASSIGN"){
                    //Hire 7 =
                    //Syntax error.
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "CONDITIONAL"){
                    //Hire 7 if
                    //Syntax error.
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }

                if(next.type == "ARITHMETIC"){
                    //Hire 7 +
                    //Time to do math
                    amount = this.parseExpression();
                    let target = this.peek();
                    if(target.type != 'IDENT'){
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                    this.consume();
                    return {
                        type:"Action",
                        action:action,
                        target:target,
                        amount:amount,
                        tokenid: action.id
                    }
                }

            }
            else{
                //Hire (Anything but NUMBER or IDENT)
                //Syntax error.
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            return {
                "type":"Action",
                action:action,
                target:target,
                amount:amount,
                tokenid: action.id
            }
        },
        parseNumber(){
            let value = this.next();
            return {
                type:"Number",
                value,
            }
        },
        parseExpression(){
            //3 + 7 - farmers > x + 1 / 4
            
            //3
            let lhs = this.next();
            let rhs = null;
            let op = null;
            let value = null;

            let safety = 1000;
            let iterator = 0;
            while(iterator < safety){
                iterator++;

                if(value){
                    lhs = value;
                }
                op = this.peek();
                // 3.
                // Either this command is done, 
                // or this expression will be compared somehow, 
                // or this expression is the second half of a comparison and will be followed up with an action
                // so we end.
                let endOfCommand =  op.type == "DOT" || 
                                    op.type == 'EOF' || 
                                    op.type == 'COMPARATOR' || 
                                    op.type == 'ACTION' || 
                                    op.type == 'AND' || 
                                    op.type == 'OR' || 
                                    op.type == 'XOR' || 
                                    op.type == "THEN" || 
                                    op.type == "PRINT" || 
                                    op.type == "ELSE" || 
                                    op.type == "CONDITIONAL" || 
                                    op.type == "THAN";
                // 3 + 
                let isArithmetic = op.type == "ARITHMETIC";

                if(op.type == 'IDENT' || op.type == "NUMBER" || endOfCommand){
                    //could be something like 
                    //no homeless people
                    // here we need to return an ident or a number
                    
                    if(!value){
                        value = {
                            lhs:lhs,
                            rhs:null,
                            op:null,
                        }
                    }
                    break;
                }
                if(op.type == "ASSIGN"){
                    //This has now changed from an expression to an evaluatable.
                    //7 + 1 = 8 + y
                    //I think we return an evaluatable, with the other half being another expression.
                    if(!value){
                        value = {
                            lhs:lhs,
                            rhs:null,
                            op:null,
                        }
                    }
                    this.consume();
                    let leftExpression = {
                        type:"Expression",
                        tokenid: lhs.id || lhs.tokenid,
                        lhs:value.lhs,
                        op:value.op,
                        rhs:value.rhs,
                    }
                    let newOp = { type:"COMPARATOR", value:"==", id: op.id, line: op.line };
                    return {
                        type:"Evaluatable",
                        lhs:leftExpression,
                        op:newOp,
                        rhs:this.parseExpression()
                    }
                }
                else if(!isArithmetic){
                    //This could be the point where we hit something like
                    //Hire farmers until there are 10.
                    //Maybe I can pretend it's find and catch it later?

                    let error = this.getSyntaxErrorFromToken(op);
                    return error;
                }

                //always arthmetic at this point
                //3 +

                op = this.next();

                //Arithmetic only allows Ident and Number
                //3 + 7
                rhs = this.peek();

                let rhsIsValid = rhs.type == "IDENT" || rhs.type == "NUMBER";
                if(!rhsIsValid){
                    let error = this.getSyntaxErrorFromToken(rhs);
                    return error;
                }
                rhs = this.next();
                //3 + 7
                //at this point, value is
                //lhs = 3
                //op = +
                //rhs = 7
                //If there is another round, we want lhs to be the value, then rhs is rhs and op is op
                value = {
                    lhs:lhs,
                    rhs:rhs,
                    op:op,
                    type:"Expression"
                }
            }

            if(iterator == safety){
                console.error("Infinite Loop in parse expression");
            }
            return {
                type:"Expression",
                lhs:value.lhs,
                op:value.op,
                rhs:value.rhs,
            }
        },
        parseUntil(){
            let until = this.next();
            if(until.type != 'UNTIL'){
                console.error("Ran parse until but the token is not an until. Did you next when you meant to peek?");
            }
            let evaluatable = this.parseEvaluatable();
            let next = this.peek();
            while(next.type == "AND" || next.type == "OR" || next.type == "XOR"){
                next = this.next();
                
                let newEvaluatable = {
                    lhs:evaluatable,
                    op:next,
                    rhs:this.parseEvaluatable(),
                    type:"Evaluatable"
                }
                evaluatable = newEvaluatable;
            }
            return evaluatable; 
        },
        parseEvaluatable(){
            //anything that will eventually evaluate to a true/false
            let operator = null;
            let rhs = null;
            let lhs = null;

            let next = this.peek();

            if (next.type == 'THERE_ARE') {
                let tokenid = next.id;
                this.consume();
                //First we check if we are comparing something, otherwise there are is an equality check
                //e.g. If there are more than 0 homeless vs if there are any farmers.
                //The former needs to be a > 0, the latter, = 0
                let optionalComparator = this.peek();
                if(optionalComparator.type == "COMPARATOR"){
                    optionalComparator = this.next();
                    operator = optionalComparator;
                }
                else if(optionalComparator.type == "MORE"){
                    this.consume();
                    operator = {
                        type: "COMPARATOR",
                        value: ">",
                        id: tokenid
                    };
                }
                else if(optionalComparator.type == "LESS"){
                    this.consume();
                    operator = {
                        type: "COMPARATOR",
                        value: "<",
                        id: tokenid
                    };
                }
                else{
                    operator = {
                        type: "COMPARATOR",
                        value: "=",
                        id: tokenid
                    };
                }
                
                //There are can be followed by a number, any, a comparator, or an identity

                //There are 7
                
                // There are two other possibilities if we find a THAN , either this is 
                // There are more than 7 farmers, or
                // There are more farmers than lumberjacks.
                // If the next word is than, we have the former.

                next = this.peek();

                if(next.type == "NUMBER"){
                    //Could be an expression
                    //There are 7( + 1 farmers)
                    //Same as 7 + 1 == farmers
                    lhs = this.parseExpression();
                    
                    //Until there are no homeless people
                    //lhs is an expression,
                    //op is known
                    //rhs needs to be gotten
                    next = this.peek();
                    if(next.type == "THAN"){
                        this.consume();
                    }
                    rhs = this.parseExpression();
                }
                else if(next.type == "IDENT"){
                    lhs = this.parseExpression();
                    
                    //Until there are no homeless people
                    //lhs is an expression,
                    //op is known
                    //rhs needs to be gotten
                    next = this.peek();
                    if(next.type == "THAN"){
                        this.consume();
                    }

                    rhs = this.parseExpression();
                }
                else if(next.type == "ANY"){
                    //We need to change the check from = to > 0
                    //If there are any farmers
                    //farmers > 0
                    this.consume();
                    next = this.peek();
                    if(next.type != "IDENT"){
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                    lhs = this.next();
                    operator = {
                        type: "COMPARATOR",
                        value: ">",
                        id: next.id,
                        line:next.line,
                    }
                    rhs = {
                        id:next.id,
                        type:"NUMBER",
                        value:0,
                        line:next.line,
                    }
                    return {
                        type:"Evaluatable",
                        lhs:lhs,
                        op:operator,
                        rhs:rhs
                    }
                }
                else if(next.type == "THAN"){
                    // There are more than 7 farmers
                    // now we compare a evaluatables
                    this.consume();
                    lhs = this.parseExpression();
                    rhs = this.parseExpression();
                }
                    
                return {
                    type:"Evaluatable",
                    lhs:lhs,
                    op:operator,
                    rhs:rhs
                }

            }

            next = this.peek();

            if(next.type == "IDENT" || next.type == "NUMBER"){

                lhs = this.parseExpression();
                next = this.peek();
                //op should be in the middle
                if(next.type == "COMPARATOR"){
                    operator = this.next();
                }
                next = this.peek();

                if(next.type == "IDENT" || next.type == "NUMBER"){
                    rhs = this.parseExpression();
                }
                
                next = this.peek();
                if(next.type == "AND" || next.type == "OR" || next.type == "XOR"){
                    this.consume();
                    let currentEvaluatable = {
                        type:"Evaluatable",
                        lhs:lhs,
                        op:operator,
                        rhs:rhs
                    }
                    return {
                        type:"Evaluatable",
                        lhs:currentEvaluatable,
                        op:next,
                        rhs:this.parseEvaluatable()
                    }
                }
            }

            return {
                type:"Evaluatable",
                lhs:lhs,
                op:operator,
                rhs:rhs
            }

        },
        parseConditional(){
            let ifWhenToken = this.next();
            if(ifWhenToken.type != 'CONDITIONAL'){
                console.error("Ran parse if but the token is not an if or when. Did you next when you meant to peek?");
            }
            let condition = this.parseEvaluatable();
            let next = this.peek();
            
            while(next.type == "AND" || next.type == "OR" || next.type == "XOR"){
                next = this.next();
                
                let newCondition = {
                    lhs:condition,
                    op:next,
                    rhs:this.parseEvaluatable()
                }
                condition = newCondition;
                next = this.peek();
                if(next.type == 'THEN'){
                    this.consume();

                    break;
                }
            }
            next = this.peek();
            if(next.type == "THEN"){
                this.consume();
            }
            let optionalAction = this.peek();
            if(optionalAction.type == "ACTION"){
                condition.action = this.parseAction();
            }
            if(optionalAction.type == "PRINT"){
                condition.action = this.parsePrint();
            }
            let optionalElse = this.peek();
            if(optionalElse.type == "ELSE"){
                this.consume();
                let optionalElseAction = this.peek();
                if(optionalElseAction.type == "ACTION"){
                    condition.elseAction = this.parseAction();
                }
                if(optionalElseAction.type == "PRINT"){
                    condition.elseAction = this.parsePrint();
                }
            }
            condition.type = "Evaluatable";
            return condition;
        },
        parseIdent(){
            let ident = this.next();
            let name = ident.value;
           
            let next = this.peek();
            if(next.type == "ASSIGN"){
                //Simple assignment.
                //Not valid to assign a reserved keyword
                 if(this.isReservedName(name)){
                    return this.throwSyntaxError('Identifier', name, this.getSyntaxErrorFromToken(ident), ident.id);
                }
                this.consume();
                let rhs = this.parseEvaluatable();
                return {
                    type:"Assignment",
                    init:{
                        type:"Number",
                        value:rhs
                    },
                    id:{
                        type:"Identifier",
                        name
                    }
                }
            }
            else if(next.type == "COMPARATOR"){
                return {
                    
                }
            }
        },
        throwSyntaxError(id, name, message, tokenid = -1) {
            this.parser.i += 10000;
            return {
                type: 'SyntaxError',
                id: {
                    type: id,
                    name,
                    message: message
                },
                tokenid: tokenid

            };
        },
        parsePrint() {
            let printCommand = this.next();
            let output = this.peek();
            let outputid = output.id;
            if(output.type == "NUMBER" || output.type == "IDENT"){
                output = this.parseEvaluatable();
            }
            else if(output.type == "STRING"){
                this.consume();
            }

            let optionalConditional = this.peek();
            let conditional = null;
            if(optionalConditional.type == "CONDITIONAL"){
                conditional = this.parseConditional();                
            }

            return {
                type: 'Print',
                output: output,
                line: printCommand.line,
                tokenid:outputid,
                conditional:conditional
            }
        },
        parsePrimary() {
            const token = this.peek();
            if (token.type == 'IDENT') {
                return this.parseIdent();
            }
            else if (token.type == 'CONDITIONAL') {
                return this.parseConditional();
            }
            else if (token.type == "ACTION") {
                return this.parseAction();
            }
            else if (token.type == 'PRINT') {
                return this.parsePrint();
            }
            else if (token.type == 'DOT') {
                return this.parseDot();
            }
            else {
                //Always advance on syntax errors.
                this.parser.i++;
            }
        },
        parseDot() {
            this.parser.i++;
            return { type: 'Dot' }
        },
        parse(tokens) {
            const ast = [];
            this.parser.i = 0;
            this.parser.tokens = tokens;

            while (this.parser.i < this.parser.tokens.length) {
                ast.push(this.parsePrimary())

                if (this.peek().type == 'DOT') {
                    this.parser.i++;
                }
                if (this.peek().type == 'EOF') {
                    this.parser.i++;
                }
            }
            this.parser.ast = ast;
            //console.log(tokens);
            //console.log(ast);
            return ast;
        },
        evaluate(ast, tokens, act=true) {
            this.consoleOutputs = [];
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
            env['total housing'] = this.getAvailableHousing();
            env['available housing'] = this.getAvailableHousing();
            env['__TOKENS__'] = tokens;
            console.log(env);
            if(act){
                //console.log(env);
                for (const node of ast) {
                    console.log(this.evalNode(node, env));
                }
            }
            
            return env;
        },
        evalNode(node, env) {
            if (!node) {
                console.error('Node was null', env);
            }
            if(!env){
                console.error("You forgot to pass in the env......");
            }
            switch (node.type) {
                case 'Program':
                    for (const stmt of node.body) {
                        this.evalNode(stmt, env);
                    }
                    break;

                case 'Dot':
                    break;

                case 'SyntaxError':
                    if (env['Errors']) {
                        env['Errors'].push(node);
                    }
                    else {
                        env['Errors'] = [node];
                    }
                    break;

                case 'Evaluatable':
                    let left = this.evalNode(node.lhs, env);
                    console.log(node, 'evald to : ', left);
                    //If left is undefined, we have a variable that was never assigned.
                    if(typeof left === 'undefined'){
                        this.consoleOutputs.push(`Our scribes were surprised to see '${node.lhs.lhs.value}' on line ${node.lhs.lhs.line}. They were not sure what you meant when you wrote it.`);
                        return;
                    }
                    if(left.type == "Expression" && node.op == null){
                        return this.evalNode(left, env);
                    }
                    if(node.op == null){
                        return left;
                    }
                    let right = this.evalNode(node.rhs, env);
                    
                    let conditionResult = false;

                    let greaterThanRegex = /((?:is|are)* *(?:greater|more) *(?:than)*)/;
                    let greaterThanMatch = greaterThanRegex.exec(node.op.value);
                    let lessThanRegex = /((?:is|are)* *(?:less|fewer) *(?:than)*)/;
                    let lessThanMatch = lessThanRegex.exec(node.op.value);
                    let isEqualRegex = /((?:is|are)+ *(?:equal|the same as)+ *(?:to|with)*)/;
                    let isEqualMatch = isEqualRegex.exec(node.op.value);
                    let orEqualRegex = /((?:or equal )+ *(?:to|with)*)/;
                    let orEqualMatch = orEqualRegex.exec(node.op.value);
                    //First we check if the value is an exact match to any of the three regexes.
                    if(greaterThanMatch && orEqualMatch){
                        conditionResult = left >= right;
                    }
                    else if(greaterThanMatch){
                        conditionResult = left > right;
                    }
                    else if(lessThanMatch && orEqualMatch){
                        conditionResult = left <= right;
                    }
                    else if(lessThanMatch){
                        conditionResult = left < right;
                    }
                    else if(isEqualMatch){
                        conditionResult = left == right;
                    }
                    else{
                        if(node.op.value.startsWith('is') && node.op.value != 'is'){
                            node.op.value = node.op.value.substring(3);
                        }
                        switch (node.op.value) {
                            case 'and':
                                conditionResult = left && right;
                                break;
                            case 'or':
                                conditionResult = left || (right ? right : false);
                                break;
                            case '>': 
                                conditionResult = left > right;
                                break;
                            case '>=':
                                conditionResult = left >= right;
                                break;
                            case '<=': 
                                conditionResult = left <= right;
                                break;
                            case '<': 
                                conditionResult = left < right;
                                break;
                            case '==': 
                                conditionResult = left == right;
                                break;
                            case 'is': 
                                conditionResult = left == right;
                                break;
                            case 'are': 
                                conditionResult = left == right;
                                break;
                            case '=': 
                                conditionResult = left == right;
                                break;
                        }
                    }

                    if (conditionResult && node.action) {
                        return this.evalNode(node.action, env);
                    }
                    if (!conditionResult && node.action?.elseAction) {
                        return this.evalNode(node.action.elseAction, env);
                    }
                    if (!conditionResult && node.elseAction) {
                        return this.evalNode(node.elseAction, env);
                    }
                    else if(!conditionResult && node.action?.action){
                        this.consoleOutputs.push(`Line ${node.action.action.line}: The people did not ${node.action.action.value} because your specified conditions were not met.`);
                    }
                    return conditionResult;

                case 'Assignment':
                    //console.log("Assigning...", node);
                    if (this.isReservedName(node.id.name)) {
                        console.log("Invalid assignment");
                    }
                    if (node.init.type == "Expression") {
                        let value = this.evalNode(node.init.value, env);
                        env[node.id.name] = value;
                    }
                    else if (node.init.type == "Evaluatable") {
                        let value = this.evalNode(node.init.value, env);
                        env[node.id.name] = value;
                    }
                    else if(node.init.type == "Number"){
                        let value = node.init.value;
                        if(value.type == "Evaluatable"){
                            value = this.evalNode(value, env);
                        }
                        console.log("Setting value", value);
                        env[node.id.name] = value;
                    }
                    else if (node.init.type == "Identifier") {
                        env[node.id.name] = env[node.init.name];
                    }
                    ////console.log(env);
                    break;

                case 'Action':
                    if (node.condition) {
                        if (!this.evalNode(node.condition, env)) {
                            return;
                        }
                    }
                    if (node.action.value == 'hire' || node.action.value == 'fire') {
                        if(!node.target){
                            //Gotta get the antecedent token
                            let anyAntecedentFound = false;
                            for(let token of env['__TOKENS__']){
                                if(token.type == "IDENT" && this.professionReservedNames.has(token.value.toLowerCase())){
                                    if(anyAntecedentFound){
                                        //We have two possible antecedents and cannot continue, throw an error
                                        console.error("TWO ANTECEDENTS OH NOOO", node);
                                        this.consoleOutputs.push(`Line ${node.action.line}: Our scribes were not sure which of the antecedents in this command you were referring to, ${node.target.value} or ${token.value}.`);
                                        return;
                                    }
                                    node.target = {
                                        value:token.value
                                    }

                                    anyAntecedentFound = true;
                                }
                            }
                        }

                        let prof = this.sanitizeProfName(node.target.value);
                        let outputProfName = prof.Name;
                        let amount = 0;
                        if(node.amount.type == "Expression"){
                            amount = this.evalNode(node.amount, env);
                        }else{
                            amount = parseFloat(node.amount);
                        }

                        if (amount != 1) {
                            outputProfName = pluralize.plural(outputProfName);
                        }
                        let actual = 0;
                        if (node.action.value == 'hire'){
                            actual = this.hire(prof, amount);
                        }
                        else{
                            actual = this.fire(prof, amount);
                        }

                        if (actual == amount) {
                            this.consoleOutputs.push(`${node.action.value}d ${amount} ${outputProfName}.`);
                        }
                        else if (actual > 0) {
                            this.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputProfName}, but we were only able to ${node.action.value} ${actual}.`);
                        }
                        else {
                            this.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputProfName}, but we don't have the resources.`);
                        }
                    }

                    if (node.action.value == 'build' || node.action.value == 'demolish') {
                        console.log(node.action.value, "because node", node);
                        if(!node.target){
                            //Gotta get the antecedent token
                            let anyAntecedentFound = false;
                            for(let token of env['__TOKENS__']){
                                if(token.type == "IDENT" && this.buildingReservedNames.has(token.value.toLowerCase())){
                                    if(anyAntecedentFound){
                                        //We have two possible antecedents and cannot continue, throw an error
                                        console.error("TWO ANTECEDENTS OH NOOO", node);
                                        this.consoleOutputs.push(`Line ${node.action.line}: Our scribes were not sure which of the antecedents in this command you were referring to, ${node.target.value} or ${token.value}.`);
                                        return;
                                    }
                                    node.target = {
                                        value:token.value
                                    }

                                    anyAntecedentFound = true;
                                }
                            }
                        }
                        let building = pluralize.singular(node.target.value);
                        let outputBuildingName = node.target.value;
                        let amount = 0;
                        if(node.amount.type == "Expression"){
                            amount = this.evalNode(node.amount, env);
                        }else{
                            amount = parseFloat(node.amount);
                        }

                        if (amount != 1) {
                            outputBuildingName = pluralize.plural(outputBuildingName);
                        }
                        let actual = 0;
                        if(node.action.value == "build"){
                            actual = this.buildBuilding({ Name: building }, amount);
                        }
                        else if(node.action.value == "demolish"){
                            actual = this.demolishBuilding({ Name: building }, amount);
                        }

                        
                        console.log(actual, amount);
                        if (actual == amount) {
                            this.consoleOutputs.push(`${node.action.value} ${amount} ${outputBuildingName}.`);
                        }
                        else if (actual > 0) {
                            this.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputBuildingName}, but we were only able to ${node.action.value} ${actual}.`);
                        }
                        else {
                            this.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputBuildingName}, but we don't have the materials.`);
                        }
                    }
                    break;
                case 'Print':
                    console.log(node);
                    if (node.output.type == 'STRING') {
                        this.consoleOutputs.push('Line ' + node.line + ': ' + node.output.value.slice(1, -1));
                        break;
                    }
                    let num = null;
                    if(node.output.type == "Expression"){
                        num = this.evalNode(node.output, env);
                    }
                    else if(node.output.type == "Evaluatable"){
                        num = this.evalNode(node.output, env);
                    }
                    else{
                        num = parseFloat(node.output.value);
                    }

                    if (num !== null) {
                        this.consoleOutputs.push('Line ' + node.line + ': ' + num);
                    }
                    else {
                        let value = env[node.output.value];
                        if (typeof value == 'undefined') {
                            this.consoleOutputs.push('Line ' + node.line + ': ' + node.output.value + ` has not been referenced before this point. If you just want to print the word ${node.output.value} our scribes request you put it inside of quotation marks like '${node.output.value}' or "".`);

                        }
                        else {
                            this.consoleOutputs.push('Line ' + node.line + ': ' + node.output.value + ' is ' + value + '.');

                        }
                        //console.log(node, env[node.output.value], env);
                    }

                    break;

                case 'Identifier':
                    if (!(node.identifier in env)) {
                        console.error(node);
                    }
                    return env[node.identifier];

                case 'NumberLiteral':
                    return node.value;

                case 'BooleanOperator':
                    let leftHand = this.evalNode(node.lhs, env);
                    let rightHand = this.evalNode(node.rhs, env);

                    let truthiness = false;
                    if (node.value.type == 'AND') {
                        truthiness = leftHand && rightHand;
                    }
                    else if (node.value.type == 'OR') {
                        truthiness = leftHand || rightHand;
                    }
                    else if (node.value.type == 'NOT') {
                        truthiness = !(leftHand && rightHand);
                    }
                    else if (node.value.type == 'XOR') {
                        truthiness = (leftHand == true && rightHand == false) || (leftHand == false && rightHand == true);
                    }
                    if (truthiness) {
                        if (node.action) {
                            return this.evalNode(node.action, env);
                        }
                        return true;
                    }
                    return false;
                    
                case 'IDENT':
                    //console.log(env, node.value, env[node.value]);
                    return env[node.value];
                case 'NUMBER':
                    return parseFloat(node.value);
                case 'Expression':
                    //console.log("Begin parse Expression:", node);
                    
                    if(!node.op){
                        //This expression is probably just a value.
                        //console.log("NO op in this expression:" , node);
                        //current problem is you can get here with an expresssion that has a value and one that has not value layer.
                        return this.evalNode(node.lhs, env);
                    }

                    let leftValue = 0;
                    let rightValue = 0;
                    if(node.lhs.type == "NUMBER"){
                        leftValue = parseFloat(node.lhs.value);
                    }
                    else{
                        leftValue = this.evalNode(node.lhs, env);
                    }
                    
                    if(node.rhs.type == "NUMBER"){
                        rightValue = parseFloat(node.rhs.value);
                    }
                    else{
                        rightValue = this.evalNode(node.rhs, env);
                    }

                    switch (node.op.value) {
                        case '+': return leftValue + rightValue;
                        case '-': return leftValue - rightValue;
                        case '*': return leftValue * rightValue;
                        case '/': return leftValue / rightValue;
                        case '%': return leftValue % rightValue;
                        default: console.error(`Unknown operator: ${node.op}`);
                    }

                default:
                    console.error(`Unknown node type: ${node.type} ${JSON.stringify(node)}`);
            }
        },
        testParse(tokens, expected) {
            let ast = this.parse(tokens);
            if (JSON.stringify(ast) == JSON.stringify(expected)) {
                return true;
            }
            const maxLength = Math.max(ast.length, expected.length);
            let diffs = [];

            for (let i = 0; i < maxLength; i++) {
                if (JSON.stringify(ast[i]) != JSON.stringify(expected[i])) {
                    let compared = this.compareConditionals(ast[i], expected[i]);
                    let anyFalse = false;
                    for (let [key, value] of Object.entries(compared)) {
                        if (value == false) {
                            anyFalse = key;
                            break;
                        }
                    }
                    if (anyFalse) {
                        diffs.push({ index: i, ast: ast[i], expected: expected[i], comparison: compared, expectedValue: expected[i][anyFalse], actualValue: ast[i][anyFalse] });
                    }

                }
            }
            if (diffs.length == 0) {
                return true;
            }
            return diffs;
        },
        testTokenize(code, expected) {
            let tokens = this.tokenize(code);

            if (JSON.stringify((tokens)) == JSON.stringify((expected))) {
                return true;
            }
            const maxLength = Math.max(tokens.length, expected.length);
            const diffs = [];

            for (let i = 0; i < maxLength; i++) {
                if (JSON.stringify((tokens[i])) != JSON.stringify((expected[i]))) {

                    diffs.push({ index: i, tokens: tokens[i], expected: expected[i], comparison: this.compareConditionals(tokens[i], expected[i]) });
                }
            }
            if (diffs.length == 0) {
                return true;
            }
            return diffs;
        },
        compareConditionals(obj1, obj2) {
            return {
                "type": obj1?.type == obj2?.type,
                "test.left.type": obj1?.test?.left?.type == obj2?.test?.left?.type,
                "test.left.value": obj1?.test?.left?.value == obj2?.test?.left?.value,
                "test.left.line": obj1?.test?.left?.line == obj2?.test?.left?.line,
                "test.op.type": obj1?.test?.op?.type == obj2?.test?.op?.type,
                "test.op.value": obj1?.test?.op?.value == obj2?.test?.op?.value,
                "test.op.line": obj1?.test?.op?.line == obj2?.test?.op?.line,
                "test.right.type": obj1?.test?.right?.type == obj2?.test?.right?.type,
                "test.right.value": obj1?.test?.right?.value == obj2?.test?.right?.value,
                "test.right.line": obj1?.test?.right?.line == obj2?.test?.right?.line,
                "action.type": obj1?.action?.type == obj2?.action?.type,
                "action.action.type": obj1?.action?.action?.type == obj2?.action?.action?.type,
                "action.action.value": obj1?.action?.action?.value == obj2?.action?.action?.value,
                "action.action.line": obj1?.action?.action?.line == obj2?.action?.action?.line,
                "action.count": obj1?.action?.count == obj2?.action?.count,
                "action.actionTarget.type": obj1?.action?.actionTarget?.type == obj2?.action?.actionTarget?.type,
                "action.actionTarget.value": obj1?.action?.actionTarget?.value == obj2?.action?.actionTarget?.value,
                "action.actionTarget.line": obj1?.action?.actionTarget?.line == obj2?.action?.actionTarget?.line,
                "action.condition.type": obj1?.action?.condition?.type == obj2?.action?.condition?.type,
                "action.condition.test.left.type": obj1?.action?.condition?.test?.left?.type == obj2?.action?.condition?.test?.left?.type,
                "action.condition.test.left.value": obj1?.action?.condition?.test?.left?.value == obj2?.action?.condition?.test?.left?.value,
                "action.condition.test.left.line": obj1?.action?.condition?.test?.left?.line == obj2?.action?.condition?.test?.left?.line,
                "action.condition.test.op.type": obj1?.action?.condition?.test?.op?.type == obj2?.action?.condition?.test?.op?.type,
                "action.condition.test.op.value": obj1?.action?.condition?.test?.op?.value == obj2?.action?.condition?.test?.op?.value,
                "action.condition.test.right.type": obj1?.action?.condition?.test?.right?.type == obj2?.action?.condition?.test?.right?.type,
                "action.condition.test.right.value": obj1?.action?.condition?.test?.right?.value == obj2?.action?.condition?.test?.right?.value,
                "action.condition.test.right.line": obj1?.action?.condition?.test?.right?.line == obj2?.action?.condition?.test?.right?.line,
                "action.condition.action": obj1?.action?.condition?.action == obj2?.action?.condition?.action
            };
        },
        testGetDifferences(obj1, obj2) {
            let innerDiffs = [];
            ////console.log("Getting diffs...");
            for (let [key, value] of Object.entries(obj1)) {
                let value2 = obj2[key];
                if (JSON.stringify(value) != JSON.stringify(value2)) {
                    //console.log("Different", value, value2);
                    if (typeof value == 'Object') {
                        innerDiffs.push(this.testGetDifferences(value, value2));
                    }
                    else if (typeof value == 'Array') {
                        let index = 0;
                        for (let element of value) {
                            innerDiffs.push(this.testGetDifferences(element, value2[index]));
                            index++;
                        }

                    }
                    else {
                        innerDiffs.push([key, value, value2]);
                    }
                }
            }
            return innerDiffs;
        },
        testEval() {

        },
        testCode(type, code, expected) {
            if (type == 'token') {
                var output = this.testTokenize(code, expected);
            }
            else if (type == 'parse') {
                let tokens = this.tokenize(code);
                var output = this.testParse(tokens, expected);
            }
            //console.log(output);
            return output;
        },
        getSyntaxErrorFromToken(token) {
            console.error(token);
            let name = token.value;
            if (this.professionReservedNames.has(name)) {
                return `Our scribes are confused by your law. Our people cannot make ${pluralize.plural(name)} by magic. On line ${token.line} we wonder if you meant to hire or fire more ${pluralize.plural(name)}? ${name.charAt(0).toUpperCase() + name.slice(1)} is a special word that always refers to our people with the profession of ${name}.`;
            }
            else if (this.currencyReservedNames.has(name)) {
                return `Our scribes are confused by your law. On line ${token.line} we wonder if you forgot an 'if' by the word '${name}'? ${name.charAt(0).toUpperCase() + name.slice(1)} is a special word that always refers to our people's ${name}.`;
            }
            else if (this.isReservedName(name)) {
                return `
                Our scribes fear your law may be difficult to understand. 
                On line ${token.line} your reference to '${name}' makes us think of something else. 
                Trying to say it is something else is unclear. 
                It may need a different name.`;
            }
            return `Unknown Syntax error: line ${token.line}, ${token.value}`;
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
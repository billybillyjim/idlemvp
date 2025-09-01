
import house from './components/house.js'
import population from './components/population.js'
import timeinfo from './components/timeinfo.js'
import currencies from './components/currencies.js'
import technology from './components/technology.js'
import settings from './components/settings.js'
import laws from './components/laws.js'
import Tooltip from './components/tooltip.js'
import codetester from './components/codetest.js'

import pluralize from './lib/pluralize.js'
import weather from './lib/weather.js'

import currencydata from './data/currencydata.js'
import unlockablesdata from './data/unlockablesdata.js'
import technologies from './data/technologydata.js'
import productionModifiers from './data/productionModifiers.js'

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
        Tooltip
    },
    delimiters: ['[[', ']]'],
    data: function () {
        return {
            Verbose: true,
            civilizationName:"",
            currentMenu:"Main",
            menus:["Main", "Population", "Stockpiles", "Technology", "Laws", "Modifiers", "Settings"],
            currentDate: new Date(2000, 0, 1),
            populationMenu:{
                amount:1,
                customSelected:false,
            },
            technologyMenu:{
                showCompleted:false,
            },
            log: [],
            consoleOutputs: [],
            uploadedSaveFile: null,
            population: 1,
            growthThreshold: 50,
            QOLDecay: 0.95,
            ticksOfUnmetSpaceDemand: 0,
            tickspeed: 300,
            currentTick: 0,
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
            currencyDailyChange:{},
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
            houseTypes: [
                { Name: 'Hut', Type: "Housing", Count: 1, Cost: { Wood: 50, Space: 10 }, Houses: 3, Unlocked: true, Visible: true, },
                { Name: 'Granary', Type: "Storage", Count: 1, Cost: { Bricks: 50, Space: 10 }, Stores: { 'Food': 1000 }, Unlocked: true, Visible: true, },
                { Name: 'Large Hut', Type: "Housing", Count: 1, Cost: { Wood: 500, Space: 25 }, Houses: 12, Unlocked: true, Visible: true, },
            ],
            missingProfessionCounts: {},
            professions: [
                {
                    Name: 'Unemployed',
                    Count: 15,
                    Cost: {},
                    Produces: { 'Food': 0.9 },
                    BaseDemand: { Food: 60 },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                },
                {
                    Name: 'Farmer',
                    Count: 0,
                    Cost: {},
                    Produces: { 'Food': 2.1 },
                    BaseDemand: {
                        Wood: 0.1,
                        Food: 1
                    },
                    ModifiedDemand: {},
                    Unlocked: true,
                    Visible: true,
                },
                // {Name:'Test', Count:0, Cost:{}, Produces:{}, Unlocked:true, Visible:true,},

            ],
            productionModifiers,
            technologies,
            currencydata,
            endTickCurrencyValues: {},
            beginTickCurrencyValues: {},
            preCostTickCurrencyValues: {},
            currencyDemandDescriptions: {},
            currencyProductionDescriptions: {},
            currencyConsumptionDescriptions: {},
            demand: {},
            unmetdemand: {},
            unlockablesdata,
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
            parser: {
                i: 0,
                tokens: [],
            }
        }
    },
    created() {
        this.endTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
        this.beginTickCurrencyValues = JSON.parse(JSON.stringify(this.currencydata));
        // for(let tech of this.technologies){
        //     tech.Unlock(this);
        // }
        const input = `
                if Wood >= 0 then hire Test until there are 10.
                `;

        this.generateReservedNames();
    },
    mounted: async function () {
        this.gameProcess = setInterval(this.gameTick, this.tickspeed);
    },
    methods: {
        setMenu(menu){
            this.currentMenu = menu;
        },
        formatDate(date) {
            if(typeof date === "string"){
                date = new Date(date);
            }
            let calTech = this.getCalendarTech()
            if(calTech == 'Solar'){
                const year = date.getFullYear() - 2000;
                const month = date.toLocaleString('en-US', { month: 'long' });
                const day = String(date.getDate()).padStart(2, '0');

                return `${year} ${month} ${day}`;
            }
            else if(calTech == 'Lunar'){
                let [day, month] = this.getLunarDate(date);
                return `${day} ${month}`;
            }
            else{
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
        },
        runCode(code, outputTokens, outputAST, outputOutput) {
            if (this.reservedNames.size == 0) {
                this.generateReservedNames();
            }
            const tokens = this.tokenize(code);
            if (outputTokens) {
                console.log(tokens);
            }
            const ast = this.parse(tokens);
            if (outputAST) {
                console.log(ast);
            }
            let output = this.evaluate(ast);
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
        getTechnologies(sort=false) {
            //const allTechByName = Object.fromEntries(this.technologies.map(t => [t.Name, t]));
            for (let tech of this.technologies) {
                if (!tech.Visible) {
                    let hasResources = this.canAfford(tech.Cost);
                    if (hasResources) {
                        tech.Visible = true;
                    }
                }
            }
            let techs = this.technologies.filter(x => {
                let hasAllRequirements = this.hasRequirements(x);
                return x.Visible && hasAllRequirements
            });
            if(sort){
                techs.sort((a,b) => b.IsUnlocked - a.IsUnlocked);
            }
            return techs; 
        },
        hasTechnology(techName) {
            return this.technologies.find(x => x.Name == techName)?.isLocked == false;
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
                console.log("No uploaded save file.");
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
            if (requireable?.Requirements?.Technologies) {
                for (let techName of requireable?.Requirements?.Technologies) {
                    let tech = this.technologies.find(x => x.Name == techName);
                    if (!tech) {
                        console.error("Invalid tech name for requirement in hasRequirements:", requireable, techName);
                    }
                    else if (tech.isLocked) {
                        return false;
                    }

                }
            }

            if (requireable?.Requirements?.Populations) {
                for (let [population, count] of Object.entries(requireable?.Requirements?.Populations)) {
                    if (population == 'Global') {
                        let enough = this.getPopulation() >= count;
                        if (!enough) {
                            return false;
                        }
                    }
                    else {
                        let enough = this.professions[population] >= count;
                        if (!enough) {
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        getCalendarTech() {
            let solarUnlocked = this.technologies.find(x => x.Name == 'Solar Calendar')?.isLocked == false;
            let lunarUnlocked = this.technologies.find(x => x.Name == 'Lunar Calendar')?.isLocked == false;
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
            this.currencyDemandDescriptions = {};
            this.currencyProductionDescriptions = {};
            this.currencyConsumptionDescriptions = {};
            this.processBaseGrowth();
            this.processProductionModifiers();
            this.processProfessions();
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
        },
        processProductionModifiers(){
            for(let prodMod of this.productionModifiers){
                if(prodMod.IsUnlocked == false){
                    prodMod.IsUnlocked = this.hasRequirements(prodMod);
                }
            }
        },
        processHousingDemand() {
            this.currencydata.Housing.Amount = this.getTotalHousing();
            this.modifyDemand('Housing', (this.getPopulation() / ((this.getAvailableHousing() - this.getPopulation()) + 1)) * 5, "Base Population Housing Desire");
        },
        buildBuilding(houseType, amount = 1) {
            let target = this.houseTypes.find(x => x.Name.toLowerCase() == houseType.Name.toLowerCase());
            let actual = 0;
            if (target) {
                for (let i = 0; i < amount; i++) {
                    if (this.canAfford(target.Cost)) {
                        this.buy(target.Cost, 1, 'Building ' + target.Name);
                        target.Count++;
                        actual++;
                    }
                    else {
                        break;
                    }
                }

            }
            return actual;
        },
        getCurrencyByName(currencyName){
            return this.currencydata[currencyName];
        },
        getCurrentModifiers(){
            return this.productionModifiers.filter(x => x.IsUnlocked == true).flatMap(modifier =>
                modifier.Boosts.map(boost => ({
                    modifierName: modifier.Name,
                    boost,
                    requirements: modifier.Requirements
                }))
            );
        },
        getModifierTypeDescription(modifierType){
            if(modifierType == 'Additive'){
                return '+';
            }
            else if(modifierType == 'Multiplicative'){
                return 'x';
            }
            console.error('Yo this modifier type doesn\'t exist!', modifierType);
            return '';
        },
        processDeaths() {
            let deathOdds = 0.01;
            for (let prof of this.professions) {
                let rand = Math.random();
                if (rand < deathOdds) {
                    this.die(prof, 1);
                }
            }
        },
        die(profession, amount) {
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
                    this.logit(this.getNameOrProfession(profession, actual) + " has died.");
                }
            }
            else {
                if (this.getPopulation() < 1000) {
                    this.logit(actual + " " + this.getNameOrProfession(profession, actual) + " have died.");
                }
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
        modifyDemand(good, amount, reason){
            if(amount == 0){
                return;
            }
            if(this.currencyDemandDescriptions[good]){
                this.currencyDemandDescriptions[good].push([good, this.formatNumber(amount), reason]);
            }
            else{
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

            let baseHideDemand = 0.1;
            let baseClayDemand = 0.1;
            let baseWoodDemand = 0.15;
            let baseOreDemand = 0.02;
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
                this.modifyDemand('Space', unmetSpaceDemand * totalPop * ticksOfUnmetSpaceDemand, 'Unmet Demand');
            }
            else {
                this.ticksOfUnmetSpaceDemand = 0;
            }
            
            
            this.modifyDemand('Housing', baseHousingDemand * totalPop, 'Global Demand');
            this.modifyDemand('Furniture', baseFurnitureDemand * totalPop, 'Global Demand');
        },
        processTechnologyDemand() {
            for (let tech of this.technologies) {
                if (tech.isLocked == false) {
                    for (let [good, mod] of Object.entries(tech.demandModifiers.Global)) {
                        this.modifyDemand(good, mod, "From " + tech.Name);
                    }
                    for (let [good, mod] of Object.entries(tech.demandModifiers.PerCapita)) {
                        this.modifyDemand(good,  mod * this.getPopulation(), "Per Capita from " + tech.Name);
                    }
                    for (let prof of this.professions) {
                        if (tech.demandModifiers[prof.Name]) {
                            for (let [good, mod] of Object.entries(tech.demandModifiers[prof.Name])) {
                                this.modifyDemand(good, mod * prof.Count, "From " + prof.Name + " and tech " + tech.Name);
                            }
                        }
                    }
                }
            }
        },
        processUnmetDemand() {
            for (let currency of Object.values(this.currencydata)) {
                if (currency.Name == 'Housing') {
                    if (this.getAvailableHousing() < 10) {
                        this.unmetdemand['Housing'] += 0.1;
                    }
                    if (this.getAvailableHousing() > 15) {
                        this.unmetdemand['Housing'] = 0;
                    }
                    continue;
                }

                let preCostAmount = this.preCostTickCurrencyValues[currency.Name]?.Amount;
                let beginTickAmount = this.beginTickCurrencyValues[currency.Name]?.Amount;
                let endAmount = this.endTickCurrencyValues[currency.Name]?.Amount;

                let change = (preCostAmount - beginTickAmount);
                let dailyChange = (endAmount - beginTickAmount);
                this.currencyDailyChange[currency.Name] = dailyChange;
                if (currency.Name == 'Space') {
                    continue;
                }
                if (change >= 0 && this.demand[currency.Name]) {
                    this.modifyDemand(currency.Name, -change, "Met by production ");

                    if (!this.unmetdemand[currency.Name]) {
                        this.unmetdemand[currency.Name] = -change;
                    }
                    else {
                        this.unmetdemand[currency.Name] -= change;
                    }
                    if (this.unmetdemand[currency.Name] < 0) {
                        this.unmetdemand[currency.Name] = 0;
                    }
                    if (this.demand[currency.Name] < 0) {

                        this.demand[currency.Name] = 0;
                    }
                }

                if (endAmount < dailyChange) {
                    this.modifyDemand(currency.Name, Math.abs(-change - endAmount), "Lowering stockpiles");

                }
            }

            for (let [k, v] of Object.entries(this.unmetdemand)) {
                if (v > 0) {
                    this.modifyDemand(k, v, "Unmet demand");
                }
            }
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
        getDailyChange(currencyName){
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
            const usable = Math.min(this.currencydata["Knowledge"].Amount, needed);

            this.focusedTechnology.Progress += usable;
            this.currencydata["Knowledge"].Amount -= usable;

            if (this.focusedTechnology.Progress >= this.focusedTechnology.Complexity) {
                this.focusedTechnology.Unlock(this);
                this.focusedTechnology = null;

            }
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

            for (let reason of this.currencyProductionDescriptions[currency.Name] ?? []) {
                output += reason[2] + ': ' + reason[1] + '\n';
            }

            for (let reason of this.currencyConsumptionDescriptions[currency.Name] ?? []) {
                output += reason[2] + ': ' + reason[1] + '\n';
            }

            return output;
        },
        getDailyDemandDescription(currency) {
            let output = '';
            for (let reason of this.currencyDemandDescriptions[currency.Name] ?? []) {
                output += reason[2] + ': ' + reason[1] + '\n';
            }
            return output;
        },
        addCurrency(currencyName, amount, reason){
            if(amount == 0){
                return;
            }
            if(this.currencyProductionDescriptions[currencyName]){
                this.currencyProductionDescriptions[currencyName].push([currencyName, amount, reason]);
            }
            else{
                this.currencyProductionDescriptions[currencyName] = [[currencyName, amount, reason]];
            }
            this.currencydata[currencyName].Amount += amount;
        },
        payCurrency(currencyName, amount, reason){
             if(amount == 0){
                return;
            }
            if(this.currencyConsumptionDescriptions[currencyName]){
                this.currencyConsumptionDescriptions[currencyName].push([currencyName, amount, reason]);
            }
            else{
                this.currencyConsumptionDescriptions[currencyName] = [[currencyName, amount, reason]];
            }
            this.currencydata[currencyName].Amount += amount;
        },
        processBaseGrowth() {
            this.addCurrency('Food', 5, 'Base Production');
            this.addCurrency('Knowledge', this.getPopulation() * 0.002, 'From Population');
            if (this.currencydata.Food.Amount >= this.growthThreshold && this.hasAvailableHousing()) {
                let growthChance = 0.05 * (this.currencydata.Food.Amount / this.growthThreshold);
                let rand = Math.random();
                if (rand < growthChance) {
                    this.professions.find(x => x.Name == "Unemployed").Count += 1;
                    for (let [prof, missingCount] of Object.entries(this.missingProfessionCounts)) {
                        if (missingCount > 0) {
                            this.hire(this.professions.find(x => x.Name == prof), 1);
                            this.missingProfessionCounts[prof] -= 1;
                            break;
                        }
                    }

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
                }
            }
        },
        processCosts() {
            for (let profession of this.professions) {
                this.payCurrency('Food', -profession.Count, "Feeding " + (profession.Count == 1 ? profession.Name : pluralize.plural(profession.Name)));
                //this.currencydata.Food.Amount -= profession.Count;

                if (!this.buy(profession.Cost, profession.Count, "Cost of " + profession.Name)) {
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
                if (good == 'Space' || good == 'Knowledge') {
                    continue;
                }
                let obj = {}
                obj[good] = demand;
                this.buy(obj, demand, "Demand for " + good);
            }
            if (this.currencydata.Food.Amount < 0) {
                this.starvePeople();
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
            if (!this.canAfford(worker.Cost)) {
                return;
            }
            const [additiveModifiers, multModifiers] = this.getProductionModifiers(name);
            for (let [currency, amount] of Object.entries(worker.Produces)) {
                let baseProduction = amount + (additiveModifiers[currency] || 0);
                let totalBase = baseProduction * count;
                let withRatio = totalBase * this.getWorkRatio();
                let withMult = withRatio * (multModifiers[currency] || 1);
                let produced = withMult;
                this.addCurrency(currency, produced, "Produced by " + name);
            }
        },
        getProductionModifiers(name) {
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
            return [additiveModifiers, multModifiers];
        },
        productionToNiceString(profession) {
            if (!profession.Produces) {
                return {};
            }
            const [additiveModifiers, multModifiers] = this.getProductionModifiers(profession.Name);
            let o = Object.entries(profession.Produces)
                .map(([currency, baseAmount]) => {
                    const additive = additiveModifiers[currency] || 0;
                    const multiplier = multModifiers[currency] || 1;
                    const total = (baseAmount + additive) * this.getWorkRatio() * multiplier;
                    return [currency, this.formatNumber(total)]
                });
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
            const [additiveModifiers, multModifiers] = this.getProductionModifiers(profession.Name);
            let o = Object.entries(profession.Produces)
                .map(([currency, baseAmount]) => {
                    const additive = additiveModifiers[currency] || 0;
                    const multiplier = multModifiers[currency] || 1;
                    const total = (baseAmount + additive) * profession.Count * this.getWorkRatio() * multiplier;
                    return [currency, this.formatNumber(total)]
                });
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
                    foodDebt -= take;
                    this.logit("Your population is starving. " + this.formatNumber(take) + " " + prof.Name + "(s) died.");
                    if (foodDebt <= 0) {
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
        hire(profession, amount = 1) {
            let maxPossible = Math.min(amount, this.getAvailableWorkers());
            let actual = this.buy(profession.Cost, maxPossible, "Hiring " + profession.Name);
            profession.Count += actual;
            this.modifyUnemployed(-actual);

            return actual;
        },
        fire(profession, amount = 1) {
            let maxPossible = Math.min(amount, profession.Count);
            profession.Count -= maxPossible;
            this.modifyUnemployed(maxPossible);

            return maxPossible;
        },
        canFire(profession) {
            if (profession.Count > 0) {
                return true;
            }
            return false;
        },
        canHire(profession){
            return profession.Unlocked == true 
            && this.getAvailableWorkers() > 0
            && this.canAfford(profession.Cost);
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
        buy(cost, amount = 1, reason="Lazy Developer") {
            if (!this.canAfford(cost, amount)) {
                return 0;
            }
            for (const [k, v] of Object.entries(cost)) {
                this.payCurrency(k, v * amount, reason);
            }
            return amount;
        },
        getTotalHousing() {
            return this.houseTypes.map(x => x.Count * (x.Houses ?? 0)).reduce((a, b) => a + b);
        },
        getVisibleHouseTypes() {
            return this.houseTypes.filter(x => x.Visible && x.Type == 'Housing');
        },
        getVisibleBuildings() {
            return this.houseTypes.filter(x => x.Visible && x.Type != 'Housing');
        },
        getVisibleProfessions() {
            return this.professions.filter(x => x.Visible);
        },
        costToString(cost) {
            return Object.entries(cost)
                .map(([key, value]) => `<img class="image-icon" src="${this.currencydata[key].Icon}" /> ${this.formatNumber(value)}`)
                .join(', ');
        },
        getProduction(profession) {
            return this.professions.find(x => x.Name == profession).Produces;
        },
        hasNumbers() {
            if (this.technologies.find(x => x.Name == 'Numbers')?.isLocked) {
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
        getWeatherForDate(date){
            const timeOfDay = date.getHours() % 24;
            let startOfYear = new Date(date.getFullYear(), 0, 0);
            let diff = date - startOfYear;
            let oneDay = 1000 * 60 * 60 * 24;
            let currentDay = Math.floor(diff / oneDay);
            let hourInYear = currentDay * 24 + timeOfDay;
            let quantizedHour = Math.floor(hourInYear / 12) * 12;
            let currentWeather = weather.Weathers[quantizedHour % weather.Weathers.length];
            let weatherDescription = this.getWeatherDescription(currentWeather);
            return 'The weather is ' + weatherDescription + '.';
        },
        getWeatherDescription(weatherData) {
            const { temp, rain, humid, wind, cloud } = weatherData;
            let description = [];

            // Temperature description
            if (temp <= -10) description.push("freezing cold");
            else if (temp <= 0) description.push("very cold");
            else if (temp <= 10) description.push("chilly");
            else if (temp <= 20) description.push("cool");
            else if (temp <= 30) description.push("warm");
            else description.push("hot");

            // Precipitation
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
                // Clouds
                if (cloud > 75) description.push("overcast");
                else if (cloud > 40) description.push("partly cloudy");
                else if (cloud > 0) description.push("mostly clear");
                else description.push("clear skies");
            }

            // Wind
            if (wind > 30) description.push("very windy");
            else if (wind > 10) description.push("windy");



            // Humidity extremes
            if (humid >= 90) description.push("humid");
            else if (humid < 25) description.push("dry");

            // Return a nice sentence
            return description.join(", ");
        },
        getRelativeNumber(n) {
            if (n < 1) {
                return "None";
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
                ['NUMBER', /^\d+/],
                ['OPERATOR', /^(greater than|are greater than|is greater than|are less than|is less than|less than|are more than|is more than|more than|fewer than|is fewer than|are fewer than)/],
                ['AND', /^and\b/],
                ['OR', /^or\b/],
                ['NOT', /^not\b/],
                ['XOR', /^xor\b/],
                ['ASSIGN', /^(is\b|=)/],
                ['PLUS', /^\+/],
                ['MINUS', /^-/],
                ['STAR', /^\*/],
                ['SLASH', /^\//],
                ['LPAREN', /^\(/],
                ['RPAREN', /^\)/],
                ['NEWLINE', /^\n+/],
                ['SKIP', /^[ \t\n]+/],
                ['CONDITIONAL', /^(if|when)/],
                ['DOT', /^\./],
                ['THEN', /^then\b/],
                ['UNTIL', /^until\b/],
                ['PRINT', /^print\b/],
                ['PRODUCTION', /^production\b/],
                ['CONSUMPTION', /^consumption\b/],
                ['THERE_ARE', /^(there are|there is)\b/],
                ['IT_IS', /^it is\b/],
                ['ACTION', /^(hire|fire|build)\b/],
                ['SKIP', /^(a )\b/],
                ['IDENT', /^(construction worker|construction workers)\b/],
                ['IDENT', /^(unemployed people)\b/],
                ['IDENT', /^[a-zA-Z_]\w*/],
                ['OPERATOR', /^(>=|<=|>|<|==|=)/],
            ];


            const tokens = [];
            let remaining = input.toLowerCase();
            let line = 1;

            while (remaining.length > 0) {
                let matched = false;

                for (const [type, regex] of tokenSpec) {
                    const match = regex.exec(remaining);
                    if (match) {
                        matched = true;
                        const text = match[0];
                        const newlines = (text.match(/\n/g) || []).length;
                        if (type !== 'SKIP') {
                            tokens.push({ type, value: text, line: line });
                        }
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
            console.log(tokens);
            tokens.push({ type: 'EOF' });
            return tokens;
        },
        peek(offset = 0) {
            return this.parser.tokens[this.parser.i + offset] || {};
        },
        expect(type, offset = 0) {
            const token = peek(offset);
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
        parseAction() {
            //do something (until) lhs op rhs
            //TODO:Reverse this logic. Until x should mean while x not true
            //hire farmers until (there are 7 (farmers)) 
            let action = this.next();
            let count = 1;
            let actionTarget = this.next();
            if (actionTarget.type == 'NUMBER') {
                count = parseInt(actionTarget.value);
                actionTarget = this.next();
            }
            let until = this.peek();
            let actionConditional = null;
            //Until or if or when
            if (until.type == 'UNTIL' || until.type == 'CONDITIONAL') {
                actionConditional = this.parseConditional(actionTarget);
            }
            return {
                type: 'Action',
                action,
                count: count,
                actionTarget,
                condition: actionConditional
            }
        },
        parseIdent() {
            //Allowed ideas of syntax:

            //X = 10.
            //y is 7.
            //
            const identToken = this.next();
            const name = identToken.value;
            if (this.isReservedName(name)) {
                return this.throwSyntaxError('Identifier', name, this.getSyntaxErrorFromToken(identToken));
            }
            if (this.peek().type == 'ASSIGN') {
                this.consume();
                const valueToken = this.next();
                if (valueToken.type == 'NUMBER') {
                    return {
                        type: 'Assignment',
                        id: { type: 'Identifier', name },
                        init: { type: 'Literal', value: Number(valueToken.value) }
                    };
                }
                else if (valueToken.type == 'IDENT') {
                    if (this.peek().type == 'PRODUCTION' || this.peek().type == "CONSUMPTION") {
                        let modifier = this.next();
                        valueToken.value += ' ' + modifier.value;
                    }
                    return {
                        type: 'Assignment',
                        id: { type: 'Identifier', name },
                        init: { type: 'Identifier', name: valueToken.value }
                    };
                }
                else{
                    //Not a number or ident
                    //x is .
                    //x is if
                    //y = until
                    return this.throwSyntaxError('Identifier', name, `Our scribes are confused by your law. On line ${valueToken.line} it appears you are missing a word to set the value of ${identToken.value} to something.`);
                }

            }
            else{
                //Not assigning a value.
                //x greater than 7.
                return this.throwSyntaxError('Identifier', name, this.getSyntaxErrorFromToken(this.peek()));
            }

        },
        throwSyntaxError(id, name, message){
            this.parser.i += 10000;
            return {
                type: 'SyntaxError',
                id: {
                    type: id,
                    name,
                    message: message
                }
                
            };
        },
        parseEvaluatable(actionTarget) {
            //If there are more than 5 unemployed
            //Until there are 3
            //when food production is > 10
            //until there are x
            let operator = null;
            let rhs = null;
            let lhs = null;

            //there are more than 5 unemployed
            let next = this.peek();
            
            if (next.type == 'THERE_ARE') {
                this.consume();
                operator = {
                    type: "OPERATOR",
                    value: "="
                };
            }
            //Either a comparator or an identity
            next = this.peek();
            //more than 5 unemployed
            if (next.type == 'OPERATOR') {
                operator = this.next();
                //5 unemployed
                let count = this.next();
                if (count.type == 'NUMBER') {
                    rhs = count;
                }
                //unemployed
                let final = this.next();
                if (final.type == 'DOT') {
                    //If unemployed wasn't mentioned, assume the count refers to the action target.
                    //for example, hire farmers if there are more than 5 
                    //Then 5 refers to farmers.
                    lhs = actionTarget;
                }
                else if (final.type == 'IDENT') {
                    lhs = final;
                }
                else {
                    condition = {
                        type: 'SyntaxError',
                        value: { 'Count': count, 'Final': final }
                    }
                }
            }
            else if (next.type == 'IDENT') {
                //food production is greater than 10
                lhs = this.next();
                let potentialModifier = this.peek();

                if (potentialModifier.type == 'CONSUMPTION' || potentialModifier.type == 'PRODUCTION') {
                    lhs.value += ' ' + potentialModifier.value;
                    this.consume();
                }
                operator = this.next();
                if(operator.type != 'OPERATOR'){
                    return this.throwSyntaxError('Evaluatable', operator, `Our scribes are confused by your law. On line ${operator.line} we expected a word to compare values instead of the word ${operator.value}`);

                }
                rhs = this.next();
                if(rhs.type != 'IDENT' && rhs.type != 'NUMBER'){
                    return this.throwSyntaxError('Evaluatable', rhs, `Our scribes are confused by your law. On line ${rhs.line} we expected a counting of something or a number, instead of the word ${rhs.value}`);

                }
                potentialModifier = this.peek();

                if (potentialModifier.type == 'CONSUMPTION' || potentialModifier.type == 'PRODUCTION') {
                    rhs.value += ' ' + potentialModifier.value;
                    this.consume();
                }

                
            }
            else if (next.type == 'NUMBER') {
                lhs = this.next();
                rhs = this.next();
            }
            else{
                //None of the valid inputs:
                //more than 5 unemployed
                //food production is greater than 10
                //greater than 7
                //
                return this.throwSyntaxError('Evaluatable', next, `Our scribes are confused by your law. On line ${next.line} we expected a word to compare values, a counting of something, or a number, instead of the word ${next.value}`);
            }
            return {
                type: 'Evaulatable',
                test: {
                    left: lhs,
                    op: operator,
                    right: rhs
                }
            }
        },
        parseUntil(actionTarget) {
            let output = { type: 'Evaulatable' };
            //If there are more than 5 unemployed
            //Until there are 3
            //when food production is > 10
            //until there are x
            let operator = null;
            let rhs = null;
            let lhs = null;
            //there are 5
            //there are 10 farmers
            //there are x
            let next = this.peek();
            if (next.type == 'THERE_ARE') {
                this.consume();
            }
            //5
            //10 farmers
            let count = this.next();
            if (count.type == 'NUMBER' || count.type == 'IDENT') {
                let final = this.next();
                if (final.type == 'DOT') {
                    lhs = actionTarget;
                }
                else if (final.type == 'IDENT') {
                    lhs = final;
                }
                operator = {
                    type: 'Operator',
                    value: '>='
                };
                rhs = count;
            }
            output.test = {
                left: lhs,
                op: operator,
                right: rhs
            };
            return output;
        },
        parseConditional(actionTarget) {

            let output = { type: 'Evaulatable' };
            let condition = this.next();

            if (condition.type == 'CONDITIONAL') {
                let next = this.peek();
                if(next.type == 'NUMBER'){
                    return this.throwSyntaxError('Conditional', next, `Our scribes are confused by your law. On line ${next.line} we expected a word to begin a check of truth, instead of the number ${next.value}.`);
                }
                else{
                    output = this.parseEvaluatable(actionTarget);
                }
                
            }
            else if (condition.type == 'UNTIL') {
                output = this.parseUntil(actionTarget);
            }
            while (this.peek().type == 'AND' || this.peek().type == 'OR') {
                output = {
                    type: "BooleanOperator",
                    value: this.next(),
                    lhs: this.parseEvaluatable(actionTarget),
                    rhs: JSON.parse(JSON.stringify(output))
                }
            }
            let optionalThen = this.peek();
            if (optionalThen.type == 'THEN') {
                this.consume();
            }

            let actionToken = this.peek();
            let action = null;

            if (actionToken.type == "ACTION") {
                action = this.parseAction();
                output.action = action;
            }
            if (actionToken.type == "PRINT") {
                action = this.parsePrint();
                output.action = action;
            }
            return output;
        },
        parsePrint() {
            let printCommand = this.next();
            let output = this.next();
            if (output != null) {
                output = output.value;
            }
            return {
                type: 'Print',
                output: output,
                line: printCommand.line
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
            else{
                //Always advance on syntax errors.
                this.parser.i++;
            }
        },
        parseDot(){
            this.parser.i++;
        },
        parse(tokens) {
            const ast = [];
            this.parser.tokens = tokens.filter(x => x.type != 'NEWLINE');
            this.parser.i = 0;
            
            while (this.parser.i < this.parser.tokens.length) {
                ast.push(this.parsePrimary())

                if(this.peek().type == 'DOT'){
                    this.parser.i++;
                }
                if(this.peek().type == 'EOF'){
                    this.parser.i++;
                }
            }
            console.log(ast);
            return ast;
        },
        evaluate(ast) {
            this.consoleOutputs = [];
            let env = {};
            for (let [good, data] of Object.entries(this.currencydata)) {
                let goodLower = good.toLowerCase();
                env[goodLower] = data.Amount;
                let preCostAmount = this.preCostTickCurrencyValues[good]?.Amount;
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
            console.log(env);
            for (const node of ast) {
                this.evalNode(node, env);
            }
            return env;
        },
        evalNode(node, env) {
            if (!node) {
                console.error('Node was null', env);
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

                case 'Evaulatable':
                    const conditionResult = this.evalNode(
                        {
                            type: 'BinaryExpression',
                            left: node.test.left,
                            right: node.test.right,
                            op: node.test.op
                        }, env);

                    console.log(node, conditionResult);
                    if (conditionResult && node.action) {
                        return this.evalNode(node.action, env);
                    }
                    return conditionResult;

                case 'Assignment':
                    console.log("Assigning...", node);
                    if (this.isReservedName(node.id.name)) {
                        console.log("Invalid assignment");
                    }
                    if (node.init.type == "Literal") {
                        env[node.id.name] = node.init.value;
                    }
                    else if (node.init.type == "Identifier") {
                        env[node.id.name] = env[node.init.name];
                    }
                    console.log(env);
                    break;

                case 'Action':
                    if (node.condition) {
                        if (!this.evalNode(node.condition, env)) {
                            return;
                        }
                    }

                    if (node.action.value == 'hire') {
                        console.log("Hiring because node", node);
                        let prof = this.sanitizeProfName(node.actionTarget.value);
                        let outputProfName = prof.Name;
                        if (node.count != 1) {
                            outputProfName = pluralize.plural(outputProfName);
                        }
                        let actual = this.hire(prof, node.count);

                        if (actual == node.count) {
                            this.consoleOutputs.push(`Hired ${node.count} ${outputProfName}.`);
                        }
                        else if (actual > 0) {
                            this.consoleOutputs.push(`Tried to hire ${node.count} ${outputProfName}, but we were only able to hire ${actual}.`);
                        }
                        else {
                            this.consoleOutputs.push(`Tried to hire ${node.count} ${outputProfName}, but we don't have the resources.`);
                        }
                    }

                    if (node.action.value == 'fire') {
                        console.log("Firing because node", node);
                        let prof = this.sanitizeProfName(node.actionTarget.value);
                        let outputProfName = prof.Name;
                        if (node.count != 1) {
                            outputProfName = pluralize.plural(outputProfName);
                        }
                        let actual = this.fire(prof, node.count);

                        if (actual == node.count) {
                            this.consoleOutputs.push(`Fired ${node.count} ${outputProfName}.`);
                        }
                        else if (actual > 0) {
                            this.consoleOutputs.push(`Tried to fire ${node.count} ${outputProfName}, but we were only able to fire ${actual}.`);
                        }
                        else {
                            this.consoleOutputs.push(`Tried to fire ${node.count} ${outputProfName}, but we don't have any.`);
                        }
                    }
                    if (node.action.value == 'build') {
                        console.log("Building because node", node);
                        let building = node.actionTarget.value;
                        let outputBuildingName = node.actionTarget.value;
                        if (node.count != 1) {
                            outputBuildingName = pluralize.plural(outputBuildingName);
                        }
                        let actual = this.buildBuilding({ Name: building }, node.count);

                        if (actual == node.count) {
                            this.consoleOutputs.push(`Built ${node.count} ${outputBuildingName}.`);
                        }
                        else if (actual > 0) {
                            this.consoleOutputs.push(`Tried to build ${node.count} ${outputBuildingName}, but we were only able to build ${actual}.`);
                        }
                        else {
                            this.consoleOutputs.push(`Tried to build ${node.count} ${outputBuildingName}, but we don't have the materials.`);
                        }
                    }
                    break;
                case 'Print':
                    let num = parseInt(node.output);

                    if(num){
                        this.consoleOutputs.push('Line ' + node.line + ': ' + num);
                    }
                    else{
                        if (env[node.output] == 1) {
                            var isword = 'is';
                            var outword = pluralize.singular(node.output);
                        }
                        else {
                            var isword = ' are '
                            var outword = pluralize.plural(node.output);

                        }
                        this.consoleOutputs.push('Line ' + node.line + ': There ' + isword + ' ' + env[node.output] + ' ' + outword);
                        console.log(env[node.output], env);
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
                        if(node.action){
                            return this.evalNode(node.action, env);
                        }
                        return true;
                    }
                    return false;
                    break;
                case 'BinaryExpression':

                    if (!node.left && !node.right) {
                        return "Left and Right operands undefined.";
                    }
                    if (!node.left) {
                        return "Left operand undefined";
                    }
                    if (!node.right) {
                        return "Right operand undefined";
                    }
                    let left = env[node.left.value];
                    let right = env[node.right.value];
                    if (!left && left !== 0) {
                        left = parseFloat(node.left.value);
                    }
                    if (!right && right !== 0) {
                        right = parseFloat(node.right.value);
                    }
                    switch (node.op.value) {
                        case '+': return left + right;
                        case '-': return left - right;
                        case '*': return left * right;
                        case '/': return left / right;
                        case '>': return left > right;
                        case 'greater than': return left > right;
                        case 'more than': return left > right;
                        case 'is more than': return left > right;
                        case 'is greater than': return left > right;
                        case 'are more than': return left > right;
                        case 'are greater than': return left > right;
                        case '>=': return left >= right;
                        case '<=': return left <= right;
                        case '<': return left < right;
                        case 'less than': return left < right;
                        case 'is less than': return left < right;
                        case 'are less than': return left < right;
                        case 'fewer than': return left < right;
                        case 'are fewer than': return left < right;
                        case 'is fewer than': return left < right;
                        case '==': return left == right;
                        case '=': return left == right;
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
                            anyFalse = true;
                            break;
                        }
                    }
                    if (anyFalse) {
                        diffs.push({ index: i, ast: ast[i], expected: expected[i], comparison: compared });
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
            console.log("Getting diffs...");
            for (let [key, value] of Object.entries(obj1)) {
                let value2 = obj2[key];
                if (JSON.stringify(value) != JSON.stringify(value2)) {
                    console.log("Different", value, value2);
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
            console.log(output);
            return output;
        },
        getSyntaxErrorFromToken(token) {
            console.log(token);
            let name = token.value;
            if (this.professionReservedNames.has(name)) {
                return `Our scribes are confused by your law. Our people cannot make ${name} by magic. On line ${token.line} we wonder if you meant to hire or fire more ${pluralize.plural(name)}?`;
            }
            else if (this.currencyReservedNames.has(name)) {
                return `Our scribes are confused by your law. On line ${token.line} we wonder if you forgot an 'if' by the word '${name}'?`;
            }
            
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
        formatNumber(n) {
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
            return scaled.toFixed(2).replace(/\.?0+$/, '') + units[tier];
        }
    }
});

window.VM = gamevm.mount('#vm');
console.log(window.VM);
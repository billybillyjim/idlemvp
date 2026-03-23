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
        }
    }
});

window.testVM = testvm.mount('#testvm');
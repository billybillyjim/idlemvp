export default[
    { 
        Name: 'Agrarian Ideas', 
        Description:"Our people are cultivators of the land. Growing crops is important to us, and we think we should be good at it.", 
        Type: "Societal", 
        isLocked:true,
        Ideas:[
            {
                Name:"Agrarianism",
                Description:"Farmers are our most valuable citizens, and society should reflect that.",
                Effect:"Decreases farmer food production and increases grain production",
                Unlock(vm){
                    vm.logit("Farmers are our most valuable citizens, and society should reflect that.");
                    vm.UnlockProductionModifier("Agrarianism");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Farmer Social Class",
                Description:"",
                Effect:"Decrease the cost of granaries and wells, increase farmer food cost.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("Farmer Social Class");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Agrarian Idea 3",
                Description:"",
                Effect:"Increases farmer Knowledge output by 0.1 per capita.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Agrarian Idea 4",
                Description:"",
                Effect:"Increases the effect of Irrigated land on food production.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Agrarian Idea 5",
                Description:"",
                Effect:"Increases farmer grain output by 15%.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Agrarian Idea 6",
                Description:"",
                Effect:"Unlocks a special Farm building that houses 5, and stores food, grain, water, and produces some of each for a high space cost.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Agrarian Idea 7",
                Description:"",
                Effect:"Unemployed people also produce grain at a reduced rate.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Agrarian Idea 8",
                Description:"",
                Effect:"Farmer clay and tool demand reduced by 50%.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            }
        ]
    },
    { 
        Name: 'Coastal Ideas', 
        Description:"Our people are children of the sea. It provides the food and goods we need, and we know how to interact with it properly.", 
        Type: "Societal", 
        isLocked:false,
        Ideas:[
            {
                Name:"Coastal Idea 1",
                Description:"",
                Effect:"Doubles fisherman food output, increases wood and rope demand.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Coastal Idea 2",
                Description:"",
                Effect:"Unlocks a coastal wharf building that improves fisherman output and stores food.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            },
            {
                Name:"Coastal Idea 3",
                Description:"",
                Effect:"Improved rope production.",
                Unlock(vm){
                    vm.logit();
                    vm.UnlockProductionModifier("");
                    this.isLocked = false;
                },
                isLocked:false,
            }
        ]
    }
]
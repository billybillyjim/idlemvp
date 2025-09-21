export default [
    {
        "Name": "Lumberjack",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Stone Tools"] },
        "BaseDemand": { 'Food': 1.5, 'Stone': 0.1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Lumberjack',
                    Count: 0,
                    Cost: { 'Food': 1.3 },
                    Produces: { 'Wood': 1.5 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.5, 'Stone': 0.1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Your food stockpiles have grown enough to support labor outside of farming.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Miller",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Saddle Quern"],"Buildings":{"Mill":1 }},
        "BaseDemand": { 'Food': 1.5, 'Grain': 0.1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Miller',
                    Count: 0,
                    Cost: { "Food": 100 },
                    Produces: { 'Food': 1.5 },
                    Unlocked: true,
                    Visible: true,
                    BaseDemand: { 'Food': 1.5 },
                    ModifiedDemand: {},
                    RequiredBuilding:'Mill',
                }
            )
            vm.logit("Your food stockpiles have grown enough to support labor outside of farming.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Fisherman",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Fishing Nets"] },
        "BaseDemand": { 'Food': 1.2, 'Rope': 0.1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Fisherman',
                    Count: 0,
                    Cost: { 'Food': 1.2 },
                    Produces: { 'Food': 2 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.2, 'Rope': 0.1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("The introduction of boats allows for alternative food sources from the sea.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Carpenter",
        "Type": "Profession",
        "Cost": { "Food": 100, "Wood": 1000 },
        "Requirements": { "Technologies": ["Basic Woodworking"] },
        "BaseDemand": { 'Food': 1.8, 'Wood': 4 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Carpenter',
                    Count: 0,
                    Cost: { 'Food': 2.75, "Wood": 1, },
                    Produces: { 'Furniture': 0.1 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.8, 'Wood': 4 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Better tooling has allowed for some to spend time making better furniture.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Tanner",
        "Type": "Profession",
        "Cost": { "Food": 1000 },
        "Requirements": { "Technologies": ["Hide Tanning"] },
        "BaseDemand": { 'Food': 1.2 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Tanner',
                    Count: 0,
                    Cost: { 'Food': 2.1 },
                    Produces: { 'Hides': 2 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.2 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("The advent of tanning allows for making furs into clothing.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Overseer",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Corvée Labor"] },
        "BaseDemand": { 'Food': 3 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Overseer',
                    Count: 0,
                    Cost: { 'Food': 2.5 },
                    Produces: { 'Coordinated Labor': 2 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 3 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("We can coordinate to accomplish even greater tasks.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Irrigation Worker",
        "Type": "Profession",
        "Cost": { "Food": 300 },
        "Requirements": { "Technologies": ["Basic Irrigation"] },
        "BaseDemand": { 'Food': 2 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Irrigation Worker',
                    Count: 0,
                    Cost: { 'Food': 3.5 },
                    Produces: { 'Fertile Soil': 2 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 2 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("You can further increase food production by irrigating your fields.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Scholar",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Writing"] },
        "BaseDemand": { 'Food': 1.7 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Scholar',
                    Count: 0,
                    Cost: { 'Food': 1.75 },
                    Produces: { 'Knowledge': 2 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.7 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Your nation now produces food, shelter, and wealth. Some of your citizens can start devoting themselves to other tasks.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Miner",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Stone Tools"] },
        "BaseDemand": { 'Food': 2, 'Stone': 0.1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Miner',
                    Count: 0,
                    Cost: { 'Food': 3.45 },
                    Produces: { 'Ore': 2, 'Clay': 1, 'Stone':3 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 2, 'Stone': 0.1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("We can dig for the shiny rocks now.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Bronze Metalurgist",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Bronze Metal"] },
        "BaseDemand": { 'Food': 1.5, 'Ore': 1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Bronze Metalurgist',
                    Count: 0,
                    Cost: { 'Food': 2.4, 'Ore': 1, },
                    Produces: { 'Bronze': 0.65 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.5, 'Ore': 1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Heat the rocks, they melt.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Bronze Metalworker",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Bronze Tools"] },
        "BaseDemand": { 'Food': 1.5, 'Bronze': 1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Bronze Metalworker',
                    Count: 0,
                    Cost: { 'Food': 2.4, 'Bronze': 0.25, },
                    Produces: { 'Bronze Tools': 0.25 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.5, 'Bronze': 1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Heat the rocks, they melt.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Iron Metalurgist",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Iron Metal"] },
        "BaseDemand": { 'Food': 1.5, 'Ore': 5 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Iron Metalurgist',
                    Count: 0,
                    Cost: { 'Food': 2.4, 'Ore': 1, },
                    Produces: { 'Iron': 0.15 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.5, 'Ore': 5 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Heat the rocks, they melt.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Surveyor",
        "Type": "Profession",
        "Cost": { "Food": 100, "Wood": 100 },
        "Requirements": { "Technologies": ["Numbers"] },
        "BaseDemand": { 'Food': 1.1, },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Surveyor',
                    Count: 0,
                    Cost: { 'Food': 2.4 },
                    Produces: { 'Space': 0.1 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.1, },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Someone can work to find more land for us to settle.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Potter",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Pottery"] },
        "BaseDemand": { 'Food': 1.1, 'Clay': 0.1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Potter',
                    Count: 0,
                    Cost: { 'Food': 2.1, 'Clay': 1 },
                    Produces: { 'Pottery': 0.5, 'Clay': 0.25 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 1.1, 'Clay': 0.1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Someone can make pots for us.");
            this.isLocked = false;
        },
        isLocked: true,
    },
    {
        "Name": "Construction Worker",
        "Type": "Profession",
        "Cost": { "Food": 100 },
        "Requirements": { "Technologies": ["Bronze Metal"] },
        "BaseDemand": { 'Food': 2, 'Wood': 1, 'Stone': 1 },
        "ModifiedDemand": {},
        Unlock(vm) {
            vm.professions.push(
                {
                    Name: 'Construction Worker',
                    Count: 0,
                    Cost: { 'Food': 2.1, 'Wood': 1, 'Furniture': 0.1 },
                    Produces: { 'Housing': 1 },
                    Unlocked: true,
                    Visible: true,
                    "BaseDemand": { 'Food': 2, 'Wood': 1, 'Stone': 1 },
                    "ModifiedDemand": {},
                }
            )
            vm.logit("Someone can make houses for us.");
            this.isLocked = false;
        },
        isLocked: true,
    }

];
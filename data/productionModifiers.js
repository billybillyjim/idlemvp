export default [
    {   
        Name:"Stone Tools", 
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.1},
        ],
        Requirements:{
            Technologies:["Stone Tools"]
        },
        IsUnlocked:false,
    },
    {   
        Name:"Animal Domestication", 
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.25,},
            {Name:"Unemployed", Currency:"Food", ModifierType:"Additive", Amount:0.05,},
        ],
        Requirements:{
            Technologies:["Animal Domestication"]
        },
        IsUnlocked:false,
    },
    {   
        Name:"Bronze Tools", 
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.15},
        ],
        Requirements:{
            Technologies:["Bronze Tools"]
        },
        IsUnlocked:false,
    },
    {   
        Name:"Well Poles", 
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.1,},
            {Name:"Well", Currency:"Water", ModifierType:"Additive", Amount:3, },
        ],
        Requirements:{
            Technologies:["Well Poles"]
        },
        IsUnlocked:false,
    },
    {   
        Name:"Crop Rotations", 
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.3,},
        ],
        Requirements:{
            Technologies:["Crop Rotations"]
        },
        IsUnlocked:false,
    },
    {   
        Name:"Rope", 
        Boosts:[
            {Name:"Farmer", Currency:"Rope", ModifierType:"Additive", Amount:0.1,},
            {Name:"Lumberjack", Currency:"Rope", ModifierType:"Additive", Amount:0.1,},
            {Name:"Unemployed", Currency:"Rope", ModifierType:"Additive", Amount:0.2,},
            {Name:"Surveyor", Currency:"Rope", ModifierType:"Additive", Amount:0.2,},
        ],
        Requirements:{
            Technologies:["Rope"]
        },
        IsUnlocked:false,
    },
    {
        Name:"Pottery",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Multiplicative", Amount:1.05,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.05,},
        ],
        Requirements:{
            Technologies:["Pottery"]
        },
        IsUnlocked:false,
    },
    {
        Name:"Pottery Wheel",
        Boosts:[
            {Name:"Potter", Currency:"Pottery", ModifierType:"Multiplicative", Amount:3,},
            {Name:"Potter", Currency:"Clay", ModifierType:"Multiplicative", Amount:2,},
        ],
        Requirements:{
            Technologies:["Pottery Wheel"]
        },
        IsUnlocked:false,
    },
    {
        Name:"Wooden Plows",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Multiplicative", Amount:1.1,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.1,},
        ],
        Requirements:{
            Technologies:["Wooden Plows"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Basic Irrigation",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Multiplicative", Amount:1.1,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.1,},
        ],
        Requirements:{
            Technologies:["Basic Irrigation"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Irrigation Systems",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Multiplicative", Amount:1.05,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.05,},
        ],
        Requirements:{
            Technologies:["Irrigation Systems"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Terracing",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Multiplicative", Amount:1.05,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.05,},
        ],
        Requirements:{
            Technologies:["Terracing"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Flax Processing",
        Boosts:[
            {Name:"Unemployed", Currency:"Rope", ModifierType:"Additive", Amount:0.3},
        ],
        Requirements:{
            Technologies:["Flax Processing"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Saddle Quern",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Additive", Amount:0.25}
        ],
        Requirements:{
            Technologies:["Saddle Quern"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Fermentation",
        Boosts:[
            {Name:"Well", Currency:"Water", ModifierType:"Additive", Amount:1}
        ],
        Requirements:{
            Technologies:["Fermentation"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Lunar Calendar",
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.05}
        ],
        Requirements:{
            Technologies:["Lunar Calendar"]
        }
        ,IsUnlocked:false
    },
        {
        Name:"Solar Calendar",
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.05}
        ],
        Requirements:{
            Technologies:["Solar Calendar"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Dirt Roads",
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.05},
            {Name:"Irrigation Worker", Currency:"Fertile Soil", ModifierType:"Additive", Amount:0.2},
        ],
        Requirements:{
            Technologies:["Dirt Roads"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Iron Tools",
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.25},
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.8},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.6},
            {Name:"Miner", Currency:"Ore", ModifierType:"Additive", Amount:0.4},
            {Name:"Carpenter", Currency:"Furniture", ModifierType:"Additive", Amount:0.3},
        ],
        Requirements:{
            Technologies:["Iron Tools"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Hide Tanning",
        Boosts:[
            {Name:"Tanner", Currency:"Hides", ModifierType:"Multiplicative", Amount:1.5},
            {Name:"Carpenter", Currency:"Furniture", ModifierType:"Additive", Amount:0.1},
        ],
        Requirements:{
            Technologies:["Hide Tanning"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Basic Stoneworking",
        Boosts:[
            {Name:"Miner", Currency:"Stone", ModifierType:"Additive", Amount:0.5},
        ],
        Requirements:{
            Technologies:["Basic Stoneworking"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Bee Keeping",
        Boosts:[
            {Name:"Unemployed", Currency:"Wax", ModifierType:"Additive", Amount:0.15},
            {Name:"Farmer", Currency:"Wax", ModifierType:"Additive", Amount:0.1},
        ],
        Requirements:{
            Technologies:["Wax"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Fish Farming",
        Boosts:[
            {Name:"Fisherman", Currency:"Food", ModifierType:"Additive", Amount:0.8},
            {Name:"Unemployed", Currency:"Food", ModifierType:"Additive", Amount:0.15},
        ],
        Requirements:{
            Technologies:["Fishing Nets"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Bread Baking",
        Boosts:[
            {Name:"Miller", Currency:"Food", ModifierType:"Multiplicative", Amount:1.8},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.3},
        ],
        Requirements:{
            Technologies:["Bread"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Wine Making",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Additive", Amount:0.2},
            {Name:"Unemployed", Currency:"Grain", ModifierType:"Additive", Amount:0.05},
        ],
        Requirements:{
            Technologies:["Fermentation"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Shipbuilding",
        Boosts:[
            {Name:"Carpenter", Currency:"Furniture", ModifierType:"Multiplicative", Amount:2},
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.3},
        ],
        Requirements:{
            Technologies:["Fishing Boats"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Glass Production",
        Boosts:[
            {Name:"Miner", Currency:"Clay", ModifierType:"Additive", Amount:0.25},
            {Name:"Potter", Currency:"Pottery", ModifierType:"Additive", Amount:0.15},
        ],
        Requirements:{
            Technologies:["Glass"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Loom",
        Boosts:[
            {Name:"Unemployed", Currency:"Rope", ModifierType:"Additive", Amount:0.4},
            {Name:"Scholar", Currency:"Knowledge", ModifierType:"Additive", Amount:0.05},
        ],
        Requirements:{
            Technologies:["Loom"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Cheese",
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.4},
            {Name:"Unemployed", Currency:"Food", ModifierType:"Additive", Amount:0.1},
        ],
        Requirements:{
            Technologies:["Cheese"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Selective Breeding",
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.4},
            {Name:"Unemployed", Currency:"Food", ModifierType:"Additive", Amount:0.1},
        ],
        Requirements:{
            Technologies:["Selective Breeding"]
        }
        ,IsUnlocked:false
    },{
        Name:"Trellises",
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.1},
        ],
        Requirements:{
            Technologies:["Trellises"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Metal Casting",
        Boosts:[
            {Name:"Bronze Metalworker", Currency:"Bronze Tools", ModifierType:"Multiplicative", Amount:1.6},
            {Name:"Iron Metalurgist", Currency:"Iron", ModifierType:"Multiplicative", Amount:1.4},
        ],
        Requirements:{
            Technologies:["Metal Casting"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Boundary Slabs",
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.1},
        ],
        Requirements:{
            Technologies:["Boundary Slabs"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Cobblestone Roads",
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.1},
        ],
        Requirements:{
            Technologies:["Cobblestone Roads"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"The Wheel",
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.1},
        ],
        Requirements:{
            Technologies:["The Wheel"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Basic Architecture",
        Boosts:[
            {Name:"Construction Worker", Currency:"Housing", ModifierType:"Additive", Amount:0.5},
            {Name:"Carpenter", Currency:"Furniture", ModifierType:"Additive", Amount:0.2},
        ],
        Requirements:{
            Technologies:["Basic Architecture"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Quarrying",
        Boosts:[
            {Name:"Miner", Currency:"Ore", ModifierType:"Additive", Amount:0.8},
            {Name:"Miner", Currency:"Stone", ModifierType:"Additive", Amount:1},
        ],
        Requirements:{
            Technologies:["Quarrying"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Aqueduct",
        Boosts:[
            {Name:"Well", Currency:"Water", ModifierType:"Multiplicative", Amount:2},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.2},
            {Name:"Irrigation Worker", Currency:"Fertile Soil", ModifierType:"Additive", Amount:0.4},
        ],
        Requirements:{
            Technologies:["Aqueduct"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Sledge Transports",
        Boosts:[
            {Name:"Global", Currency:"All", ModifierType:"Multiplicative", Amount:1.1},
        ],
        Requirements:{
            Technologies:["Sledge Transports"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Basic Government",
        Boosts:[
            {Name:"Government Worker", Currency:"Knowledge", ModifierType:"Additive", Amount:0.2},
            {Name:"Scholar", Currency:"Knowledge", ModifierType:"Additive", Amount:0.1},
        ],
        Requirements:{
            Technologies:["Basic Government"]
        }
        ,IsUnlocked:false
    }
];
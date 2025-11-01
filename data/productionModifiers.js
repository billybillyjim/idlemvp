export default [
    {   
        Name:"Stone Tooling", 
        Boosts:[
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.5,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.5,},
            {Name:"Unemployed", Currency:"Food", ModifierType:"Additive", Amount:0.1,},
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
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.5,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.3,},
            {Name:"Unemployed", Currency:"Food", ModifierType:"Additive", Amount:0.1,},
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
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.5,},
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
        Name:"Pottery Wheel",
        Boosts:[
            {Name:"Potter", Currency:"Pottery", ModifierType:"Multiplicative", Amount:3,},
        ],
        Requirements:{
            Technologies:["Pottery Wheel"]
        },
        IsUnlocked:false,
    },
    {
        Name:"Wooden Plows",
        Boosts:[
            {Name:"Farmer", Currency:"Grain", ModifierType:"Multiplicative", Amount:1.3,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Multiplicative", Amount:1.3,},
        ],
        Requirements:{
            Technologies:["Wooden Plows"]
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
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:1}
        ],
        Requirements:{
            Technologies:["Lunar Calendar"]
        }
        ,IsUnlocked:false
    },
    {
        Name:"Dirt Roads",
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.05},
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.05},
            {Name:"Miller", Currency:"Food", ModifierType:"Additive", Amount:0.1},
            {Name:"Irrigation Worker", Currency:"Fertile Soil", ModifierType:"Additive", Amount:0.2},
        ],
        Requirements:{
            Technologies:["Dirt Roads"]
        }
        ,IsUnlocked:false
    }
];
export default [
    {   
        Name:"Stone Tooling", 
        Boosts:[
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.5,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.5,},
        ],
        Requirements:{
            Technologies:["Stone Tools"]
        },
        IsUnlocked:false,
    },
    {   
        Name:"Bronze Tools", 
        Boosts:[
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.5,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.3,},
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
            {Name:"Well", Currency:"Water", ModifierType:"Additive", Amount:2, },
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
    }
];
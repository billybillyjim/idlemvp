export default [
    {   
        Name:"Stone Tooling", 
        Boosts:[
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.5,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.5,},
        ],
        Requirements:{
            Technologies:["Stone Tools"]
        }
    },
    {   
        Name:"Bronze Tools", 
        Boosts:[
            {Name:"Lumberjack", Currency:"Wood", ModifierType:"Additive", Amount:0.5,},
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.3,},
        ],
        Requirements:{
            Technologies:["Bronze Tools"]
        }
    },
    {   
        Name:"Well Poles", 
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.1,},
        ],
        Requirements:{
            Technologies:["Well Poles"]
        }
    },
    {   
        Name:"Crop Rotations", 
        Boosts:[
            {Name:"Farmer", Currency:"Food", ModifierType:"Additive", Amount:0.5,},
        ],
        Requirements:{
            Technologies:["Crop Rotations"]
        }
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
        }
    }
];
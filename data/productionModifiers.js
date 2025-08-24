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
    }
];
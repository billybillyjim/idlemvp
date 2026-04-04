export default[
    { 
        Name: 'Hut', 
        Description:"A poorly assembled hut. It should safely house about 3 people.", 
        Type: "Housing", 
        Count: 2, 
        Cost: 
        { 
            Wood: 150, 
            Space: 10 
        }, 
        Houses: 4, 
        Unlocked: true, 
        Visible: true, 
    },
    { 
        Name: 'Well', 
        Description:"An easy access for ground water.", 
        Type: "Storage", 
        Count: 1, 
        Cost: 
        { 
            Stone: 200, 
            Space: 10 
        }, 
        Produces:{
            Water:300,
        },
        Unlocked: true, 
        Visible: true, 
    },
    { 
        Name: 'Large Hut', 
        Description:"A larger hut. It should safely house about 12 people.", 
        Type: "Housing", 
        Count: 2, 
        Cost: 
        { 
            Wood: 1500, 
            Space: 35 
        }, 
        Houses: 12, 
        Unlocked: true, 
        Visible: true, 
    },
    { 
        Name: 'Workshop', 
        Description:"A building fit to enable work of a skilled laborer.", 
        Type: "Production", 
        Count: 0, 
        Cost: 
        { 
            Wood: 300, 
            Space: 15 
        }, 
        Unlocked: false, 
        Visible: false, 
    },
    { 
        Name: 'Mill', 
        Description:"A building for turning less useful food into more useful food.", 
        Type: "Production", 
        Count: 0, 
        Cost: 
        { 
            Wood: 300, 
            Space: 15 
        }, 
        Produces:{
            Food:50,
        },
        Consumes:{
            Grain:50,
        },
        
        Unlocked: false, 
        Visible: false, 
    },
    { 
        Name: 'Irrigated Field', 
        Description:"A field with great access to fresh water.", 
        Type: "Production", 
        Count: 0, 
        Cost: 
        { 
            'Fertile Soil': 300, 
            'Coordinated Labor':50,
            Space: 150
        }, 
        Unlocked: false, 
        Visible: false, 
    },
]

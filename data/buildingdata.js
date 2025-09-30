export default[
    { 
        Name: 'Hut', 
        Description:"A poorly assembled hut. It should safely house about 3 people.", 
        Type: "Housing", 
        Count: 2, 
        Cost: 
        { 
            Wood: 50, 
            Space: 10 
        }, 
        Houses: 3, 
        Unlocked: true, 
        Visible: true, 
    },
    { 
        Name: 'Granary', 
        Description:"A dry place to store a lot of grain.", 
        Type: "Storage", 
        Count: 1, 
        Cost: 
        { 
            Bricks: 300, 
            Space: 10 
        }, 
        Stores: 
        { 
            Food: 1000 
        }, 
        Unlocked: true, 
        Visible: true, 
    },
    { 
        Name: 'Lumber Storeyards', 
        Description:"A safe place to store wood.", 
        Type: "Storage", 
        Count: 1, 
        Cost: 
        { 
            Wood: 80, 
            Space: 20 
        }, 
        Stores: 
        { 
            Wood: 5000 
        }, 
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
        Stores: 
        { 
            Water: 5000 
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
        Count: 0, 
        Cost: 
        { 
            Wood: 500, 
            Space: 25 
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
        Visible: true, 
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
        Unlocked: false, 
        Visible: true, 
    },
]

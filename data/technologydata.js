export default [
    {
        Name: "Stone Tools",
        Description: "Other nations seem to have figured this out ages ago. But not to worry, we will catch up!",
        Cost: { "Food": 100 },
        Requirements: {},
        Progress: 0,
        Visible: false,
        Complexity: 5,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {}
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of stone tools. Turns out, it wasn't really that complicated. Who could have known?");
            this.isLocked = false;
        },
    },
    {
        Name: "Spears",
        Description: "Now that we have sharp stone tools, we should develop something to hurt others with it.",
        Cost: { "Food": 200 },
        Requirements: { Technologies: ["Stone Tools", "Flint Knapping", "Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 25,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {}
        },
        Unlock(vm) {
            vm.logit("We have discovered that you can tie a pointy rock to a long stick and you can poke things!");
            this.isLocked = false;
        },
    },
    {
        Name: "Firemaking",
        Description: "All the best games have firemaking.",
        Cost: { "Food": 150 },
        Requirements: {},
        Progress: 0,
        Visible: false,
        Complexity: 15,
        isLocked: true,
        QualityOfLifeBoost:0.2,
        demandModifiers: {
            Global: {},
            PerCapita: {}
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of making fire. It's really hot!");
            this.isLocked = false;
        },
    },
    {
        Name: "Thatching",
        Description: "We could put rooves on our heads, somehow.",
        Cost: { "Food": 300 },
        Requirements: { Technologies: ["Stone Tools", "Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 30,
        isLocked: true,
        QualityOfLifeBoost:0.2,
        demandModifiers: {
            Global: {},
            PerCapita: {}
        },
        Unlock(vm) {
            vm.logit("Our people no longer must sit in the rain, for we have discovered the secret of putting things above our heads to stay dry.");
            this.isLocked = false;
        },
    },
    {
        Name: "Hide Tanning",
        Description: "There's gotta be something we can do with all these animal skins.",
        Cost: { "Food": 200 },
        Requirements: { Technologies: ["Stone Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 150,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {'Hides':0.1}
        },
        Unlock(vm) {
            vm.logit("We've found something to do with all of these animal skins.");
            this.isLocked = false;
        },
    },
    {
        Name: "Well Poles",
        Description: "Lift water out of a hole, instead of throwing somebody in every time.",
        Cost: { "Food": 600 },
        Requirements: { Technologies: ["Stone Tools", "Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 100,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of well poles. Use the stick to get water better.");
            this.isLocked = false;
        },
    },
    {
        Name: "Mudbricks",
        Description: "Use straw to make better clay.",
        Cost: { "Wood": 200 },
        Requirements: { Technologies: ["Stone Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 50,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of mudbricks. Now we can make things out of mudbricks!");
            this.isLocked = false;
        },
    },
    {
        Name: "Pottery",
        Description: "This smooth dirt all around us could have some kind of use.",
        Cost: { "Food": 1000 },
        Requirements: { Technologies: ["Firemaking"] },
        Progress: 0,
        Visible: false,
        Complexity: 300,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {"Clay":0.1},
        },
        Unlock(vm) {
            vm.logit("The stuff in the ground was clay. Now we know how to make pots like we've seen others make!");
            this.isLocked = false;
        },
    },
    {
        Name: "Pottery Wheel",
        Description: "Spin the wheeeeel.",
        Cost: { "Clay": 1000 },
        Requirements: { Technologies: ["The Wheel"] },
        Progress: 0,
        Visible: false,
        Complexity: 500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {"Clay":0.1},
        },
        Unlock(vm) {
            vm.logit("It turns out that this new spinny wheel is great for making cups and bowls.");
            this.isLocked = false;
        },
    },
    {
        Name: "Wooden Plows",
        Description: "Dig the earth without using your fingers.",
        Cost: { "Wood": 1000 },
        Requirements: { Technologies: ["Stone Tools", "Rope", "Basic Woodworking"] },
        Progress: 0,
        Visible: false,
        Complexity: 800,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
            Farmer: { Wood: 0.03 }
        },
        Unlock(vm) {
            vm.logit("The wooden plow will greatly increase how much our farmers can sow and reap.");
            this.isLocked = false;
        },
    },
    {
        Name: "Bronze Metal",
        Description: "Copper is great but it's really soft. Maybe we can do better somehow.",
        Cost: { "Ore": 1000, "Copper Metal": 1000 },
        Requirements: { Technologies: ["Copper Metal"] },
        Progress: 0,
        Visible: false,
        Complexity: 1000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
            Farmer: {}
        },
        Unlock(vm) {
            vm.logit("The secret was tin! With both metals combined, we can make something even stronger and shinier.");
            this.isLocked = false;
        },
    },
    {
        Name: "Bronze Tools",
        Description: "What if we used the bronze we make for farming tools?",
        Cost: { "Bronze Metal": 1000 },
        Requirements: { Technologies: ["Bronze Metal", "Metal Casting"] },
        Progress: 0,
        Visible: false,
        Complexity: 5000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: { 'Bronze Metal': 0.001 },
            Farmer: { 'Bronze Tools': 0.01 }
        },
        Unlock(vm) {
            vm.logit("Our farmers can harvest more easily with bronze sickles. Our people are beginning to want bronze for all sorts of things now.");
            this.isLocked = false;
        },
    },
    {
        Name: "Crop Rotations",
        Description: "Maybe we should grow our crops in different spots every year.",
        Cost: { "Food": 5000 },
        Progress: 0,
        Visible: false,
        Requirements: { Technologies: ["Solar Calendar", "Selective Breeding"] },
        Complexity: 3000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
            Farmer: { 'Fertile Soil': 0.01 }
        },
        Unlock(vm) {
            vm.logit("Our experiments have shown that rotating where we plant will increase yields!");
            this.isLocked = false;
        },
    },
    {
        Name: "Copper Metal",
        Description: "Our people have noticed something shiny in these rocks.",
        Cost: { "Ore": 1000 },
        Requirements: { Technologies: ["Flint Knapping", "Firemaking", "Kiln", "Mudbricks"] },
        Progress: 0,
        Visible: false,
        Complexity: 800,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: { Ore: 0.05 }
        },
        Unlock(vm) {
            vm.logit("We can heat the rocks and get a shiny metal out of some of them.");
            this.isLocked = false;
        },
    },
    {
        Name: "Flint Knapping",
        Description: "We can refine tools with sharper edges.",
        Cost: { "Food": 600 },
        Requirements: { Technologies: ["Stone Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {"Stone":0.1},
        },
        Unlock(vm) {
            vm.logit("These sharper stone tools will come in handy for all sorts of things.");
            this.isLocked = false;
        },
    },
    {
        Name: "Rope",
        Description: "Some of these plants could be used to tie things together.",
        Cost: { "Food": 100 },
        Requirements: { Technologies: ["Stone Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 80,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {Rope:0.1},
        },
        Unlock(vm) {
            vm.logit("We have developed an easy way to attach things together!");
            this.isLocked = false;
        },
    },
    {
        Name: "Flax Processing",
        Description: "Some particular plants seem extra good for making fibers.",
        Cost: { "Food": 900 },
        Requirements: { Technologies: ["Stone Tools", "Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 300,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: { Flax: 0.01 }
        },
        Unlock(vm) {
            vm.logit("This flax plant has proven to be very useful.");
            this.isLocked = false;
        },
    },
    {
        Name: "Spinning Wheel",
        Description: "Spin the wheeeeel.",
        Cost: { "Flax": 1000 },
        Requirements: { Technologies: ["Flax Processing", "The Wheel"] },
        Progress: 0,
        Visible: false,
        Complexity: 900,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We can spin the flax into fibers.");
            this.isLocked = false;
        },
    },
    {
        Name: "Loom",
        Description: "Maybe we can combine strands of fiber into a sheet.",
        Cost: { "Fibers": 700 },
        Requirements: { Technologies: ["Spinning Wheel"] },
        Progress: 0,
        Visible: false,
        Complexity: 2700,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have figured out a method to weave flax fibers into linen.");
            this.isLocked = false;
        },
    },
    {
        Name: "Simple Clothing",
        Description: "This linen could be used to make clothes out of something other than animal skins.",
        Cost: { "Linen": 1200 },
        Requirements: { Technologies: ["Loom"] },
        Progress: 0,
        Visible: false,
        Complexity: 8100,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have figured out a method to make linen clothing. It's an exciting time for the world of fashion.");
            this.isLocked = false;
        },
    },
    {
        Name: "Measuring Sticks",
        Description: "We can figure out how long something is by using a stick.",
        Cost: { "Food": 600, "Wood": 200 },
        Requirements: { Technologies: ["Stone Tools", "Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 300,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have figured out a way to know how long things are with sticks!");
            this.isLocked = false;
        },
    },
    {
        Name: "Saddle Quern",
        Description: "Grind grain into a tasty dust.",
        Cost: { "Stone": 1000, "Food": 1000 },
        Requirements: { Technologies: ["Stone Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We've unlocked the secrets of the saddle quern. You have to try this plant dust, it's delicious.");
            this.isLocked = false;
        },
    },
    {
        Name: "Fermentation",
        Description: "What if we didn't drink that, we just let it sit there?",
        Cost: { "Food": 900 },
        Requirements: { Technologies: ["Pottery Wheel"] },
        Progress: 0,
        Visible: false,
        Complexity: 100,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: { Pottery: 0.1 },
        },
        Unlock(vm) {
            vm.logit("Letting stuff just sit there makes for all kinds of interesting foods and drinks. Now our people want more storage containers for their food.");
            this.isLocked = false;
        },
    },
    {
        Name: "Taxation",
        Description: "It's not like we can keep doing all this for free.",
        Requirements: { Technologies: ["Solar Calendar", "Numbers"] },
        Cost: { "Food": 10000 },
        Progress: 0,
        Visible: false,
        Complexity: 1500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of taking our people's stuff and getting away with it.");
            this.isLocked = false;
        },
    },
    {
        Name: "Corvée Labor",
        Description: "We could enable greater public work projects if we can find a way to get people to work for free.",
        Cost: { "Food": 50000 },
        Requirements: { Technologies: ["Taxation"] },
        Progress: 0,
        Visible: false,
        Complexity: 1200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("It turns out it isn't too hard to come up with excuses for free labor now that we have taxes.");
            this.isLocked = false;
        },
    },
    {
        Name: "The Wheel",
        Description: "Spin the wheeeeel.",
        Requirements: { Technologies: ["Measuring Sticks"] },
        Cost: { "Wood": 2000, "Food": 1000 },
        Progress: 0,
        Visible: false,
        Complexity: 314,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of round things that can spin.");
            this.isLocked = false;
        },
    },
    {
        Name: "Lunar Calendar",
        Description: "Have you ever noticed the moon? There's some kind of pattern going on there.",
        Cost: { "Wood": 5000 },
        Requirements: { Technologies: ["Numbers"] },
        Progress: 0,
        Visible: false,
        Complexity: 2800,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("There is a pattern to the phases of the moon!");
            this.isLocked = false;
        },
    },
    {
        Name: "Solar Calendar",
        Description: "The moon is great, but it seems that over time our seasons drift apart from our calendar. Maybe we can use the sun and stars for something more accurate.",
        Cost: { "Food": 10000, "Wood": 10000 },
        Requirements: { Technologies: ["Lunar Calendar", "Star Chart"] },
        Progress: 0,
        Visible: false,
        Complexity: 36524,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have found that our seasons loop every 365 days! We can use this to make a more accurate calendar.");
            this.isLocked = false;
        },
    },
    {
        Name: "Charcoal",
        Description: "Burn the wood, but do it badly on purpose.",
        Cost: { "Wood": 800 },
        Requirements: { Technologies: ["Firemaking"] },
        Progress: 0,
        Visible: false,
        Complexity: 300,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("It turns out that unburnt wood burns less good than partly burnt wood.");
            this.isLocked = false;
        },
    },
    {
        Name: "Dirt Roads",
        Description: "It's much easier to get around without all that stuff in the way.",
        Cost: { "Food": 1000, "Wood": 1000, "Ore": 1000 },
        Requirements: { Technologies: ["Measuring Sticks", "Rope", "Stone Tools", "Corvée Labor"] },
        Progress: 0,
        Visible: false,
        Complexity: 500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of making dirt roads! It was actually not that complicated...");
            this.isLocked = false;
        },
    },
    {
        Name: "Palisades",
        Description: "Spooky, scary, pointy sticks.",
        Cost: { "Wood": 3000 },
        Requirements: { Technologies: ["Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 2500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have discovered that these pointy stick walls are very good at keeping things out.");
            this.isLocked = false;
        },
    },
    {
        Name: "Clay Bullae",
        Description: "A token to represent a thing or things.",
        Cost: { "Clay": 2000 },
        Requirements: {},
        Progress: 0,
        Visible: false,
        Complexity: 3000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: { Clay: 0.01 },
        },
        Unlock(vm) {
            vm.logit("We have developed a new method of record keeping with little balls of clay.");
            this.isLocked = false;
        },
    },
    {
        Name: "Writing",
        Description: "So that's what all those squiggles mean!",
        Cost: { "Food": 5000 },
        Requirements: { Technologies: ["Measuring Sticks", "Clay Bullae"] },
        Progress: 0,
        Visible: false,
        Complexity: 9000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("It turns out other nations have been writing things down for ages. Who knew?");
            this.isLocked = false;
        },
    },
    {
        Name: "Animal Domestication",
        Description: "Watch this cow do cool tricks.",
        Cost: { "Food": 1500 },
        Requirements: { Technologies: [] },
        Progress: 0,
        Visible: false,
        Complexity: 700,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of domesticating animals, and now our cows can do cool tricks.");
            this.isLocked = false;
        },
    },
    {
        Name: "Selective Breeding",
        Description: "Better cows make better cows.",
        Cost: { "Food": 1600 },
        Requirements: { Technologies: ["Animal Domestication"] },
        Progress: 0,
        Visible: false,
        Complexity: 1100,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("It turns out better cows beget better cows. See where this is going?");
            this.isLocked = false;
        },
    },
    {
        Name: "Numbers",
        Description: "There is a theory that we could write down a symbol for the amount of bullae we would use, instead of using them. We will have to research further.",
        Cost: { "Food": 3000, "Wood": 2000 },
        Requirements: { Technologies: ["Measuring Sticks", "Writing"] },
        Progress: 0,
        Visible: false,
        Complexity: 1234,
        isLocked: false,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Yeah it turns out that numbers are actually really common in other countries too, but we can use them now as well.");
            this.isLocked = false;
        },
    },
    {
        Name: "Cheese",
        Description: "Okay, hear me out. We take the cow's milk, and put it back in their stomach, and then we eat it.",
        Cost: { "Food": 15000 },
        Requirements: { Technologies: ["Animal Domestication", "Fermentation"] },
        Progress: 0,
        Visible: false,
        Complexity: 14000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have no idea why this works but this cheese stuff is delicious.");
            this.isLocked = false;
        },
    },
    {
        Name: "Sundial",
        Description: "If we build a small tower, we can track the shadow to know the time of day, maybe.",
        Cost: { "Food": 1500, "Ore": 500 },
        Requirements: { Technologies: ["Numbers", "Measuring Sticks", "Plumb Line"] },
        Progress: 0,
        Visible: false,
        Complexity: 12000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We tried one out and it seems that sundials work!.");
            this.isLocked = false;
        },
    },
    {
        Name: "Plumb Line",
        Description: "Making things straight and tall might be easy if you attach a weight to a rope.",
        Cost: { "Ore": 300 },
        Requirements: { Technologies: ["Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 1500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("It turns out that making things straight and tall is easy if you attach a weight to a rope.");
            this.isLocked = false;
        },
    },
    {
        Name: "Star Chart",
        Description: "It looks like some of the stars in the sky move in a pattern based on the moon.",
        Cost: { "Food": 12000 },
        Requirements: { Technologies: ["Sundial", "Lunar Calendar", "Numbers"] },
        Progress: 0,
        Visible: false,
        Complexity: 2500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We've found a pattern for the stars and we can track them. This could be useful for future research!");
            this.isLocked = false;
        },
    },
    {
        Name: "Bread",
        Description: "What if we fermented this delicious wheat dust?",
        Cost: { "Food": 10000 },
        Requirements: { Technologies: ["Fermentation", "Firemaking", "Saddle Quern"] },
        Progress: 0,
        Visible: false,
        Complexity: 7000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Okay, this is unbelievably good. We've discovered real bread and it's awesome.");
            this.isLocked = false;
        },
    },
    {
        Name: "The Cheese Sandwich",
        Description: "There may be no further possible advancement of technology than this.",
        Cost: { "Food": 100000 },
        Requirements: { Technologies: ["Bread", "Cheese", "Stone Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 100000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have uncovered the secrets of the cheese sandwich. Our people rejoice!");
            this.isLocked = false;
        },
    },
    {
        Name: "Kiln",
        Description: "Maybe we could make things hot by burning them inside a little house made of clay.",
        Cost: { "Clay": 1800 },
        Requirements: { Technologies: ["Charcoal", "Pottery Wheel"] },
        Progress: 0,
        Visible: false,
        Complexity: 2200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Our clay houses work really well, we can probably do many things with these kilns.");
            this.isLocked = false;
        },
    },
    {
        Name: "Wax",
        Description: "Get the wax from bees, probably.",
        Cost: { "Food": 800 },
        Requirements: {},
        Progress: 0,
        Visible: false,
        Complexity: 200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have found a way to acquire wax. Now we just need to come up with a use for it.");
            this.isLocked = false;
        },
    },
    {
        Name: "Metal Casting",
        Description: "If we heat copper in a kiln, maybe we can pour it into a wax shape to make a shape.",
        Cost: { "Ore": 2000 },
        Requirements: { Technologies: ["Copper Metal", "Wax"] },
        Progress: 0,
        Visible: false,
        Complexity: 2300,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("If we heat copper in a kiln, we can pour it into a wax shape to make a shape.");
            this.isLocked = false;
        },
    },
    {
        Name: "Fishing Nets",
        Description: "We need to come up with a way to capture fish, they are too slippery in our fingers.",
        Cost: { "Food": 2000 },
        Requirements: { Technologies: ["Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 800,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Tying a bunch of knots together allows us to make nets for fishing!");
            this.isLocked = false;
        },
    },
    {
        Name: "Basic Woodworking",
        Description: "We can manipulate wood into better shapes.",
        Cost: { "Wood": 5000 },
        Requirements: { Technologies: ["Bronze Tools"] },
        Progress: 0,
        Visible: false,
        Complexity: 1500,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("There are all sorts of things we have figured out by manipulating wood!");
            this.isLocked = false;
        },
    },
    {
        Name: "Basic Architecture",
        Description: "We should try to figure out the rules for what we can build and how big we can build it.",
        Cost: { "Food": 14000, "Wood": 3000 },
        Requirements: { Technologies: ["Mudbricks", "Measuring Sticks", "Rope", "Basic Woodworking", "Thatching", "Plumb Line"] },
        Progress: 0,
        Visible: false,
        Complexity: 10000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("A lot of trial and error has revealed some important guidelines for building things!");
            this.isLocked = false;
        },
    },
    {
        Name: "Sailboats",
        Description: "Maybe there is a way to get closer to all those fish...",
        Cost: { "Wood": 11000 },
        Requirements: { Technologies: ["Basic Woodworking", "Fishing Nets", "Wax"] },
        Progress: 0,
        Visible: false,
        Complexity: 5000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("A lot of trial and error has revealed some important guidelines for building things!");
            this.isLocked = false;
        },
    },
    {
        Name: "Glass",
        Description: "We sometimes find interesting colors materials in our kilns after firing. There may be something here...",
        Cost: { "Bronze ": 1000, "Clay": 1000 },
        Requirements: { Technologies: ["Kiln", "Bronze Metal"] },
        Progress: 0,
        Visible: false,
        Complexity: 3000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("A lot of trial and error has revealed some important guidelines for building things!");
            this.isLocked = false;
        },
    },
    {
        Name: "Basic Irrigation",
        Description: "If we dig in the right places, we might be able to water crops more easily.",
        Cost: { "Food": 25000, "Wood": 20000, "Bronze": 500 },
        Requirements: { Technologies: ["Bronze Tools", "Wooden Plows", "Crop Rotation"] },
        Progress: 0,
        Visible: false,
        Complexity: 16000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("We have figured out how to irrigate!");
            this.isLocked = false;
        },
    },
    {
        Name: "The Lever",
        Description: "You can use a long stick to move something more easily.",
        Cost: { "Wood": 50000, "Food": 30000, "Bronze": 1200 },
        Requirements: { Technologies: [ "Basic Woodworking", "Saddle Quern",  "Simple Machines"] },
        Progress: 0,
        Visible: false,
        Complexity: 25000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Thelever has been discovered.");
            this.isLocked = false;
        },
    },
    {
        Name: "Bellows",
        Description: "It seems like we can add certain materials to metals to make smelting them easier.",
        Cost: { "Food": 800 },
        Requirements: { Technologies: ["Animal Domestication"] },
        Progress: 0,
        Visible: false,
        Complexity: 2200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("The bellows has been invented.");
            this.isLocked = false;
        },
    },
    {
        Name: "Flux",
        Description: "It seems like we can add certain materials to metals to make smelting them easier.",
        Cost: { "Ore": 12000 },
        Requirements: { Technologies: ["Bronze Metal"] },
        Progress: 0,
        Visible: false,
        Complexity: 4000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Flux has been invented.");
            this.isLocked = false;
        },
    },
    {
        Name: "Blast Furnace",
        Description: "We can make smooth-sided wooden reinforcers if we can just figure something out.",
        Cost: { "Bronze": 12000, "Clay": 5000 },
        Requirements: { Technologies: ["Kiln", "Charcoal", "Bellows"] },
        Progress: 0,
        Visible: false,
        Complexity: 32000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("The blast furnace has been invented.");
            this.isLocked = false;
        },
    },
    {
        Name: "Iron Metal",
        Description: "We can make smooth-sided wooden reinforcers if we can just figure something out.",
        Cost: { "Ore": 100000, "Bronze": 50000 },
        Requirements: { Technologies: ["Blast Furnace", "Flux"] },
        Progress: 0,
        Visible: false,
        Complexity: 45000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("Iron metal forging has been invented.");
            this.isLocked = false;
        },
    },
    {
        Name: "Dowel",
        Description: "We can make smooth-sided wooden reinforcers if we can just figure something out.",
        Cost: { "Wood": 100000 },
        Requirements: { Technologies: ["Iron Metal", "Basic Woodworking"] },
        Progress: 0,
        Visible: false,
        Complexity: 1200,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("The dowel plate has been invented.");
            this.isLocked = false;
        },
    },
    {
        Name: "The Screw",
        Description: "We can modify dowels to hold things even better.",
        Cost: { "Wood": 100000 },
        Requirements: { Technologies: ["Dowel", "Simple Machines"] },
        Progress: 0,
        Visible: false,
        Complexity: 18000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("The screw has been discovered.");
            this.isLocked = false;
        },
    },
    {
        Name: "The Pulley",
        Description: "We may be able to use ropes and wheels to pull things.",
        Cost: { "Wood": 100000 },
        Requirements: { Technologies: ["Wheel", "Simple Machines", "Rope"] },
        Progress: 0,
        Visible: false,
        Complexity: 16000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("It turns out we can totally use ropes and wheels to pulls things.");
            this.isLocked = false;
        },
    },
    {
        Name: "Simple Machines",
        Description: "If we used water to spin a wheel, we could grind grain more easily.",
        Cost: { "Food": 100000 },
        Requirements: { Technologies: ["Basic Woodworking"] },
        Progress: 0,
        Visible: false,
        Complexity: 14000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("The idea of simple machines has been discovered.");
            this.isLocked = false;
        },
    },
    {
        Name: "Water Wheel",
        Description: "If we used water to spin a wheel, we could grind grain more easily.",
        Cost: { "Wood": 10000, "Iron": 10000 },
        Requirements: { Technologies: ["Wheel", "Basic Woodworking", "Saddle Quern", "Basic Irrigation", "The Pulley", "The Lever", "The Screw"] },
        Progress: 0,
        Visible: false,
        Complexity: 100000,
        isLocked: true,
        demandModifiers: {
            Global: {},
            PerCapita: {},
        },
        Unlock(vm) {
            vm.logit("The water wheel has been discovered.");
            this.isLocked = false;
        },
    },
];
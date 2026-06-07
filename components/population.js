import tooltipwrapper from './tooltipwrapper.js'

export default {
    components: {
        tooltipwrapper
    },
    props: {

        fulldisplaymode: true,
        data: Object
    },
    data: function () {
        return {
            amount: 1,
            customSelected: false,
            currentAction:'Hire',
            isRelocating:false,
            relocationTarget:null,
        }
    },
    methods: {
        getAvailableActions(){
            let actions = ['Hire'];

            if(this.$parent.tutorialStage > 1){
                actions.push('Fire');
            }
            if(this.$parent.hasTechnology('Stone Tools')){
                actions.push('Relocate');
            }
            if(this.$parent.hasTechnology('Child Labor')){
                actions.push('Assign Child');
                actions.push('Unassign Child');
            }

            return actions;
        },
        isAssignedChild(index, profession) {
            let childCount = profession.Count;
            let assignedCount = Math.min(profession.Assigned, childCount);

            return index >= childCount - assignedCount;
        },
        setAction(action){
            this.currentAction = action;
        },
        canDoAction(profession){
            if(this.currentAction == 'Hire'){
                return this.$parent.canHire(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Fire'){
                return this.$parent.canFire(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Relocate'){
                if(this.$parent.relocationInfo.IsRelocating){
                    return this.$parent.relocateInfo(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
                }
                else{
                    return this.$parent.canRelocate(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
                }
            }
            else if(this.currentAction == 'Assign Child'){
                return this.$parent.canAssign(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Unassign Child'){
                return this.$parent.canUnassign(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
        },
        getActionTooltip(profession){
            if(this.currentAction == 'Hire'){
                if(this.$parent.getAvailableWorkers() == 0){
                    return "All our workers are currently busy doing other tasks. Any additional workers you attempt to hire will be added to the hiring queue. You will need to Fire or Relocate some to put any to work as " + this.$parent.toProperPluralize(profession?.Name) + '.';
                }
                return this.$parent.hireInfo(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Fire'){
                if(profession.Amount == 0){
                    return "Nobody is doing this job, so there isn't anyone to fire.";
                }
                return this.$parent.fireInfo(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Relocate'){
                if(this.$parent.relocationInfo.IsRelocating){
                    return this.$parent.relocateInfo(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
                }
                else{
                    return 'Move existing workers from this task to another task without modifying the queue.';
                }
            }
            else if(this.currentAction == 'Assign Child'){
                return this.$parent.assignInfo(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Unassign Child'){
                return this.$parent.unassignInfo(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
        },
        doAction(profession){
            if(!profession){
                return;
            }
            if(this.currentAction == 'Hire'){
                this.$parent.tryHire(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Fire'){
                this.$parent.tryFire(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Relocate'){
                if(this.$parent.relocationInfo.IsRelocating){
                    if(this.$parent.relocationInfo.Profession.Name == profession?.Name){
                        this.$parent.clearRelocation();
                    }
                    else{
                        this.$parent.tryRelocate(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
                    }
                    
                }
                else{
                    this.$parent.setRelocationPrimary(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
                    
                }
            }
            else if(this.currentAction == 'Assign Child'){
                this.$parent.tryAssign(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
            else if(this.currentAction == 'Unassign Child'){
                this.$parent.tryUnassign(profession, this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers());
            }
        },
        setActionFromDropdown(event){
            this.setAction(event.target.value);
        },
        getActionText(profession){
            let total = this.$parent.populationMenu.amount * this.$parent.getKeyboardModifiers();
            let formattedTotal = this.$parent.formatNumber(total, true);
            if(this.currentAction == 'Hire'){
                return 'Hire ' + formattedTotal;
            }
            else if(this.currentAction == 'Fire'){
                return 'Fire ' + formattedTotal;
            }
            else if(this.currentAction == 'Relocate'){
                if(this.$parent.relocationInfo.IsRelocating){
                    if(!this.$parent.relocationInfo.Profession){
                        return 'Relocate';
                    }
                    if(this.$parent.relocationInfo.Profession.Name == profession.Name){
                        return 'End Relocating';
                    }
                    return 'Relocate ' + formattedTotal + ' ' + this.$parent.toProperPluralize(this.$parent.relocationInfo.Profession?.Name, total);
                    
                }
                else{
                    return 'Relocate';
                }
            }
            else if(this.currentAction == 'Assign Child'){
                return 'Assign ' + formattedTotal + ' ' + this.$parent.toProperPluralize('Child', total);
            }
            else if(this.currentAction == 'Unassign Child'){
                return 'Unassign ' + formattedTotal + ' ' + this.$parent.toProperPluralize('Child', total);
            }
        }

    },
    delimiters: ['[[', ']]'],
    template: /*html*/`
    <div class="grid-item col">
    <div>
        <h4 class="my-2" v-if="!fulldisplaymode">Population</h4>
        <div>There are [[$parent.formatNumber($parent.getPopulation(), true)]] people in your nation.</div>
        <div>The average quality of life is [[$parent.formatNumber($parent.QOL)]].</div>
        <div v-if="$parent.tutorialStage < 1" style="color:orange; font-weight:bold;" @click="$parent.incrementTutorialSkip()">
            <tooltipwrapper :vm="$parent" :text="'This is friendly information from one of your old coworkers. If you think this is unnecessary, click this text 5 times he will go away and stop bothering you.'">
                This is a list of all the people in our new nation. Children can't work yet, but they can help out the adults.
                The Unemployed can basically feed themselves, but don't produce much for others. Right now you are in charge of it all, you decide what jobs people will do.
                Everyone would appreciate if you would hire another farmer before our people all starve.
            </tooltipwrapper>
        </div>
        <div v-else-if="$parent.tutorialStage == 2" style="color:orange; font-weight:bold;" @click="$parent.incrementTutorialSkip()">
            <tooltipwrapper :vm="$parent" :text="'This is friendly information from one of your old coworkers. If you think this is unnecessary, click this text 5 times he will go away and stop bothering you.'">
                Stone tools let us gather wood a lot more effectively. Someone could probably do it as a full-time job. But be careful, lumberjacking takes a lot of energy, so it uses more food.
            </tooltipwrapper>
        </div>
        <div style="color:red;" v-for="issue in $parent.getNationGrowthIssues()">[[$parent.issue]]</div>
        <div class="btn-group" role="group" aria-label="Amount selector">
            <template v-if="$parent.tutorialStage < 1">
                <button v-for="n in [1, 5, 10]" :key="n" type="button" class="btn btn-outline-primary" :class="{ active: $parent.populationMenu.amount === n }" @click="$parent.populationMenu.amount = n">
                    <tooltipwrapper :vm="$parent" :text="$parent.getPopulationTooltipForTutorial()">   
                    [[$parent.formatNumber(n, true)]]
                    </tooltipwrapper>
                </button>
            </template>
            <template v-else>
                <button v-for="n in [1, 5, 10]" :key="n" type="button" class="btn btn-outline-primary" :class="{ active: $parent.populationMenu.amount === n }" @click="$parent.populationMenu.amount = n">
                    [[$parent.formatNumber(n, true)]]
                </button>
                <button type="button" class="btn btn-outline-primary" v-if="$parent.hasNumbers()" :class="{ active: $parent.populationMenu.customSelected }" @click="$parent.populationMenu.customSelected = true">
                    X
                </button>
                <input v-if="$parent.populationMenu.customSelected" type="number" class="form-control" style="max-width: 6rem;" v-model.number="$parent.populationMenu.amount" @click.stop placeholder="Enter" min="1" />
               
            </template>
        </div>
        <div class="btn-group my-2 float-end hide-on-800" v-if="$parent.tutorialStage > 1">
            <template  v-for="action in getAvailableActions()">
                <button class="btn btn-outline-primary" :class="action == currentAction ? 'active' : ''" @click="setAction(action)">[[action]]</button>
            </template>
        </div>
        <div class="btn-group my-2 float-end show-on-800" v-if="$parent.tutorialStage > 1">
            <select class="form-select" @change="setActionFromDropdown($event)">
                <template  v-for="action in getAvailableActions()">
                    <option class="" :class="action == currentAction ? 'active' : ''" @click="setAction(action)">[[action]]</option>
                </template>
            </select>
            
        </div>
        <div v-if="$parent.testMode">
            <div>
                Monthly:
                <span v-for="bucket in $parent.monthlyAgeBuckets">
                    [[bucket]],
                </span>
            </div>
            <div>
                Yearly:
                <br />
                <span v-for="bucket, index in $parent.yearlyAgeBuckets.slice(0, 28)">
                    <span v-if="index == 15" style="color:red">
                        [[bucket]],
                    </span>
                    <span v-else>
                        [[bucket]],
                    </span>

                </span>
            </div>
            
        </div>
        <div class="m-2">
            <div v-if="$parent.getNationGrowthIssues()?.length > 0" class="alert-warning" style="font-weight:bold;">
                <tooltipwrapper :vm="$parent" :text="$parent.getNationGrowthIssues().join('<br/>')" ishtml="true">
                    Our people are stagnating.
                </tooltipwrapper>
            </div>
            <div v-else>
                Our people can grow.
            </div>
            <div v-if="$parent.testMode">
                [[$parent.professions.find(x => x.Name == 'Child').Assigned]].
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped align-middle" style="min-width: 100%;">
                <thead class="small">
                    <tr>
                        <th style="width: 15%;">Profession</th>
                        <th style="width: 15%;">Count</th>
                        <th style="width: 15%;" v-if="fulldisplaymode">Produces</th>
                        <th style="width: 15%;" v-if="fulldisplaymode">Current</th>
                        <th style="width: 15%;" v-if="fulldisplaymode">Cost</th>
                        <th style="width: 15%;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="profession in $parent.getVisibleProfessions()">
                        <tr :style="profession == 'Unlocked' ? '' : 'locked-item'">
                            <td :style="$parent.hasNumbers() ? '' : 'height: 96px;'">
                                <tooltipwrapper :vm="$parent" :calcfrom="() => profession.GetDescription(this.$parent)">
                                    [[profession.Name]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <template v-if="$parent.hasNumbers()">
                                   
                                        [[$parent.formatNumber(profession.Count, true)]]
                                         <tooltipwrapper :vm="$parent"
                                        :text="'How many jobs are available and unfilled for this profession. This can happen either by hiring more people than you have unemployed or by people dying and not being replaced yet.'">
                                        <span v-if="$parent.missingProfessionCounts[profession.Name]">+
                                            ([[ ($parent.formatNumber($parent.missingProfessionCounts[profession.Name], true)) ]])</span>
                                        </tooltipwrapper>
                                         <tooltipwrapper :vm="$parent"
                                            :text="'The total number of child labor helpers assigned for this profession. Each child helper gives a ' + $parent.getChildLaborProductionBoost() + 'x boost to production, giving a total of ' + ($parent.getChildLaborProductionBoost() * profession.ChildHelperCount) + 'x boost for this profession.'">
                                            <span v-if="profession.ChildHelperCount > 0" class="ms-2">+
                                                ([[ ($parent.formatNumber(profession.ChildHelperCount, true)) ]])</span>
                                        </tooltipwrapper>

                                        <tooltipwrapper :vm="$parent"
                                            :text="'The total number of child labor helpers assigned to any profession. Each child helper gives a ' + $parent.getChildLaborProductionBoost() + 'x boost to production.'">
                                            <span v-if="profession.Assigned > 0" class="ms-2">-
                                                 ([[ ($parent.formatNumber(profession.Assigned, true)) ]])</span>
                                        </tooltipwrapper>
                                </template>
                                <template v-else>
                                    
                                        <div>
                                            <template v-if="profession.Name == 'Child'">
                                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.formatNumber(profession.Count, true)">
                                                <div style="position:relative; white-space: nowrap;top:-20px;">
                                                    <div v-for="n, index in profession.Count" style="position:absolute;" :style="'left:' + (((index + 1) * (100 / (profession.Count + 1))) - 16) + 'px'">
                                                        <img src="icons/littleguy.png" width="32" height="32" :style="{ opacity: isAssignedChild(index, profession) ? 0.5 : 1 }">
                                                    </div>
                                                </div>
                                                </tooltipwrapper>
                                            </template>
                                            <template v-else-if="profession.Name == 'Infant'">
                                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.formatNumber(profession.Count, true)">
                                                <div style="position:relative; white-space: nowrap;top:-20px;">
                                                    <div v-for="n, index in profession.Count" style="position:absolute;" :style="'left:' + (((index + 1) * (100 / (profession.Count + 1))) - 16) + 'px'">
                                                        <img src="icons/littlestguy.png" width="32" height="32">
                                                    </div>
                                                </div>
                                                </tooltipwrapper>
                                            </template>
                                            <template v-else>
                                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.formatNumber(profession.Count, true)">
                                                <div style="position:relative; white-space: nowrap;top:-20px;">
                                                    <div v-for="n, index in profession.Count" style="position:absolute;" :style="'left:' + (((index + 1) * (100 / (profession.Count + 1))) - 16) + 'px'">
                                                        <img src="icons/guy.png" width="32" height="32">
                                                    </div>
                                                </div>
                                                </tooltipwrapper>
                                            </template>
                                            <tooltipwrapper :vm="$parent" :calcfrom="() => 'We are missing ' + $parent.formatNumber($parent.missingProfessionCounts[profession.Name], true) + '.'">
                                            <div style="position:relative; white-space: nowrap;top:15px;left:-10px;" v-if="$parent.missingProfessionCounts[profession.Name]">
                                                +
                                                <div v-for="n, index in $parent.missingProfessionCounts[profession.Name]" style="position:absolute;top:-8px;opacity:0.5;"
                                                    :style="'left:' + (((index + 1) * (100 / (1 + $parent.missingProfessionCounts[profession.Name]))) - 6) + 'px'">
                                                    <img src="icons/guy.png" width="32" height="32">
                                                </div>
                                            </div>
                                            </tooltipwrapper>
                                            <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.formatNumber(profession.Count, true) + ' children assist with this work.'">
                                            <div style="position:relative; white-space: nowrap;top:20px;left:-10px;" v-if="profession.ChildHelperCount > 0">
                                                +
                                                <div v-for="n, index in profession.ChildHelperCount" style="position:absolute;top:-8px;"
                                                    :style="'left:' + (((index + 1) * (100 / (1 + profession.ChildHelperCount))) - 6) + 'px'">
                                                    <img src="icons/littleguy.png" width="32" height="32">
                                                </div>
                                            </div>
                                            </tooltipwrapper>
                                        </div>
                                    

                                </template>
                            </td>
                            <td v-if="fulldisplaymode">
                                <span v-for="(value, key, index) in $parent.productionToNiceString(profession)" :key="key">
                                    <tooltipwrapper :vm="$parent" :text="$parent.currencydata[key]?.Description">
                                        <img class="image-icon" :src="$parent.currencydata[key]?.Icon" /> [[ value ]]
                                    </tooltipwrapper>
                                    <span v-if="index < Object.entries($parent.productionToNiceString(profession)).length - 1">,
                                    </span>
                                </span>
                            </td>
                            <td v-if="fulldisplaymode">
                                <span v-for="(value, key, index) in $parent.getProfessionTotalOutput(profession)" :key="key">
                                    <tooltipwrapper :vm="$parent" :text="$parent.currencydata[key]?.Description">
                                        <img class="image-icon" :src="$parent.currencydata[key]?.Icon" /> [[ $parent.formatNumber(value) ]]
                                    </tooltipwrapper>
                                    <span v-if="index < Object.entries($parent.getProfessionTotalOutput(profession)).length - 1">,
                                    </span>
                                </span>
                            </td>
                            <td v-if="fulldisplaymode">
                                <span v-for="(value, key, index) in profession.Cost" :key="key">
                                    <tooltipwrapper :vm="$parent" :text="$parent.currencydata[key]?.Description">
                                        <img class="image-icon" :src="$parent.currencydata[key]?.Icon" /> [[ $parent.formatNumber(value) ]]
                                    </tooltipwrapper>
                                    <span v-if="index < Object.entries(profession.Cost).length - 1">,
                                    </span>
                                </span>
                            </td>
                            <td v-if="profession.Name != 'Unemployed' && profession.Name != 'Infant' && profession.Name != 'Child'">
                                <div class="btn-group" role="group" aria-label="Actions">
                                    <button class="btn btn-primary btn-sm" @click="doAction(profession)" :style="canDoAction(profession) == false ? 'opacity:0.65' : ''">
                                        <tooltipwrapper :vm="$parent" :calcfrom="() => getActionTooltip(profession)" :ishtml="true">
                                           [[getActionText(profession)]]
                                        </tooltipwrapper>
                                    </button>

                                </div>
                            </td>
                            <td v-else></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</div>
    
    `
}

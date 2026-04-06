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
            customSelected: false
        }
    },
    methods: {

    },
    delimiters: ['[[', ']]'],
    template: /*html*/`
    <div class="grid-item col">
    <div>
        <h4 class="my-2" v-if="!fulldisplaymode">Population</h4>
        <div>There are [[$parent.formatNumber($parent.getPopulation(), true)]] people in your nation.</div>
        <div>The average quality of life is [[$parent.formatNumber($parent.QOL)]].</div>
        <div style="color:red;" v-for="issue in $parent.getNationGrowthIssues()">[[$parent.issue]]</div>
        <div class="btn-group" role="group" aria-label="Amount selector">

            <button v-for="n in [1, 5, 10]" :key="n" type="button" class="btn btn-outline-primary" :class="{ active: $parent.populationMenu.amount === n }" @click="$parent.populationMenu.amount = n">
                [[$parent.formatNumber(n, true)]]
            </button>
            <button type="button" class="btn btn-outline-primary" v-if="$parent.hasNumbers()" :class="{ active: $parent.populationMenu.customSelected }" @click="$parent.populationMenu.customSelected = true">
                X
            </button>
            <input v-if="$parent.populationMenu.customSelected" type="number" class="form-control" style="max-width: 6rem;" v-model.number="$parent.populationMenu.amount" @click.stop placeholder="Enter" min="1" />
        </div>
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
        <div>
            [[$parent.getNationGrowthIssues()?.join(' ')]]
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
                            <td>
                                <tooltipwrapper :vm="$parent" :text="profession.Description">
                                    [[profession.Name]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <template v-if="$parent.hasNumbers()">
                                    <tooltipwrapper :vm="$parent"
                                        :text="($parent.missingProfessionCounts[profession.Name]) > 0 ? 'The number in parentheses is how many people used to be working this profession but died and have not been replaced yet.' : 'The current number of ' + $parent.pluralizer.plural(profession.Name)">
                                        [[$parent.formatNumber(profession.Count, true)]]
                                        <span v-if="$parent.missingProfessionCounts[profession.Name]">+
                                            ([[ ($parent.missingProfessionCounts[profession.Name]) ]])</span>
                                    </tooltipwrapper>
                                </template>
                                <template v-else>
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.formatNumber(profession.Count)">
                                        <div style="display:flex;">
                                            <div style="position:relative; white-space: nowrap;">
                                                <div v-for="n, index in profession.Count" style="position:absolute;top:-16px;" :style="'left:' + (((index + 1) * (100 / (profession.Count + 1))) - 16) + 'px'">
                                                    <img src="icons/guy.png" width="32" height="32">
                                                </div>
                                            </div>
                                            <div style="position:relative; white-space: nowrap;top:18px;left:-10px;" v-if="$parent.missingProfessionCounts[profession.Name]">
                                                +
                                                <div v-for="n, index in $parent.missingProfessionCounts[profession.Name]" style="position:absolute;top:-8px;opacity:0.5;"
                                                    :style="'left:' + (((index + 1) * (100 / (1 + $parent.missingProfessionCounts[profession.Name]))) - 6) + 'px'">
                                                    <img src="icons/guy.png" width="32" height="32">
                                                </div>
                                            </div>
                                        </div>
                                    </tooltipwrapper>

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
                                    <button class="btn btn-primary btn-sm" @click="$parent.tryHire(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())">
                                        <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.hireInfo(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())" :ishtml="true">
                                            Hire [[ $parent.formatNumber($parent.populationMenu.amount * $parent.getKeyboardModifiers()) ]]
                                        </tooltipwrapper>
                                    </button>
                                    <button class="btn btn-primary btn-sm" :style="$parent.canFire(profession) == false ? 'opacity:0.65' : ''"
                                        @click="$parent.tryFire(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())">
                                        <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.fireInfo(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())" :ishtml="true">
                                            Fire [[ $parent.formatNumber($parent.populationMenu.amount * $parent.getKeyboardModifiers()) ]]
                                        </tooltipwrapper>
                                    </button>
                                    <button v-if="!$parent.relocationInfo.IsRelocating" class="btn btn-primary btn-sm" :style="$parent.canRelocate(profession) == false ? 'opacity:0.65' : ''"
                                        @click="$parent.setRelocationPrimary(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())">

                                        <tooltipwrapper :vm="$parent" :text="'Move existing workers from this task to another task without modifying the queue.'">
                                            Relocate
                                        </tooltipwrapper>
                                    </button>
                                    <button v-else-if="$parent.relocationInfo?.Profession?.Name != profession.Name" class="btn btn-primary btn-sm" :style="$parent.canRelocate(profession) == false ? 'opacity:0.65' : ''"
                                        @click="$parent.tryRelocate(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())">

                                        <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.relocateInfo(profession, $parent.populationMenu.amount * $parent.getKeyboardModifiers())" :ishtml="true">
                                            Relocate [[ $parent.formatNumber($parent.populationMenu.amount * $parent.getKeyboardModifiers()) ]] [[ $parent.relocationInfo.Profession.Name ]]
                                        </tooltipwrapper>
                                    </button>
                                    <button v-else class="btn btn-primary btn-sm" @click="$parent.clearRelocation()">

                                        <tooltipwrapper :vm="$parent" :text="'Cancel moving workers.'">
                                            Cancel Relocation
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

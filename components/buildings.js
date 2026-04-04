import tooltipwrapper from './tooltipwrapper.js'

export default {
    components: {
        tooltipwrapper
    },
    props: {
        data: Object,
        fulldisplaymode: true,
    },
    data: function () {
        return {

        }
    },
    methods: {

    },
    delimiters: ['[[', ']]'],
    template: /*html*/`
    <div class="grid-item col">
        <h4 class="my-2" v-if="!fulldisplaymode">Buildings</h4>
        <div>There is enough housing for [[$parent.formatNumber($parent.getTotalHousing())]] people.
            [[$parent.formatNumber($parent.getAvailableHousing())]] room<span v-if="$parent.getAvailableHousing() != 1">s are</span>
            <span v-else> is</span>
            still open.
        </div>
        <div v-if="$parent.hasNumbers()">The homelessness rate is [[$parent.formatNumber($parent.getHomelessnessRatio() * 100)]]%</div>
        <div v-else>There are [[$parent.formatNumber($parent.getHomelessnessRatio() * 100)]] homeless people.</div>
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 10%;">Type</th>
                        <th style="width: 10%;">Count</th>
                        <th style="width: 20%;">Supports</th>
                        <th style="width: 20%;">Housing</th>
                        <th style="width: 20%;" v-if="fulldisplaymode">Cost</th>
                        <th style="width: 20%;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(houseType, index) in $parent.getVisibleHouseTypes()">
                        <tr style="height:65px;" :class="houseType.Unlocked ? '' : 'locked-item'" @mouseenter="houseType.Unlocked == false ? $parent.buildingMenu.hoverIndex = index : ''"
                            @mouseleave="$parent.buildingMenu.hoverIndex = null">
                            <td>
                                <tooltipwrapper :vm="$parent" :text="houseType.Description">
                                    [[houseType.Name]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :text="'You have ' + $parent.formatNumber(houseType.Count) + ' ' + $parent.toProperPluralize(houseType.Name, houseType.Count) + '.'">
                                    [[$parent.formatNumber(houseType.Count, true)]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :text="'Every ' + houseType.Name + ' houses ' + $parent.formatNumber(houseType.Houses) + ' people.'">
                                    [[$parent.formatNumber(houseType.Houses, true)]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :text="$parent.formatNumber(houseType.Houses) + ' x ' + $parent.formatNumber(houseType.Count)">
                                    [[$parent.formatNumber(houseType.Houses * houseType.Count, true)]]
                                </tooltipwrapper>
                            </td>
                            <td  v-if="fulldisplaymode">
                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Cost)">
                                    <div v-html="$parent.costToString(houseType.Cost)"></div>
                                </tooltipwrapper>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                <button class="btn btn-primary btn-sm" :style="(houseType.Unlocked == false || $parent.canAfford(houseType.Cost) == false) ? 'opacity:0.65' : ''" @click="$parent.buildBuilding(houseType)">
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getBuildingCostTooltip(houseType)" :text="$parent.getBuildingCostTooltip(houseType)" :ishtml="true">
                                        Build [[$parent.buildingMenu.amount * $parent.getKeyboardModifiers()]]
                                    </tooltipwrapper>
                                </button>
                                <button class="btn btn-primary btn-sm" :style="!$parent.canDemolish(houseType) ? 'opacity:0.65' : ''" @click="$parent.demolishBuilding(houseType)">
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getDemolishInfo(houseType)">
                                        Destroy [[$parent.buildingMenu.amount * $parent.getKeyboardModifiers()]]
                                    </tooltipwrapper>
                                </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 10%;">Building Type</th>
                        <th style="width: 10%;">Count</th>
                        <th style="width: 20%;">Description</th>
                        <th style="width: 20%;">Current</th>
                        <th style="width: 20%;" v-if="fulldisplaymode">Cost</th>
                        <th style="width: 20%;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(houseType, index) in $parent.getVisibleBuildings()">
                        <tr style="height:65px;" :class="houseType.Unlocked ? '' : 'locked-item'">
                            <td>
                                <tooltipwrapper :vm="$parent" :text="houseType.Description">
                                    [[houseType.Name]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :text="'You have ' + $parent.formatNumber(houseType.Count) + ' ' + $parent.toProperPluralize(houseType.Name, houseType.Count) + '.'">
                                    [[$parent.formatNumber(houseType.Count, true)]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <span v-if="houseType.Consumes">
                                    Consumes
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Consumes)">
                                        <div v-html="$parent.costToString(houseType.Consumes)"></div>
                                    </tooltipwrapper>
                                </span>
                                <span v-if="houseType.Stores">
                                    Stores
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Stores)">
                                        <div v-html="$parent.costToString(houseType.Stores)"></div>
                                    </tooltipwrapper>
                                </span>
                                <span v-if="houseType.Produces">
                                    Produces
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Produces)">
                                        <div v-html="$parent.costToString(houseType.Produces)"></div>
                                    </tooltipwrapper>
                                </span>
                            </td>
                            <td>
                                <span v-if="houseType.Consumes">
                                    Consumes
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Consumes, houseType.Count)">
                                        <div v-html="$parent.costToString(houseType.Consumes, houseType.Count)">
                                        </div>
                                    </tooltipwrapper>
                                </span>
                                <span v-if="houseType.Stores">
                                    Stores
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Stores, houseType.Count)">
                                        <div v-html="$parent.costToString(houseType.Stores, houseType.Count)"></div>
                                    </tooltipwrapper>
                                </span>
                                <span v-if="houseType.Produces">
                                    Produces
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Produces, houseType.Count)">
                                        <div v-html="$parent.costToString(houseType.Produces, houseType.Count)">
                                        </div>
                                    </tooltipwrapper>
                                </span>
                            </td>
                            <td v-if="fulldisplaymode">
                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.costToText(houseType.Cost, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())" :text="$parent.costToText(houseType.Cost, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())">
                                    <div v-html="$parent.costToString(houseType.Cost, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())"></div>
                                </tooltipwrapper>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-primary btn-sm" :style="(houseType.Unlocked == false || $parent.canAfford(houseType.Cost) == false) ? 'opacity:0.65' : ''" @click="$parent.buildBuilding(houseType, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())">
                                        <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getBuildingCostTooltip(houseType, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())" :text="$parent.getBuildingCostTooltip(houseType, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())" :ishtml="true">
                                            Build [[$parent.buildingMenu.amount * $parent.getKeyboardModifiers()]]
                                        </tooltipwrapper>
                                    </button>
                                    <button class="btn btn-primary btn-sm" :style="!$parent.canDemolish(houseType) ? 'opacity:0.65' : ''" @click="$parent.demolishBuilding(houseType, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())">
                                        <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getDemolishInfo(houseType, $parent.buildingMenu.amount * $parent.getKeyboardModifiers())">
                                            Unbuild [[$parent.buildingMenu.amount * $parent.getKeyboardModifiers()]]
                                        </tooltipwrapper>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    
    `
}

export default {
    props: {
      data: Object,
    },
    data: function(){
        return {
            hoverIndex:-1,
        }
    },
    methods:{
        buy(houseType){
            this.$parent.buildBuilding(houseType);
        }
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item">
        <h4 class="my-2">Buildings</h4>
        <div>There is enough housing for [[$parent.formatNumber($parent.getTotalHousing())]] people. [[$parent.formatNumber($parent.getAvailableHousing())]] room<span v-if="$parent.getAvailableHousing() != 1">s are</span><span v-else> is</span> still open.</div>
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Housing Type</th>
                        <th>Count</th>
                        <th>Supports</th>
                        <th>Current</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(houseType, index) in this.$parent.getVisibleHouseTypes()">
                        <tr  style="height:65px;" :class="houseType.Unlocked ? '' : 'locked-item'" @mouseenter="houseType.Unlocked == false ? hoverIndex = index : ''" @mouseleave="hoverIndex = null">
                            <td v-if="index == hoverIndex" colspan="100">
                                <div v-html="$parent.costToString(houseType.unlockCost)"></div>    
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[houseType.Name]]
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[$parent.formatNumber(houseType.Count)]]         
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[$parent.formatNumber(houseType.Houses)]]   
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[$parent.formatNumber(houseType.Houses * houseType.Count)]]         
                            </td>
                            <td v-if="index != hoverIndex" >
                                <div v-html="$parent.costToString(houseType.Cost)"></div>       
                            </td>
                            <td v-if="index != hoverIndex" >
                                <button class="btn btn-primary" :disabled="houseType.Unlocked == false || this.$parent.canAfford(houseType.Cost) == false" @click="buy(houseType)">Buy</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Building Type</th>
                        <th>Count</th>
                        <th>Description</th>
                        <th>Current</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(houseType, index) in this.$parent.getVisibleBuildings()">
                        <tr  style="height:65px;" :class="houseType.Unlocked ? '' : 'locked-item'" @mouseenter="houseType.Unlocked == false ? hoverIndex = index : ''" @mouseleave="hoverIndex = null">
                            <td v-if="index == hoverIndex" colspan="100">
                                <div v-html="$parent.costToString(houseType.unlockCost)"></div>    
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[houseType.Name]]
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[$parent.formatNumber(houseType.Count)]]         
                            </td>
                            <td v-if="index != hoverIndex" >
                                <span v-if="houseType.Type == 'Storage'">
                                Stores </span>  
                                    <div v-html="$parent.costToString(houseType.Stores)"></div>
                                
                            </td>
                            <td v-if="index != hoverIndex" >
                                [[$parent.formatNumber(houseType.Houses * houseType.Count)]]         
                            </td>
                            <td v-if="index != hoverIndex" >
                                <div v-html="$parent.costToString(houseType.Cost)"></div>       
                            </td>
                            <td v-if="index != hoverIndex" >
                                <button class="btn btn-primary" :disabled="houseType.Unlocked == false || this.$parent.canAfford(houseType.Cost) == false" @click="buy(houseType)">Buy</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    
    `
  }

export default {
    props: {
      data: Object
    },
    data: function(){
        return {
            amount:1,
            customSelected:false,
        }
    },
    methods:{
        hire(profession){
            this.$parent.hire(profession, this.amount);  
        },
        fire(profession){
            this.$parent.fire(profession, this.amount);
            
        },
        canHire(profession){
            return profession.Unlocked == true 
            && this.$parent.getAvailableWorkers() > 0
            && this.$parent.canAfford(profession.Cost);
        },
        setAmount(newValue){
            this.amount = newValue;
        },
        selectCustom(){
            this.customSelected = true;
        }
        
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="" style="width:700px;">
        <div>
            <h4 class="my-2">Population</h4>
            <div>There are [[$parent.formatNumber($parent.getPopulation())]] people in your nation.</div>
            <div>The average quality of life is [[$parent.formatNumber($parent.QOL)]].</div>
            <div class="btn-group" role="group" aria-label="Amount selector">

        <button v-for="n in [1, 5, 10]" :key="n" type="button" class="btn btn-outline-primary" :class="{ active: amount === n }" @click="setAmount(n)">
        [[n]]
        </button>
        <button type="button" class="btn btn-outline-primary" :class="{ active: customSelected }" @click="selectCustom" >
        X
        </button>
        <input v-if="customSelected" type="number" class="form-control" style="max-width: 6rem;" v-model.number="amount" @click.stop placeholder="Enter" min="1" />
        </div>
            <div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Profession</th>
                            <th>Count</th>
                            <th>Produces</th>
                            <th>Current</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="profession in this.$parent.getVisibleProfessions()">
                            <tr :style="profession == 'Unlocked' ? '' : 'locked-item'">
                                <td>
                                    [[profession.Name]]
                                </td>
                                <td>
                                    [[$parent.formatNumber(profession.Count)]] <span v-if="$parent.missingProfessionCounts[profession.Name]">+ ([[($parent.missingProfessionCounts[profession.Name])]])</span>
                                </td>
                                <td>
                                    <span v-for="(value, key, index) in $parent.productionToNiceString(profession)" :key="key">
                                        <img class="image-icon" :src="$parent.currencydata[key].Icon" /> [[ value ]]<span v-if="index < Object.entries($parent.productionToNiceString(profession)).length - 1">, </span>
                                    </span>   
                                </td>
                                <td>
                                    <span v-for="(value, key, index) in $parent.getProfessionTotalOutput(profession)" :key="key">
                                        <img class="image-icon" :src="$parent.currencydata[key].Icon" /> [[ value ]]<span v-if="index < Object.entries($parent.getProfessionTotalOutput(profession)).length - 1">, </span>
                                    </span>   
                                </td>
                                <td>
                                    <span v-for="(value, key, index) in profession.Cost" :key="key">
                                        <img class="image-icon" :src="$parent.currencydata[key].Icon" /> [[ $parent.formatNumber(value) ]]<span v-if="index < Object.entries(profession.Cost).length - 1">, </span>
                                    </span>    
                                </td>
                                <td v-if="profession.Name != 'Unemployed'">
                                    <button class="btn btn-primary m-2" :disabled="canHire(profession) == false" @click="hire(profession)">Hire</button>
                                    <button class="btn btn-primary m-2" :disabled="profession.Count == 0 " @click="fire(profession)">Fire</button>
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

import tooltipwrapper from './tooltipwrapper.js'

export default {
        components: {
            tooltipwrapper
        },
    props: {
      data: Object,
      fulldisplaymode:true,
    },    
    data: function(){
        return {
            
        }
    },
    methods:{
        getStockpiles(){
            if(this.$props.fulldisplaymode){
                return this.$parent.currencydata;
            }
            let c = [];
            for(let currencyName of this.$parent.stockpileMenu.importantStockpiles){
                let currency = this.$parent.currencydata[currencyName];
                if(currency){
                    c.push(currency);
                }
            }
            return c;
        }
    },
    delimiters: ['[[', ']]'],
    template: /*html*/`
    <div class="grid-item">
        <div>
            <table class="table table-striped" style="table-layout: fixed; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 15%;">Stockpile</th>
                        <th style="width: 35%;">Amount</th>
                        <th style="width: 15%;">Hourly Change</th>
                        <th style="width: 15%;">Demand</th>
                        <th style="width: 20%;" v-if="fulldisplaymode">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="currency in getStockpiles()">
                        <tr v-if="currency.Unlocked">
                            <td>
                                <tooltipwrapper :vm="$parent" :text="currency.Description">
                                    <img class="image-icon" :src="currency.Icon" />
                                    [[currency.Name]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <template v-if="$parent.hasNumbers()">
                                    <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getTimeToFullStockpile(currency)">
                                        [[$parent.formatNumber(currency.Amount)]]
                                    </tooltipwrapper>
                                    <span v-if="currency.Type != 'Nonphysical Good'">/
                                        [[$parent.formatNumber($parent.getCurrencyStorage(currency.Name))]] </span>
                                </template>
                                <div>
                                    <div class="progress" style="height: 24px;">
                                        <div class="progress-bar" :class="$parent.currencyDailyChange[currency.Name] < 0 ? 'bg-danger' : 'bg-success'" role="progressbar"
                                            :style="{ width: (currency.Amount / $parent.getCurrencyStorage(currency.Name) * 100) + '%' }">
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getDailyChangeDescription(currency)">
                                    [[$parent.formatNumber($parent.currencyDailyChange[currency.Name])]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getDailyDemandDescription(currency)">
                                    [[$parent.formatNumber($parent.demand[currency.Name])]]
                                </tooltipwrapper>

                            </td>
                            <td v-if="fulldisplaymode">
                                <button class="btn btn-primary" v-if="$parent.stockpileMenu.importantStockpiles.includes(currency.Name)" @click="$parent.removeFromImportantStockpilesList(currency.Name)">Hide</button>
                                <button class="btn btn-primary" v-else @click="$parent.addToImportantStockpilesList(currency.Name)">Show in Main Tab</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    `
  }

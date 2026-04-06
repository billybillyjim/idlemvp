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
        },
        currencyIsCapped(currencyName){
            return (this.$parent.preCostTickCurrencyValues[currencyName]?.Amount ?? 0) >= this.$parent.getCurrencyStorage(currencyName);
        },
        getCurrencyBarColor(currency){
            let base = '';
            if(currency.Type == 'Nonphysical Good'){
                base = 'bg-info';
            }
            else if(this.currencyIsCapped(currency.Name)){
                base = 'bg-primary';
            }
            else if (this.$parent.currencyDailyChange[currency.Name] < 0){
                base = 'bg-danger';
            }
            else{
                base = 'bg-success';
            }
            return base;
        },
        getBarWidth(currency){
            if(currency.Type == 'Nonphysical Good'){
                return 100;
            }
            if(this.currencyIsCapped(currency.Name)){
                return 100;
            }
            return (currency.Amount / this.$parent.getCurrencyStorage(currency.Name) * 100);
        }
    },
    delimiters: ['[[', ']]'],
    template: /*html*/`
    <div class="grid-item">

        <h4 class="my-2" v-if="!fulldisplaymode">Stockpiles</h4>
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
                                        <div class="progress-bar" :class="getCurrencyBarColor(currency)" role="progressbar"
                                            :style="{ width: getBarWidth(currency) + '%' }">
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
                                <tooltipwrapper :vm="$parent" :ishtml="true" :calcfrom="() => $parent.getCurrencyStorageUpgradeCostDescription(currency.Name)">
                                    <button class="btn btn-primary btn-sm m-2" :disabled="!$parent.canAffordCurrencyStorageUpgrade(currency.Name)" @click="$parent.upgradeCurrencyStorage(currency.Name, 1)">Upgrade Storage</button>
                                </tooltipwrapper>
                                <button class="btn btn-primary btn-sm m-2" v-if="$parent.stockpileMenu.importantStockpiles.includes(currency.Name)" @click="$parent.removeFromImportantStockpilesList(currency.Name)">Hide</button>
                                <button class="btn btn-primary btn-sm m-2" v-else @click="$parent.addToImportantStockpilesList(currency.Name)">Show in Main Tab</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    `
  }

export default {
    props: {
      data: Object
    },
    methods:{
        getDailyChange(currency){
            if(!this.$parent.endTickCurrencyValues[currency.Name] || !this.$parent.beginTickCurrencyValues[currency.Name]){
                return 0;
            }
            return (this.$parent.endTickCurrencyValues[currency.Name]?.Amount - this.$parent.beginTickCurrencyValues[currency.Name]?.Amount) * 24;
        },
        getCurrencies(){
            return this.$parent.currencydata;

        }
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item">
        <div></div>
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Stockpile</th>
                        <th>Amount</th>
                        <th>Daily Change</th>
                        <th>Demand</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="currency in getCurrencies()">
                        <tr v-if="currency.Unlocked">
                            <td :title="currency.Name">
                                <img class="image-icon" :src="currency.Icon" />
                            </td>
                            <td>
                                [[$parent.formatNumber(currency.Amount)]]         
                            </td>
                            <td :title="$parent.getDailyChangeDescription(currency)">
                                [[$parent.formatNumber(getDailyChange(currency))]]         
                            </td>
                             <td :title="$parent.getDailyDemandDescription(currency)">
                                [[$parent.formatNumber($parent.demand[currency.Name])]]         
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    
    `
  }

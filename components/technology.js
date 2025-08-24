export default {
    props: {
      data: Object
    },    
    data: function(){
        return {
            showCompleted:false,
        }
    },
    methods:{

    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item">
        <h4>Technology</h4>
        <div><button class="btn btn-primary" @click="showCompleted = !showCompleted">Show Completed</button></div>
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Technology</th>
                        <th>Progress</th>
                        <th>Focus</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="technology in this.$parent.getTechnologies()">
                        <tr v-if="technology.isLocked || showCompleted">
                            <td>
                                [[technology.Name]]
                            </td>
                            <td>
                                [[$parent.formatNumber(technology.Progress)]] / [[ $parent.formatNumber(technology.Complexity) ]]   
                            </td>
                            <td>
                                <button v-if="technology.isLocked" class="btn btn-primary m-2" :disabled="this.$parent.focusedTechnology == technology" @click="$parent.focusTechnology(technology)">[[this.$parent.focusedTechnology == technology ? 'Focused' : 'Focus']]</button>      
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    
    `
  }

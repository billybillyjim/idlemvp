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
            showCompleted:false,
        }
    },
    methods:{

    },
    delimiters: ['[[', ']]'],
    template: /*html*/`
    <div class="grid-item col">
        <h4 class="my-2" v-if="!fulldisplaymode">Technology</h4>
        <div>Current Stockpiled Knowledge: [[$parent.formatNumber($parent.currencydata['Knowledge'].Amount)]]</div>
        <div v-if="fulldisplaymode">
            <button class="btn btn-primary" @click="$parent.technologyMenu.showCompleted = !$parent.technologyMenu.showCompleted">Show Completed</button>
        </div>
        <div>
            <table class="table table-striped" style="table-layout: fixed; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 33%;">Technology</th>
                        <th style="width: 34%;">Progress</th>
                        <th style="width: 33%;">Focus</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="technology in $parent.getTechnologies(true, true)">
                        <tr v-if="technology.isLocked || $parent.technologyMenu.showCompleted">
                            <td>
                                <tooltipwrapper :vm="$parent" :text="technology.Description">
                                    [[technology.Name]]
                                </tooltipwrapper>
                            </td>
                            <td>
                                <tooltipwrapper :vm="$parent" :calcfrom="() => $parent.getTechnologyProgressDescription(technology)">
                                    [[$parent.formatNumber(technology.Progress)]] / [[
                                    $parent.formatNumber(technology.Complexity) ]]
                                </tooltipwrapper>

                                <div class="progress" style="height: 24px;">
                                    <div class="progress-bar" role="progressbar" :style="{ width: (technology.Progress / technology.Complexity * 100) + '%' }" :aria-valuenow="technology.Progress"
                                        :aria-valuemin="0" :aria-valuemax="technology.Complexity">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <button v-if="technology.isLocked" class="btn btn-primary m-2 btn-sm" :style="$parent.focusedTechnology == technology ? 'opacity:0.65' : ''" @click="$parent.focusTechnology(technology)">
                                    <tooltipwrapper :vm="$parent" :ishtml="true" :calcfrom="() => $parent.getTechnologyFocusDescription(technology)">
                                        [[$parent.focusedTechnology == technology ? 'Focused' : 'Focus']]
                                    </tooltipwrapper>
                                </button>
                            </td>
                        </tr>
                    </template>
                    <tr v-if="$parent.getTechnologies().length == 0">
                        <td colspan="1000">No one has any ideas for any technologies right now.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
  }

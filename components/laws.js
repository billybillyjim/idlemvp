export default {
    props: {
      data: Object
    },
    computed: {
        lineNumbers() {
            return Array.from({ length: this.lineCount }, (_, i) => i + 1).join('\n');
        },
    },
    data: function(){
        return {
            creatingNewLaw:false,
            selectedType:'',
            newLawObj:{},
            scrollTop:0,
            lineCount: 1,
            errors: [],
        }
    },
    methods:{
        scrollCheck(){
            const textarea = document.querySelector('#code-text-area');
            if(!textarea){
                return;
            }
            this.scrollTop = textarea.scrollTop;
        },
        getNumberLineOffsetStyle(){
            return `margin-top:-${this.scrollTop % 24 + 5}px;`;
        },
        passLaw(){
            this.newLawObj.Name = this.getLawName();
            this.newLawObj.isActive = true;
            this.newLawObj.frequency = 'Daily';
            this.$parent.passedLaws.push(JSON.parse(JSON.stringify(this.newLawObj)));
            this.newLawObj = {};
        },
        getLineNumbers(){
            if(!this.newLawObj.code){
                return [0];
            }
            const lines = this.newLawObj.code.split('\n');
            const result = [];
            
            const textarea = document.querySelector('#code-text-area');
            if(!textarea){
                return [0];
            }

            const scrollTop    = this.scrollTop;
            const style        = getComputedStyle(textarea);
            const lineHeight   = parseFloat(style.lineHeight);

            let visibleCount = parseFloat(style.height) / lineHeight;
            let linesToSkip = scrollTop / 24;
            let i = Math.floor(linesToSkip);
            for(let line of lines){
                result.push(i);
                i++;
            }

            return result.slice(0, linesToSkip + visibleCount);
        },
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item" style="width:500px;">
        <div>
            <h4 class="my-2">Laws</h4>
            <div>These are the things that society has agreed should be.</div>
            <div></div>
            <div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Law</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="law in this.$parent.getLaws()">
                            <tr>
                                <td>
                                    [[law.Name]]
                                </td>
                                <td>
                                    [[law.isActive]]
                                </td>
                                <td>
                                    [[law.frequency]]
                                </td>
                                <td>
                                    <button class="btn btn-primary m-2">Pause</button>
                                    <button class="btn btn-primary m-2">Repeal</button>
                                </td>
                            </tr>
                        </template>
                        <tr>
                            <td colspan="2">
                                New Law
                            </td>
                            <td>
                                <button class="btn btn-primary m-2" @click="creatingNewLaw = true;">Create New</button>
                            </td>
                        </tr>
                        <tr v-if="creatingNewLaw">
                            <td>
                                <div style="width:500px;">
                                    <div class="d-flex">
                                        <div class="line-numbers" ref="lineNumbersEle" id="line-numbers" :style="getNumberLineOffsetStyle()">
                                            <div v-for="(num, idx) in getLineNumbers()" :key="idx">
                                                [[ num !== '' ? num + 1 : '\u00A0' ]]
                                            </div>
                                        </div>
                                        <textarea class="code-text-area" @scroll="scrollCheck" @input="getLineNumbers" ref="textarea" v-model="newLawObj.code" id="code-text-area"></textarea>
                                            
                                    </div>
                                    <div>
                                        <div v-for="error in errors">[[error.id.message]]</div>
                                        <div v-for="output in $parent.consoleOutputs">[[output]]</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="newLawObj.code">
                            <td><button class="btn btn-primary m-2" @click="passLaw()">Test Law</button></td>
                            <td><button class="btn btn-primary m-2" @click="passLaw()">Pass Law</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    `
  }

export default {
    props: {
        data: Object
    },
    computed: {
        lineNumbers() {
            return Array.from({ length: this.lineCount }, (_, i) => i + 1).join('\n');
        },
    },
    data: function () {
        return {
            testCode: `if wood < 50 and there are 1 farmers and there are 15 unemployed print 100`,
            errors: [],
            content: '',
            scrollTop:0,
            lineCount: 1,
            tests: [
                {
                    name: 'assignment',
                    type: 'token',
                    code: 'x = 10.',
                    expected: [
                        { type: 'IDENT', value: 'x', line:1 },
                        { type: 'ASSIGN', value: '=', line:1 },
                        { type: 'NUMBER', value: '10', line:1 },
                        { type: 'DOT', value: '.', line:1 },
                        { type: 'EOF' },
                    ]
                },
                {
                    name: 'Basic Conditional',
                    type: 'token',
                    code: 'if Food < x then hire Farmers until there are x.',
                    expected: [
                        { type: 'CONDITIONAL', value: 'if', line:1 },
                        { type: 'IDENT', value: 'food', line:1 },
                        { type: 'OPERATOR', value: '<', line:1 },
                        { type: 'IDENT', value: 'x', line:1 },
                        { type: 'THEN', value: 'then', line:1 },
                        { type: 'ACTION', value: 'hire', line:1 },
                        { type: 'IDENT', value: 'farmers', line:1 },
                        { type: 'UNTIL', value: 'until', line:1 },
                        { type: 'THERE_ARE', value: 'there are', line:1 },
                        { type: 'IDENT', value: 'x', line:1 },
                        { type: 'DOT', value: '.', line:1 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Basic Conditional Parse',
                    type: 'parse',
                    code: 'if Food < x then hire Farmers until there are x.',
                    expected: [
                        {
                            "type": "Evaulatable",
                            "test": {
                                "left": {
                                    "type": "IDENT",
                                    "value": "food",
                                    line:1
                                },
                                "op": {
                                    "type": "OPERATOR",
                                    "value": "<",
                                    line:1
                                },
                                "right": {
                                    "type": "IDENT",
                                    "value": "x",
                                    line:1
                                }
                            },
                            "action": {
                                "type": "Action",
                                "count":1,
                                "action": {
                                    "type": "ACTION",
                                    "value": "hire",
                                    line:1
                                },
                                "actionTarget": {
                                    "type": "IDENT",
                                    "value": "farmers",
                                    line:1
                                },
                                "condition": {
                                    "type": "Evaulatable",
                                    "action": null,
                                    "test": {
                                        "left": {
                                            "type": "IDENT",
                                            "value": "farmers",
                                            line:1
                                        },
                                        "op": {
                                            "type": "Operator",
                                            "value": ">=",
                                        },
                                        "right": {
                                            "type": "IDENT",
                                            "value": "x",
                                            line:1
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    },
    created: function () {
        this.runTests();
    },
    mounted: function () {
        const textarea = document.querySelector('#code-text-area');
        const lineNumbersEle = document.querySelector('#line-numbers');
        const styles = window.getComputedStyle(textarea);
        ['fontFamily', 'fontSize', 'lineHeight'].forEach((prop) => {
            lineNumbersEle.style[prop] = styles[prop];
        });
    },
    methods: {
        getLineNumbers(){
            const lines = this.testCode.split('\n');
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
        syncScroll() {
            this.$refs.lineNumbers.scrollTop = this.$refs.textarea.scrollTop;
        },
        runTests() {
            for (let test of this.tests) {
                let output = this.$parent.testCode(test.type, test.code, JSON.parse(JSON.stringify(test.expected)))
                if (output === true) {
                    console.log(test.name + ': passed');
                }
                else {
                    console.log(test.name + ': failed: ', output);
                }
            }
        },
        scrollCheck(){
            const textarea = document.querySelector('#code-text-area');
            if(!textarea){
                return;
            }
            this.scrollTop = textarea.scrollTop;
        },
        testTheCode() {
            let output = this.$parent.runCode(this.testCode, true, true, true);
            if (output['Errors']) {
                this.errors = output['Errors'];
            }
        },
        getNumberLineOffsetStyle(){
            return `margin-top:-${this.scrollTop % 24 + 5}px;`;
        }
    },
    delimiters: ['[[', ']]'],
    template: `
    <div>
        <h4 class="my-2">Laws</h4>
        <div class="d-flex">
            <div class="line-numbers" ref="lineNumbersEle" id="line-numbers" :style="getNumberLineOffsetStyle()">
                <div v-for="(num, idx) in getLineNumbers()" :key="idx">
                    [[ num !== '' ? num + 1 : '\u00A0' ]]
                </div>
            </div>
            <textarea class="code-text-area" @scroll="scrollCheck" @input="getLineNumbers" ref="textarea" v-model="testCode" id="code-text-area"></textarea>
                
        </div>
        <div>
            <div v-for="error in errors">[[error.id.message]]</div>
            <div v-for="output in $parent.consoleOutputs">[[output]]</div>
            <div>
                <button class="btn btn-primary m-2" @click="testTheCode()">Test</button>
            </div>
        </div>
    </div>
    
    `
}

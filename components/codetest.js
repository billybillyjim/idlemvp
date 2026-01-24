import tooltipwrapper from './tooltipwrapper.js'

export default {
    components: {
        tooltipwrapper
    },
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
            // testCode: `if available housing is 0, build a hut. 
            // if there are 0 lumberjacks, hire a lumberjack.
            // if wood production is less than or equal to wood consumption, hire a lumberjack.
            // if stone production is less than or equal to stone consumption hire a miner.
            // if there are more than 1 unemployed people, hire a farmer. 
            // if water production is less than or equal to water consumption build a well.
            // `,
            // testCode: `if there are more than 7 dunemployed print 'yes'`,
            // testCode:'print wood production. print wood consumption. if wood production is less than or equal to wood consumption print "yes" otherwise print "no".',
            // testCode: 'if food > 10 and 5 is equal to 7 then print "ok".',
            // testCode: 'if food > 10 and 5 == 7 then print "ok" otherwise print "not okay".',
            // testCode:'if there are 0 lumberjacks, hire a lumberjack.',
            // testCode:'if there are more than z - 3 lumberjacks print \'oh no\'.',

            testCode: `x is 5.
y is 10 + 3.
print x > y.
`,
            errors: [],
            content: '',
            scrollTop: 0,
            lineCount: 1,
            isInspecting: false,
            tokens: [],
            ast: [],
            env: [],
            height: '',
            parsed:[],
            validMori:[
                'Build 7 huts.',
                'Build a hut until there are no homeless people.',
                'Build three huts.',
                'Fire a farmer if there are any farmers.',
                'Hire 10 farmers.',
                'If available housing is less than x, build a hut.',
                'If there are more than 0 homeless, build a hut.',
                `Hire 3 farmers.`,
                `Hire a farmer if there are any unemployed people.`,
                `Hire a farmer.`,
                `Hire farmers until there are 10.`,
                `Hire y farmers.`,
                `Hire a farmer until food production is greater than food consumption.`,
                `If food is greater than 10 and 5 is equal to 7 then print "ok" otherwise print "Nope".`,
                `If food production is greater than or equal to food consumption, print 'we are okay'.`,
                `If food production less than food consumption print 'we not okay'.`,
                `If there are 0 lumberjacks, hire a lumberjack.`,
                `If there are 7 Unemployed hire a farmer.`,
                `If there are 7 Unemployed, then hire a farmer.`,
                `If there are 8 farmers, hire a farmer otherwise print 'nope'.`,
                `If there are any lumberjacks, fire lumberjacks.`,
                `If there are more farmers than lumberjacks hire lumberjacks until there are more lumberjacks than farmers.`,
                `If there are more than z - 3 lumberjacks print 'oh no'.`,
                `If there are no lumberjacks, hire one.`,
                `If there are x Farmers, hire a farmer.`,
                `If x > y hire a farmer.`,
                `print 5 - 3 + 4 - 1.`,
                `print 7 = 4.`,
                `print wood production + 3 if wood production < wood consumption otherwise print 'None'.`,
                `print wood production > wood consumption.`,
                `print wood production.`,
                `print wood.`,
                `print x + y.`,
                `print x > y.`,
                `y is 3 + 5.`,
                `y is 7.`,
                `x = y is > 7.`,
                `y is x + 5.`,
            ],
            tests: [
                {
                    name: 'assignment',
                    type: 'token',
                    code: 'x = 10.',
                    expected: [
                        { type: 'IDENT', value: 'x', line: 1, id: 0 },
                        { type: 'ASSIGN', value: '=', line: 1, id: 1 },
                        { type: 'NUMBER', value: '10', line: 1, id: 2 },
                        { type: 'DOT', value: '.', line: 1, id: 3 },
                        { type: 'EOF' },
                    ]
                },
                {
                    name: 'Basic Conditional',
                    type: 'token',
                    code: 'if Food < x then hire Farmers until there are x.',
                    expected: [
                        { type: 'CONDITIONAL', value: 'if', line: 1, id: 0 },
                        { type: 'IDENT', value: 'food', line: 1, id: 1 },
                        { type: 'COMPARATOR', value: '<', line: 1, id: 2 },
                        { type: 'IDENT', value: 'x', line: 1, id: 3 },
                        { type: 'THEN', value: 'then', line: 1, id: 4 },
                        { type: 'ACTION', value: 'hire', line: 1, id: 5 },
                        { type: 'IDENT', value: 'farmers', line: 1, id: 6 },
                        { type: 'UNTIL', value: 'until', line: 1, id: 7 },
                        { type: 'THERE_ARE', value: 'there are', line: 1, id: 8 },
                        { type: 'IDENT', value: 'x', line: 1, id: 9 },
                        { type: 'DOT', value: '.', line: 1, id: 10 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'There Are With Missing Identifier',
                    type: 'token',
                    code: 'there are more than 5.',
                    expected: [
                        { type: 'THERE_ARE', value: 'there are', line: 1, id: 0 },
                        { type: 'COMPARATOR', value: 'more than', line: 1, id: 1 },
                        { type: 'NUMBER', value: '5', line: 1, id: 2 },
                        { type: 'DOT', value: '.', line: 1, id: 3 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Boolean Keyword Tokens',
                    type: 'token',
                    code: 'not x xor y.',
                    expected: [
                        { type: 'NOT', value: 'not', line: 1, id: 0 },
                        { type: 'IDENT', value: 'x', line: 1, id: 1 },
                        { type: 'XOR', value: 'xor', line: 1, id: 2 },
                        { type: 'IDENT', value: 'y', line: 1, id: 3 },
                        { type: 'DOT', value: '.', line: 1, id: 4 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: "Hiring if there are none",
                    type: 'parse',
                    code: 'if there are 0 lumberjacks, hire a lumberjack.',
                    expected: {

                    }
                },
                {
                    name: 'Parse Assignment',
                    type: 'parse',
                    code: 'x is 7.',
                    expected: [
                        {
                            type: 'Assignment',
                            id: { type: 'Identifier', name: 'x' },
                            init: { type: 'Literal', value: 7 }
                        }
                    ]
                },
                {
                    name: 'Production Modifier Token',
                    type: 'token',
                    code: 'food production < 10.',
                    expected: [
                        { type: 'IDENT', value: 'food', line: 1, id: 0 },
                        { type: 'PRODUCTION', value: 'production', line: 1, id: 1 },
                        { type: 'COMPARATOR', value: '<', line: 1, id: 2 },
                        { type: 'NUMBER', value: '10', line: 1, id: 3 },
                        { type: 'DOT', value: '.', line: 1, id: 4 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Parse Evaluatable There Are and Line Numbers',
                    type: 'parse',
                    code: 'if there are more than\n5 farmers.',
                    expected: [
                        {
                            type: 'Evaluatable',
                            test: {
                                left: { type: 'IDENT', value: 'farmers', line: 2 },
                                op: { type: 'COMPARATOR', value: 'more than', line: 1 },
                                right: { type: 'NUMBER', value: '5', line: 2 }
                            }
                        }
                    ]
                },
                {
                    name: 'Parse Chained Boolean Condition',
                    type: 'parse',
                    code: 'if food > 5 and wood < 3.',
                    expected: [
                        {
                            type: 'BooleanOperator',
                            value: { type: 'AND', value: 'and' },
                            lhs: {
                                type: 'Evaluatable',
                                test: {
                                    left: { type: 'IDENT', value: 'wood' },
                                    op: { type: 'COMPARATOR', value: '<' },
                                    right: { type: 'NUMBER', value: '3' }
                                }
                            },
                            rhs: {
                                type: 'Evaluatable',
                                test: {
                                    left: { type: 'IDENT', value: 'food' },
                                    op: { type: 'COMPARATOR', value: '>' },
                                    right: { type: 'NUMBER', value: '5' }
                                }
                            }
                        }
                    ]
                },
                {
                    name: 'Parse Until Condition',
                    type: 'parse',
                    code: 'hire farmers until there are 3 farmers.',
                    expected: [
                        {
                            type: 'Action',
                            count: 1,
                            action: { type: 'ACTION', value: 'hire' },
                            actionTarget: { type: 'IDENT', value: 'farmers' },
                            condition: {
                                type: 'Evaluatable',
                                test: {
                                    left: { type: 'IDENT', value: 'farmers' },
                                    op: { type: 'COMPARATOR', value: '>=' },
                                    right: { type: 'NUMBER', value: '3' }
                                }
                            }
                        }
                    ]
                },
                {
                    name: 'There Are With Missing Identifier (Regression)',
                    type: 'token',
                    code: 'there are more than 5.',
                    expected: [
                        { type: 'THERE_ARE', value: 'there are', line: 1, id: 0 },
                        { type: 'COMPARATOR', value: 'more than', line: 1, id: 1 },
                        { type: 'NUMBER', value: '5', line: 1, id: 2 },
                        { type: 'DOT', value: '.', line: 1, id: 3 },
                        { type: 'EOF' }
                    ]
                }, {
                    name: 'Boolean Keywords',
                    type: 'token',
                    code: 'if not x xor y.',
                    expected: [
                        { type: 'CONDITIONAL', value: 'if', line: 1, id: 0 },
                        { type: 'NOT', value: 'not', line: 1, id: 1 },
                        { type: 'IDENT', value: 'x', line: 1, id: 2 },
                        { type: 'XOR', value: 'xor', line: 1, id: 3 },
                        { type: 'IDENT', value: 'y', line: 1, id: 4 },
                        { type: 'DOT', value: '.', line: 1, id: 5 },
                        { type: 'EOF' }
                    ]
                }, {
                    name: 'Production And Consumption Tokens',
                    type: 'token',
                    code: 'food production < food consumption.',
                    expected: [
                        { type: 'IDENT', value: 'food', line: 1, id: 0 },
                        { type: 'PRODUCTION', value: 'production', line: 1, id: 1 },
                        { type: 'COMPARATOR', value: '<', line: 1, id: 2 },
                        { type: 'IDENT', value: 'food', line: 1, id: 3 },
                        { type: 'CONSUMPTION', value: 'consumption', line: 1, id: 4 },
                        { type: 'DOT', value: '.', line: 1, id: 5 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Complex Operator Phrase',
                    type: 'token',
                    code: 'if food is greater than or equal to 10.',
                    expected: [
                        { type: 'CONDITIONAL', value: 'if', line: 1, id: 0 },
                        { type: 'IDENT', value: 'food', line: 1, id: 1 },
                        { type: 'COMPARATOR', value: 'is greater than or equal to', line: 1, id: 2 },
                        { type: 'NUMBER', value: '10', line: 1, id: 3 },
                        { type: 'DOT', value: '.', line: 1, id: 4 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Multi-line Program Tokens',
                    type: 'token',
                    code: 'x = 10.\ny is x.\nprint y.',
                    expected: [
                        { type: 'IDENT', value: 'x', line: 1, id: 0 },
                        { type: 'ASSIGN', value: '=', line: 1, id: 1 },
                        { type: 'NUMBER', value: '10', line: 1, id: 2 },
                        { type: 'DOT', value: '.', line: 1, id: 3 },

                        { type: 'IDENT', value: 'y', line: 2, id: 4 },
                        { type: 'ASSIGN', value: 'is', line: 2, id: 5 },
                        { type: 'IDENT', value: 'x', line: 2, id: 6 },
                        { type: 'DOT', value: '.', line: 2, id: 7 },

                        { type: 'PRINT', value: 'print', line: 3, id: 8 },
                        { type: 'IDENT', value: 'y', line: 3, id: 9 },
                        { type: 'DOT', value: '.', line: 3, id: 10 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'There Are With Ident',
                    type: 'token',
                    code: 'there are 5 unemployed people.',
                    expected: [
                        { type: 'THERE_ARE', value: 'there are', line: 1, id: 0 },
                        { type: 'NUMBER', value: '5', line: 1, id: 1 },
                        { type: 'IDENT', value: 'unemployed people', line: 1, id: 2 },
                        { type: 'DOT', value: '.', line: 1, id: 3 },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Parse Simple Assignment Using Equals',
                    type: 'parse',
                    code: 'x = 10.',
                    expected: [
                        {
                            type: 'Assignment',
                            id: { type: 'Identifier', name: 'x' },
                            init: { type: 'Literal', value: 10 }
                        }
                    ]
                },
                {
                    name: 'Parse Simple Assignment Using Is',
                    type: 'parse',
                    code: 'x is 7.',
                    expected: [
                        {
                            type: 'Assignment',
                            id: { type: 'Identifier', name: 'x' },
                            init: { type: 'Literal', value: 7 }
                        }
                    ]
                },
                {
                    name: 'Regression - Missing Antecedent',
                    type: 'parse',
                    code: 'if there are more than 5.',
                    expected: [
                        {
                            type: 'SyntaxError',
                            id: {
                                type: 'Evaluatable',
                                name: 'Evaluatable',
                                message: ''
                            }
                        }
                    ]
                },
                {
                    name: 'Regression - Invalid Number Condition After And',
                    type: 'parse',
                    code: 'if food > 10 and 5 7.',
                    expected: [
                        {
                            type: 'BooleanOperator',
                            value: {
                                type: 'AND',
                                value: 'and',
                                line: 1,
                                id: 4
                            },
                            lhs: {
                                type: 'SyntaxError',
                                id: {
                                    type: 'Evaluatable',
                                    name: {
                                        type: "NUMBER",
                                        value: '5',
                                        line: 1,
                                        id: 5
                                    },
                                    message: '',
                                },
                                tokenid: 5
                            },
                            rhs: {
                                type: 'Evaluatable',
                                test: {
                                    left: {
                                        type: 'IDENT',
                                        value: 'food',
                                        line: 1,
                                        id: 1
                                    },
                                    op: {
                                        type: 'COMPARATOR',
                                        value: '>',
                                        line: 1,
                                        id: 2
                                    },
                                    right: {
                                        type: 'NUMBER',
                                        value: '10',
                                        line: 1,
                                        id: 3
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    name: 'Assignment Using Is',
                    type: 'token',
                    code: 'x is 7.',
                    expected: [
                        { type: 'IDENT', value: 'x', line: 1, id: 0, },
                        { type: 'ASSIGN', value: 'is', line: 1, id: 1, },
                        { type: 'NUMBER', value: '7', line: 1, id: 2, },
                        { type: 'DOT', value: '.', line: 1, id: 3, },
                        { type: 'EOF' }
                    ]
                },
                {
                    name: 'Basic Conditional Parse',
                    type: 'parse',
                    code: 'if Food < x then hire Farmers until there are x.',
                    expected: [
                        {
                            "type": "Evaluatable",
                            "test": {
                                "left": {
                                    "type": "IDENT",
                                    "value": "food",
                                    line: 1
                                },
                                "op": {
                                    "type": "COMPARATOR",
                                    "value": "<",
                                    line: 1
                                },
                                "right": {
                                    "type": "IDENT",
                                    "value": "x",
                                    line: 1
                                }
                            },
                            "action": {
                                "type": "Action",
                                "count": 1,
                                "action": {
                                    "type": "ACTION",
                                    "value": "hire",
                                    line: 1
                                },
                                "actionTarget": {
                                    "type": "IDENT",
                                    "value": "farmers",
                                    line: 1
                                },
                                "condition": {
                                    "type": "Evaluatable",
                                    "action": null,
                                    "test": {
                                        "left": {
                                            "type": "IDENT",
                                            "value": "farmers",
                                            line: 1
                                        },
                                        "op": {
                                            "type": "COMPARATOR",
                                            "value": ">=",
                                        },
                                        "right": {
                                            "type": "IDENT",
                                            "value": "x",
                                            line: 1
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            ],
            possiblePaths:[],
        }
    },
    mounted: function () {
        // this.runTests();
        let asts = [];
        for(let v of this.validMori){
            
            let tokens = this.$parent.tokenize(v);
            this.parsed.push(tokens);
            let ast = this.$parent.parse(tokens);
            asts.push(ast);
        }
        console.log(asts);
        console.log(this.parsed);
        const transitions = {};
        const transitionExamples = {};

        for (const seq of this.parsed) {
            for (let i = 0; i < seq.length - 1; i++) {
                const a = seq[i].type;
                const b = seq[i + 1].type;

                if (!transitions[a]) {
                    transitions[a] = new Set();
                    transitionExamples[a] = [];
                }
                transitions[a].add(b);
                transitionExamples[a].push(seq[i + 1]);
            }
        }
        // console.log(transitions);
        // console.log(transitionExamples);

        const textarea = document.querySelector('#code-text-area');
        const lineNumbersEle = document.querySelector('#line-numbers');
        const styles = window.getComputedStyle(textarea);
        ['fontFamily', 'fontSize', 'lineHeight'].forEach((prop) => {
            lineNumbersEle.style[prop] = styles[prop];
        });
    },
    methods: {
        inspect() {
            this.tokens = this.$parent.tokenize(this.testCode);
            this.ast = this.$parent.parse(this.tokens);
            this.env = this.$parent.evaluate(this.ast, false);
            // console.log(this.env);
            // console.log(this.ast)
            this.isInspecting = true;
        },
        endInspect() {
            this.isInspecting = false;
        },
        getLineNumbers() {
            const lines = this.testCode.split('\n');
            const result = [];

            const textarea = document.querySelector('#code-text-area');
            if (!textarea) {
                return [0];
            }

            const scrollTop = this.scrollTop;
            const style = getComputedStyle(textarea);
            const lineHeight = parseFloat(style.lineHeight);

            let visibleCount = parseFloat(style.height) / lineHeight;
            let linesToSkip = scrollTop / 24;
            let i = Math.floor(linesToSkip);
            for (let line of lines) {
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
                    // console.log(test.name + ': passed');
                }
                else {
                    console.log(test.name + ': failed: ', output);
                }
            }
        },
        scrollCheck() {
            const textarea = document.querySelector('#code-text-area');
            if (!textarea) {
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

        updateHeight() {
            this.height = '';
            let codeArea = document.getElementById('code-text-area');
            if (codeArea && codeArea.style) {
                this.height = codeArea.style.height;
            }
            else {
                this.height = '500px';
            }
            console.log("Updated height");
        },
        getNumberLineOffsetStyle() {
            return `margin-top:-${this.scrollTop % 24 + 5}px; height:${this.height}`;
        },
        addToDailyLaws() {
            this.$parent.addToDailyLaws(this.testCode);
        },
        clearLog() {
            this.errors = [];
            this.$parent.consoleOutputs = [];
        },
        getTokenInfo(token) {
            for (let item of this.ast) {
                // console.log(item);
            }
            if (typeof this.env[token.value] != 'undefined') {
                console.log(this.env, this.env[token.value], token, token.value);

                return 'This is currently ' + this.env[token.value];
            }
            return token;
        }
    },
    delimiters: ['[[', ']]'],
    template: `
    <div>
        <h4 class="my-2">Laws</h4>
        <div>
            <button class="btn btn-primary m-2" @click="testTheCode()">Test</button>
            <button class="btn btn-primary m-2" @click="addToDailyLaws()">Run Daily</button>
            <button class="btn btn-primary m-2" @click="clearLog()">Clear Log</button>
            <button class="btn btn-primary m-2" @click="inspect()">Inspect</button>
            <button class="btn btn-primary m-2" @click="endInspect()">End Inspecting</button>
        </div>
        <div class="d-flex" style="    overflow: hidden;">
            <div class="line-numbers" ref="lineNumbersEle" id="line-numbers" :style="getNumberLineOffsetStyle()">
                <div v-for="(num, idx) in getLineNumbers()" :key="idx">
                    [[ num !== '' ? num + 1 : '\u00A0' ]]
                </div>
            </div>
            <textarea v-if="!isInspecting" class="code-text-area" style="width:100%" @scroll="scrollCheck" @input="getLineNumbers" v-on:resize="updateHeight()" v-model="testCode" id="code-text-area"></textarea>
            
        </div>
        <div class="d-flex" style="flex-wrap:wrap" v-if="isInspecting">
            <template v-for="token in tokens">
                <div class="mx-1" v-if="token.type != 'NEWLINE'">
                    <tooltipwrapper :text="getTokenInfo(token)" :vm="$parent">
                        [[token.value]]
                    </tooltipwrapper>
                </div>
                <div v-else style="width:100%">
                    <br/>
                </div>
            </template>
                
            </div>
        <div>
            <div v-for="error in errors">[[error.id.message]]</div>
            <div v-for="output in $parent.consoleOutputs">[[output]]</div>
        </div>
    </div>
    
    `
}

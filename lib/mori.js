import pluralize from './pluralize.js';

const Mori = {
    verbose: false,

    vueApp: null,

    parser: {
        i: 0,
        tokens: [],
        ast: [],
    },

    initialize(vue) {
        this.vueApp = vue;
    },

    evaluate(ast, tokens, act = true) {
        this.vueApp.consoleOutputs = [];
        let env = this.vueApp.getEnvironment();
        env['__TOKENS__'] = tokens;
        if (act) {
            //console.log(env);
            for (const node of ast) {
                this.evalNode(node, env);
            }
        }

        return env;
    },

    evalNode(node, env) {
        if (!node) {
            console.error('Node was null', env);
        }
        if (!env) {
            console.error("You forgot to pass in the env......");
        }
        switch (node.type) {
            case 'Program':
                for (const stmt of node.body) {
                    this.evalNode(stmt, env);
                }
                break;

            case 'Dot':
                break;

            case 'SyntaxError':
                if (env['Errors']) {
                    env['Errors'].push(node);
                }
                else {
                    env['Errors'] = [node];
                }
                break;

            case 'Evaluatable':
                let left = this.evalNode(node.lhs, env);
                if (this.verbose) {
                    console.log(node, 'evald to : ', left);
                }
                //If left is undefined, we have a variable that was never assigned.
                if (typeof left === 'undefined') {
                    this.vueApp.consoleOutputs.push(`Our scribes were surprised to see '${node.lhs.lhs.value}' on line ${node.lhs.lhs.line}. They were not sure what you meant when you wrote it.`);
                    return;
                }
                if (left.type == "Expression" && node.op == null) {
                    return this.evalNode(left, env);
                }
                if (node.op == null) {
                    return left;
                }
                let right = this.evalNode(node.rhs, env);

                let conditionResult = false;

                let greaterThanRegex = /((?:is|are)* *(?:greater|more) *(?:than)*)/;
                let greaterThanMatch = greaterThanRegex.exec(node.op.value);
                let lessThanRegex = /((?:is|are)* *(?:less|fewer) *(?:than)*)/;
                let lessThanMatch = lessThanRegex.exec(node.op.value);
                let isEqualRegex = /((?:is|are)+ *(?:equal|the same as)+ *(?:to|with)*)/;
                let isEqualMatch = isEqualRegex.exec(node.op.value);
                let orEqualRegex = /((?:or equal )+ *(?:to|with)*)/;
                let orEqualMatch = orEqualRegex.exec(node.op.value);
                //First we check if the value is an exact match to any of the three regexes.
                if (greaterThanMatch && orEqualMatch) {
                    conditionResult = left >= right;
                }
                else if (greaterThanMatch) {
                    conditionResult = left > right;
                }
                else if (lessThanMatch && orEqualMatch) {
                    conditionResult = left <= right;
                }
                else if (lessThanMatch) {
                    conditionResult = left < right;
                }
                else if (isEqualMatch) {
                    conditionResult = left == right;
                }
                else {
                    if (node.op.value.startsWith('is') && node.op.value != 'is') {
                        node.op.value = node.op.value.substring(3);
                    }
                    switch (node.op.value) {
                        case 'and':
                            conditionResult = left && right;
                            break;
                        case 'or':
                            conditionResult = left || (right ? right : false);
                            break;
                        case '>':
                            conditionResult = left > right;
                            break;
                        case '>=':
                            conditionResult = left >= right;
                            break;
                        case '<=':
                            conditionResult = left <= right;
                            break;
                        case '<':
                            conditionResult = left < right;
                            break;
                        case '==':
                            conditionResult = left == right;
                            break;
                        case 'is':
                            conditionResult = left == right;
                            break;
                        case 'are':
                            conditionResult = left == right;
                            break;
                        case '=':
                            conditionResult = left == right;
                            break;
                    }
                }

                if (conditionResult && node.action) {
                    return this.evalNode(node.action, env);
                }
                if (!conditionResult && node.action?.elseAction) {
                    return this.evalNode(node.action.elseAction, env);
                }
                if (!conditionResult && node.elseAction) {
                    return this.evalNode(node.elseAction, env);
                }
                else if (!conditionResult && node.action?.action) {
                    this.vueApp.consoleOutputs.push(`Line ${node.action.action.line}: The people did not ${node.action.action.value} because your specified conditions were not met.`);
                }
                return conditionResult;

            case 'Assignment':
                if (this.verbose) {
                    console.log("Assigning...", node);
                }
                if (this.vueApp.isReservedName(node.id.name)) {
                    console.log("Invalid assignment");
                }
                if (node.init.type == "Expression") {
                    let value = this.evalNode(node.init.value, env);
                    env[node.id.name] = value;
                }
                else if (node.init.type == "Evaluatable") {
                    let value = this.evalNode(node.init.value, env);
                    env[node.id.name] = value;
                }
                else if (node.init.type == "Number") {
                    let value = node.init.value;
                    if (value.type == "Evaluatable") {
                        value = this.evalNode(value, env);
                    }
                    if (this.verbose) {
                        console.log("Setting value", value);
                    }
                    env[node.id.name] = value;
                }
                else if (node.init.type == "Identifier") {
                    env[node.id.name] = env[node.init.name];
                }
                if (this.verbose) {
                    console.log(env);
                }
                break;

            case 'Action':
                if (node.condition) {
                    if (!this.evalNode(node.condition, env)) {
                        return;
                    }
                }
                if (node.untilClause) {
                    if (this.evalNode(node.untilClause, env)) {
                        return;
                    }
                }
                if (node.action.value == 'hire' || node.action.value == 'fire' || node.action.value == 'relocate') {
                    if (!node.target) {
                        //Gotta get the antecedent token
                        let anyAntecedentFound = false;
                        for (let token of env['__TOKENS__']) {
                            if (token.type == "IDENT" && this.vueApp.professionReservedNames.has(token.value.toLowerCase())) {
                                if (anyAntecedentFound) {
                                    //We have two possible antecedents and cannot continue, throw an error
                                    console.error("TWO ANTECEDENTS OH NOOO", node);
                                    this.vueApp.consoleOutputs.push(`Line ${node.action.line}: Our scribes were not sure which of the antecedents in this command you were referring to, ${node.target.value} or ${token.value}.`);
                                    return;
                                }
                                node.target = {
                                    value: token.value
                                }

                                anyAntecedentFound = true;
                            }
                        }
                    }

                    let prof = this.vueApp.sanitizeProfName(node.target.value);

                    let outputProfName = prof.Name;
                    let amount = 0;
                    if (node.amount.type == "Expression") {
                        amount = this.evalNode(node.amount, env);
                    } else {
                        amount = parseFloat(node.amount);
                    }

                    if (amount != 1) {
                        outputProfName = pluralize.plural(outputProfName);
                    }
                    let actual = 0;
                    if (node.action.value == 'hire') {
                        actual = this.vueApp.hire(prof, amount);
                    }
                    else if (node.action.value == 'relocate') {
                        let relocTarget = this.vueApp.sanitizeProfName(node.relocateTarget.value);
                        actual = this.fire(prof, amount);
                        this.vueApp.hire(relocTarget, actual);
                    }
                    else {
                        actual = this.fire(prof, amount);
                    }

                    if (actual == amount) {
                        this.vueApp.consoleOutputs.push(`${node.action.value}d ${amount} ${outputProfName}.`);
                    }
                    else if (actual > 0) {
                        this.vueApp.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputProfName}, but we were only able to ${node.action.value} ${actual}.`);
                    }
                    else {
                        this.vueApp.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputProfName}, but we don't have the resources.`);
                    }
                }

                if (node.action.value == 'build' || node.action.value == 'demolish') {
                    if (this.verbose) {
                        console.log(node.action.value, "because node", node);
                    }
                    if (!node.target) {
                        //Gotta get the antecedent token
                        let anyAntecedentFound = false;
                        for (let token of env['__TOKENS__']) {
                            if (token.type == "IDENT" && this.vueApp.buildingReservedNames.has(token.value.toLowerCase())) {
                                if (anyAntecedentFound) {
                                    //We have two possible antecedents and cannot continue, throw an error
                                    console.error("TWO ANTECEDENTS OH NOOO", node);
                                    this.vueApp.consoleOutputs.push(`Line ${node.action.line}: Our scribes were not sure which of the antecedents in this command you were referring to, ${node.target.value} or ${token.value}.`);
                                    return;
                                }
                                node.target = {
                                    value: token.value
                                }

                                anyAntecedentFound = true;
                            }
                        }
                    }
                    let building = pluralize.singular(node.target.value);
                    let outputBuildingName = node.target.value;
                    let amount = 0;
                    if (node.amount.type == "Expression") {
                        amount = this.evalNode(node.amount, env);
                    } else {
                        amount = parseFloat(node.amount);
                    }

                    if (amount != 1) {
                        outputBuildingName = pluralize.plural(outputBuildingName);
                    }
                    let actual = 0;
                    if (node.action.value == "build") {
                        actual = this.vueApp.buildBuilding({ Name: building }, amount);
                    }
                    else if (node.action.value == "demolish") {
                        actual = this.vueApp.demolishBuilding({ Name: building }, amount);
                    }

                    if (actual == amount) {
                        this.vueApp.consoleOutputs.push(`${node.action.value == "build" ? 'Built' : 'Demolished'} ${amount} ${outputBuildingName}.`);
                    }
                    else if (actual > 0) {
                        this.vueApp.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputBuildingName}, but we were only able to ${node.action.value} ${actual}.`);
                    }
                    else {
                        this.vueApp.consoleOutputs.push(`Tried to ${node.action.value} ${amount} ${outputBuildingName}, but we don't have the materials.`);
                    }
                }
                break;
            case 'Print':
                if (this.verbose) {
                    console.log(node);
                }
                if (node.output.type == 'STRING') {
                    this.vueApp.consoleOutputs.push('Line ' + node.line + ': ' + node.output.value.slice(1, -1));
                    break;
                }
                let num = null;
                if (node.output.type == "Expression") {
                    num = this.evalNode(node.output, env);
                }
                else if (node.output.type == "Evaluatable") {
                    num = this.evalNode(node.output, env);
                }
                else {
                    num = parseFloat(node.output.value);
                }

                if (num !== null) {
                    this.vueApp.consoleOutputs.push('Line ' + node.line + ': ' + num);
                }
                else {
                    let value = env[node.output.value];
                    if (typeof value == 'undefined') {
                        this.vueApp.consoleOutputs.push('Line ' + node.line + ': ' + node.output.value + ` has not been referenced before this point. If you just want to print the word ${node.output.value} our scribes request you put it inside of quotation marks like '${node.output.value}' or "".`);

                    }
                    else {
                        this.vueApp.consoleOutputs.push('Line ' + node.line + ': ' + node.output.value + ' is ' + value + '.');

                    }
                    if (this.verbose) {
                        console.log(node, env[node.output.value], env);
                    }
                }

                break;

            case 'Identifier':
                if (!(node.identifier in env)) {
                    console.error(node);
                }
                return env[node.identifier];

            case 'NumberLiteral':
                return node.value;

            case 'BooleanOperator':
                let leftHand = this.evalNode(node.lhs, env);
                let rightHand = this.evalNode(node.rhs, env);

                let truthiness = false;
                if (node.value.type == 'AND') {
                    truthiness = leftHand && rightHand;
                }
                else if (node.value.type == 'OR') {
                    truthiness = leftHand || rightHand;
                }
                else if (node.value.type == 'NOT') {
                    truthiness = !(leftHand && rightHand);
                }
                else if (node.value.type == 'XOR') {
                    truthiness = (leftHand == true && rightHand == false) || (leftHand == false && rightHand == true);
                }
                if (truthiness) {
                    if (node.action) {
                        return this.evalNode(node.action, env);
                    }
                    return true;
                }
                return false;

            case 'IDENT':
                if (this.verbose) {
                    console.log(env, node.value, env[node.value]);
                }
                return env[node.value];
            case 'NUMBER':
                return parseFloat(node.value);
            case 'Expression':
                if (this.verbose) {
                    console.log("Begin parse Expression:", node);
                }

                if (!node.op) {
                    //This expression is probably just a value.
                    //current problem is you can get here with an expresssion that has a value and one that has not value layer.
                    if (this.verbose) {
                        console.log("NO op in this expression:", node);
                    }
                    return this.evalNode(node.lhs, env);
                }

                let leftValue = 0;
                let rightValue = 0;
                if (node.lhs.type == "NUMBER") {
                    leftValue = parseFloat(node.lhs.value);
                }
                else {
                    leftValue = this.evalNode(node.lhs, env);
                }

                if (node.rhs.type == "NUMBER") {
                    rightValue = parseFloat(node.rhs.value);
                }
                else {
                    rightValue = this.evalNode(node.rhs, env);
                }

                switch (node.op.value) {
                    case '+': return leftValue + rightValue;
                    case '-': return leftValue - rightValue;
                    case '*': return leftValue * rightValue;
                    case '/': return leftValue / rightValue;
                    case '%': return leftValue % rightValue;
                    default: console.error(`Unknown operator: ${node.op}`);
                }

            default:
                console.error(`Unknown node type: ${node.type} ${JSON.stringify(node)}`);
        }
    },

    getSyntaxErrorFromToken(token) {
        let name = token.value;
        if (this.vueApp.professionReservedNames.has(name)) {
            return `Our scribes are confused by your law. Our people cannot make ${pluralize.plural(name)} by magic. On line ${token.line} we wonder if you meant to hire or fire more ${pluralize.plural(name)}? ${name.charAt(0).toUpperCase() + name.slice(1)} is a special word that always refers to our people with the profession of ${name}.`;
        }
        else if (this.vueApp.currencyReservedNames.has(name)) {
            return `Our scribes are confused by your law. On line ${token.line} we wonder if you forgot an 'if' by the word '${name}'? ${name.charAt(0).toUpperCase() + name.slice(1)} is a special word that always refers to our people's ${name}.`;
        }
        else if (this.vueApp.isReservedName(name)) {
            return `
        Our scribes fear your law may be difficult to understand. 
        On line ${token.line} your reference to '${name}' makes us think of something else. 
        Trying to say it is something else is unclear. 
        It may need a different name.`;
        }
        return `Unknown Syntax error: line ${token.line}, ${token.value}`;
    },

    parseInputString(input, runCode = false){
        let tokens = this.tokenize(input);
        let ast = this.parse(tokens);
        if(runCode){
            this.evaluate(ast, tokens, true);
            return;
        }
        return ast;
    },

    parse(tokens) {
        const ast = [];
        this.parser.i = 0;
        this.parser.tokens = tokens;

        while (this.parser.i < this.parser.tokens.length) {
            ast.push(this.parsePrimary())

            if (this.peek().type == 'DOT') {
                this.parser.i++;
            }
            if (this.peek().type == 'EOF') {
                this.parser.i++;
            }
        }
        this.parser.ast = ast;
        if (this.verbose) {
            console.log(tokens);
            console.log(ast);
        }
        return ast;
    },

    parsePrimary() {
        const token = this.peek();
        if (token.type == 'IDENT') {
            return this.parseIdent();
        }
        else if (token.type == 'CONDITIONAL') {
            return this.parseConditional();
        }
        else if (token.type == "ACTION") {
            return this.parseAction();
        }
        else if (token.type == 'PRINT') {
            return this.parsePrint();
        }
        else if (token.type == 'DOT') {
            return this.parseDot();
        }
        else {
            //Always advance on syntax errors.
            this.parser.i++;
        }
    },

    parseDot() {
        this.parser.i++;
        return { type: 'Dot' }
    },

    parsePrint() {
        let printCommand = this.next();
        let output = this.peek();
        let outputid = output.id;
        if (output.type == "NUMBER" || output.type == "IDENT") {
            output = this.parseEvaluatable();
        }
        else if (output.type == "STRING") {
            this.consume();
        }

        let optionalConditional = this.peek();
        let conditional = null;
        if (optionalConditional.type == "CONDITIONAL") {
            conditional = this.parseConditional();
        }

        return {
            type: 'Print',
            output: output,
            line: printCommand.line,
            tokenid: outputid,
            conditional: conditional
        }
    },

    throwSyntaxError(id, name, message, tokenid = -1) {
        this.parser.i += 10000;
        return {
            type: 'SyntaxError',
            id: {
                type: id,
                name,
                message: message
            },
            tokenid: tokenid

        };
    },

    parseIdent() {
        let ident = this.next();
        let name = ident.value;

        let next = this.peek();
        if (next.type == "ASSIGN") {
            //Simple assignment.
            //Not valid to assign a reserved keyword
            if (this.vueApp.isReservedName(name)) {
                return this.throwSyntaxError('Identifier', name, this.getSyntaxErrorFromToken(ident), ident.id);
            }
            this.consume();
            let rhs = this.parseEvaluatable();
            return {
                type: "Assignment",
                init: {
                    type: "Number",
                    value: rhs
                },
                id: {
                    type: "Identifier",
                    name
                }
            }
        }
        else if (next.type == "COMPARATOR") {
            return {

            }
        }
    },

    parseAction() {
        //Hire, fire, or build
        let action = this.next();
        //Actions can be followed by identities or numbers.
        let next = this.peek();
        let target = null;
        let amount = 1;
        //Hire Y
        //Hire Farmer
        if (next.type == 'IDENT') {
            //IDENT is either a value or a reference to a population type.
            //If an identity follows a number, it references the type of population. Otherwise it references the amount of population.
            //In this case, we should always assume it's the direct object, a target of what we are trying to do.


            //This identity could either be a variable or the target you wanna grab. Maybe
            //The smart thing to do is check if the ident is a reserved keyword or not
            //TODO:check if its a reserved keyword. If it is, do this
            //Otherwise we might have an expression here
            //Assume the target is this identity
            //Hire farmer
            if (this.vueApp.isReservedName(next.value)) {
                if (this.verbose) {
                    console.log("Using reserved keyword", next.value);
                }
                target = next;
                this.consume();
            }
            else {
                if (this.verbose) {
                    console.log("Identity is not reserved:", next.value);
                }
                amount = this.parseExpression();
            }

            //Hire Y ___
            next = this.peek();

            if (next.type == "THEN") {
                //THEN is only valid inside a conditional
                //Hire farmer then
                //Syntax error
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "THAN") {
                //THAN is only valid inside a comparison
                //Hire farmer than
                //Syntax error
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "ARITHMETIC") {
                //Hire farmer +
                //We have an equation to solve for the amount
                //At this point it's too late, I should have already done the math somewhere else. if We have a +, 
                // It will try to parse the expression with lhs as + and it will make no sense.
                let amount = this.parseExpression();
                //Hire farmer + 7 farmers
                let target = this.peek();
                if (target.type != 'IDENT') {
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }
                this.consume();
                let optionalTo = this.peek();
                if (optionalTo.type == 'TO') {
                    this.consume();
                    let relocateTarget = this.peek();
                    if (relocateTarget.type == 'IDENT') {
                        this.consume();
                        return {
                            type: "Action",
                            action: action,
                            target: target,
                            amount: amount,
                            tokenid: action.id,
                            relocateTarget: relocateTarget
                        }
                    }
                    else {
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                }
                return {
                    type: "Action",
                    action: action,
                    target: target,
                    amount: amount,
                    tokenid: action.id
                }
            }

            if (next.type == "PRINT") {
                //PRINT can only be the main action or an otherwise or result of an evaluatable
                //Hire farmer print
                //Syntax error
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "ASSIGN") {
                //ASSIGN can only be the main action or an otherwise or result of an evaluatable
                //Hire farmer print
                //Syntax error
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "ELSE") {
                //If there are 8 farmers hire y farmers else print 'nope'
                //Syntax error
                this.consume();
                next = this.peek();
                if (next.type == "ACTION") {
                    let elseAction = this.parseAction();
                    return {
                        type: "Action",
                        action: action,
                        target: target,
                        amount: amount,
                        elseAction: elseAction,
                        tokenid: action.id
                    }
                }
                else if (next.type == "PRINT") {
                    let elseAction = this.parsePrint();
                    return {
                        type: "Action",
                        action: action,
                        target: target,
                        amount: amount,
                        elseAction: elseAction,
                        tokenid: action.id
                    }
                }


            }

            if (next.type == 'DOT') {
                //We are done. Hire Y Farmers.
                return {
                    type: "Action",
                    action: action,
                    target: target,
                    amount: amount,
                    tokenid: action.id
                }
            }

            if (next.type == "UNTIL") {
                let untilClause = this.parseUntil();
                return {
                    type: "Action",
                    action: action,
                    target: target,
                    amount: amount,
                    untilClause: untilClause,
                    tokenid: action.id
                }
            }

            if (next.type == "CONDITIONAL") {
                let conditionalClause = this.parseConditional();
                return {
                    type: "Action",
                    action: action,
                    target: target,
                    amount: amount,
                    condition: conditionalClause,
                    tokenid: action.id
                }
            }

            if (next.type == "IDENT") {
                //Hire Y farmers.
                target = next;
                this.consume();
                let optionalTo = this.peek();
                if (optionalTo.type == 'TO') {
                    this.consume();
                    let relocateTarget = this.peek();
                    if (relocateTarget.type == 'IDENT') {
                        this.consume();
                        return {
                            type: "Action",
                            action: action,
                            target: target,
                            amount: amount,
                            tokenid: action.id,
                            relocateTarget: relocateTarget
                        }
                    }
                    else {
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                }
                return {
                    type: "Action",
                    action: action,
                    target: next,
                    amount: amount,
                    tokenid: action.id
                }
            }

            if (next.type == "COMPARATOR") {
                //Hire Y > 
                //Syntax error
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "ACTION") {
                //Hire Y Fire
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }


            //Identities can be followed by almost anything normally.

        }
        else if (next.type == 'NUMBER') {
            //Hire 7
            next = this.parseExpression();
            amount = next;
            next = this.peek();
            if (next.type == "IDENT") {
                //Hire 7 Farmers
                this.consume();
                let optionalUntil = this.peek();
                if (optionalUntil.type == "UNTIL") {
                    let untilClause = this.parseUntil();
                    return {
                        type: "Action",
                        action: action,
                        target: next,
                        amount: amount,
                        untilClause: untilClause,
                        tokenid: action.id
                    }
                }
                let optionalTo = this.peek();
                if (optionalTo.type == 'TO') {
                    this.consume();
                    let relocateTarget = this.peek();
                    if (relocateTarget.type == 'IDENT') {
                        this.consume();
                        return {
                            type: "Action",
                            action: action,
                            target: next,
                            amount: amount,
                            tokenid: action.id,
                            relocateTarget: relocateTarget
                        }
                    }
                    else {
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                }
                return {
                    type: "Action",
                    action: action,
                    target: next,
                    amount: amount,
                    tokenid: action.id
                }
            }

            if (next.type == "DOT") {
                //Hire 7.
                //This is technically a syntax error but we can probably figure it out from context.
                return {
                    type: "Action",
                    action: action,
                    target: null,
                    amount: amount,
                    tokenid: action.id
                }
            }

            if (next.type == "UNTIL") {
                let untilClause = this.parseUntil();
                return {
                    type: "Action",
                    action: action,
                    target: target,
                    amount: amount,
                    untilClause: untilClause,
                    tokenid: action.id
                }
            }

            if (next.type == "AND") {
                //Hire 7 and
                //Syntax error.
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "COMPARATOR") {
                //Hire 7 >
                //Syntax error.
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "THEN") {
                //Hire 7 then
                //Syntax error.
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "ASSIGN") {
                //Hire 7 =
                //Syntax error.
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "CONDITIONAL") {
                //Hire 7 if
                //Syntax error.
                let error = this.getSyntaxErrorFromToken(next);
                return error;
            }

            if (next.type == "ARITHMETIC") {
                //Hire 7 +
                //Time to do math
                amount = this.parseExpression();
                let target = this.peek();
                if (target.type != 'IDENT') {
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }
                this.consume();
                let optionalTo = this.peek();
                if (optionalTo.type == 'TO') {
                    this.consume();
                    let relocateTarget = this.peek();
                    if (relocateTarget.type == 'IDENT') {
                        this.consume();
                        return {
                            type: "Action",
                            action: action,
                            target: target,
                            amount: amount,
                            tokenid: action.id,
                            relocateTarget: relocateTarget
                        }
                    }
                    else {
                        let error = this.getSyntaxErrorFromToken(next);
                        return error;
                    }
                }
                return {
                    type: "Action",
                    action: action,
                    target: target,
                    amount: amount,
                    tokenid: action.id
                }
            }

        }
        else {
            //Hire (Anything but NUMBER or IDENT)
            //Syntax error.
            let error = this.getSyntaxErrorFromToken(next);
            return error;
        }

        return {
            "type": "Action",
            action: action,
            target: target,
            amount: amount,
            tokenid: action.id
        }
    },

    parseNumber() {
        let value = this.next();
        return {
            type: "Number",
            value,
        }
    },

    parseExpression() {
        //3 + 7 - farmers > x + 1 / 4

        //3
        let lhs = this.next();
        let rhs = null;
        let op = null;
        let value = null;

        let safety = 1000;
        let iterator = 0;
        while (iterator < safety) {
            iterator++;

            if (value) {
                lhs = value;
            }
            op = this.peek();
            // 3.
            // Either this command is done, 
            // or this expression will be compared somehow, 
            // or this expression is the second half of a comparison and will be followed up with an action
            // so we end.
            let endOfCommand = op.type == "DOT" ||
                op.type == 'EOF' ||
                op.type == 'COMPARATOR' ||
                op.type == 'ACTION' ||
                op.type == 'AND' ||
                op.type == 'OR' ||
                op.type == 'XOR' ||
                op.type == "THEN" ||
                op.type == "PRINT" ||
                op.type == "ELSE" ||
                op.type == "CONDITIONAL" ||
                op.type == "THAN";
            // 3 + 
            let isArithmetic = op.type == "ARITHMETIC";

            if (op.type == 'IDENT' || op.type == "NUMBER" || endOfCommand) {
                //could be something like 
                //no homeless people
                // here we need to return an ident or a number

                if (!value) {
                    value = {
                        lhs: lhs,
                        rhs: null,
                        op: null,
                    }
                }
                break;
            }
            if (op.type == "ASSIGN") {
                //This has now changed from an expression to an evaluatable.
                //7 + 1 = 8 + y
                //I think we return an evaluatable, with the other half being another expression.
                if (!value) {
                    value = {
                        lhs: lhs,
                        rhs: null,
                        op: null,
                    }
                }
                this.consume();
                let leftExpression = {
                    type: "Expression",
                    tokenid: lhs.id || lhs.tokenid,
                    lhs: value.lhs,
                    op: value.op,
                    rhs: value.rhs,
                }
                let newOp = { type: "COMPARATOR", value: "==", id: op.id, line: op.line };
                return {
                    type: "Evaluatable",
                    lhs: leftExpression,
                    op: newOp,
                    rhs: this.parseExpression()
                }
            }
            else if (!isArithmetic) {
                //This could be the point where we hit something like
                //Hire farmers until there are 10.
                //Maybe I can pretend it's find and catch it later?

                let error = this.getSyntaxErrorFromToken(op);
                return error;
            }

            //always arthmetic at this point
            //3 +

            op = this.next();

            //Arithmetic only allows Ident and Number
            //3 + 7
            rhs = this.peek();

            let rhsIsValid = rhs.type == "IDENT" || rhs.type == "NUMBER";
            if (!rhsIsValid) {
                let error = this.getSyntaxErrorFromToken(rhs);
                return error;
            }
            rhs = this.next();
            //3 + 7
            //at this point, value is
            //lhs = 3
            //op = +
            //rhs = 7
            //If there is another round, we want lhs to be the value, then rhs is rhs and op is op
            value = {
                lhs: lhs,
                rhs: rhs,
                op: op,
                type: "Expression"
            }
        }

        if (iterator == safety) {
            console.error("Infinite Loop in parse expression");
        }
        return {
            type: "Expression",
            lhs: value.lhs,
            op: value.op,
            rhs: value.rhs,
        }
    },

    parseUntil() {
        let until = this.next();
        if (until.type != 'UNTIL') {
            console.error("Ran parse until but the token is not an until. Did you next when you meant to peek?");
        }
        let evaluatable = this.parseEvaluatable();
        let next = this.peek();
        while (next.type == "AND" || next.type == "OR" || next.type == "XOR") {
            next = this.next();

            let newEvaluatable = {
                lhs: evaluatable,
                op: next,
                rhs: this.parseEvaluatable(),
                type: "Evaluatable"
            }
            evaluatable = newEvaluatable;
        }
        return evaluatable;
    },

    parseEvaluatable() {
        //anything that will eventually evaluate to a true/false
        let operator = null;
        let rhs = null;
        let lhs = null;

        let next = this.peek();

        if (next.type == 'THERE_ARE') {
            let tokenid = next.id;
            this.consume();
            //First we check if we are comparing something, otherwise there are is an equality check
            //e.g. If there are more than 0 homeless vs if there are any farmers.
            //The former needs to be a > 0, the latter, = 0
            let optionalComparator = this.peek();
            if (optionalComparator.type == "COMPARATOR") {
                optionalComparator = this.next();
                operator = optionalComparator;
            }
            else if (optionalComparator.type == "MORE") {
                this.consume();
                operator = {
                    type: "COMPARATOR",
                    value: ">",
                    id: tokenid
                };
            }
            else if (optionalComparator.type == "LESS") {
                this.consume();
                operator = {
                    type: "COMPARATOR",
                    value: "<",
                    id: tokenid
                };
            }
            else {
                operator = {
                    type: "COMPARATOR",
                    value: "=",
                    id: tokenid
                };
            }

            //There are can be followed by a number, any, a comparator, or an identity

            //There are 7

            // There are two other possibilities if we find a THAN , either this is 
            // There are more than 7 farmers, or
            // There are more farmers than lumberjacks.
            // If the next word is than, we have the former.

            next = this.peek();

            if (next.type == "NUMBER") {
                //Could be an expression
                //There are 7( + 1 farmers)
                //Same as 7 + 1 == farmers
                lhs = this.parseExpression();

                //Until there are no homeless people
                //lhs is an expression,
                //op is known
                //rhs needs to be gotten
                next = this.peek();
                if (next.type == "THAN") {
                    this.consume();
                }
                rhs = this.parseExpression();
            }
            else if (next.type == "IDENT") {
                lhs = this.parseExpression();

                //Until there are no homeless people
                //lhs is an expression,
                //op is known
                //rhs needs to be gotten
                next = this.peek();
                if (next.type == "THAN") {
                    this.consume();
                }

                rhs = this.parseExpression();
            }
            else if (next.type == "ANY") {
                //We need to change the check from = to > 0
                //If there are any farmers
                //farmers > 0
                this.consume();
                next = this.peek();
                if (next.type != "IDENT") {
                    let error = this.getSyntaxErrorFromToken(next);
                    return error;
                }
                lhs = this.next();
                operator = {
                    type: "COMPARATOR",
                    value: ">",
                    id: next.id,
                    line: next.line,
                }
                rhs = {
                    id: next.id,
                    type: "NUMBER",
                    value: 0,
                    line: next.line,
                }
                return {
                    type: "Evaluatable",
                    lhs: lhs,
                    op: operator,
                    rhs: rhs
                }
            }
            else if (next.type == "THAN") {
                // There are more than 7 farmers
                // now we compare a evaluatables
                this.consume();
                lhs = this.parseExpression();
                rhs = this.parseExpression();
            }

            return {
                type: "Evaluatable",
                lhs: lhs,
                op: operator,
                rhs: rhs
            }

        }

        next = this.peek();

        if (next.type == "IDENT" || next.type == "NUMBER") {

            lhs = this.parseExpression();
            next = this.peek();
            //op should be in the middle
            if (next.type == "COMPARATOR") {
                operator = this.next();
            }
            next = this.peek();

            if (next.type == "IDENT" || next.type == "NUMBER") {
                rhs = this.parseExpression();
            }

            next = this.peek();
            if (next.type == "AND" || next.type == "OR" || next.type == "XOR") {
                this.consume();
                let currentEvaluatable = {
                    type: "Evaluatable",
                    lhs: lhs,
                    op: operator,
                    rhs: rhs
                }
                return {
                    type: "Evaluatable",
                    lhs: currentEvaluatable,
                    op: next,
                    rhs: this.parseEvaluatable()
                }
            }
        }

        return {
            type: "Evaluatable",
            lhs: lhs,
            op: operator,
            rhs: rhs
        }

    },

    parseConditional() {
        let ifWhenToken = this.next();
        if (ifWhenToken.type != 'CONDITIONAL') {
            console.error("Ran parse if but the token is not an if or when. Did you next when you meant to peek?");
        }
        let condition = this.parseEvaluatable();
        let next = this.peek();

        while (next.type == "AND" || next.type == "OR" || next.type == "XOR") {
            next = this.next();

            let newCondition = {
                lhs: condition,
                op: next,
                rhs: this.parseEvaluatable()
            }
            condition = newCondition;
            next = this.peek();
            if (next.type == 'THEN') {
                this.consume();

                break;
            }
        }
        next = this.peek();
        if (next.type == "THEN") {
            this.consume();
        }
        let optionalAction = this.peek();
        if (optionalAction.type == "ACTION") {
            condition.action = this.parseAction();
        }
        if (optionalAction.type == "PRINT") {
            condition.action = this.parsePrint();
        }
        let optionalElse = this.peek();
        if (optionalElse.type == "ELSE") {
            this.consume();
            let optionalElseAction = this.peek();
            if (optionalElseAction.type == "ACTION") {
                condition.elseAction = this.parseAction();
            }
            if (optionalElseAction.type == "PRINT") {
                condition.elseAction = this.parsePrint();
            }
        }
        condition.type = "Evaluatable";
        return condition;
    },

    tokenize(input) {
        const tokenSpec = [
            ['SKIP', /^,/],
            ['SKIP', /^[ \t\n]+/],
            ['SKIP', /^(a )\b/],
            ['NUMBER', /^\d+/],
            ['TEXT_NUMBER', /^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|quadrillion|quintillion)\b/i],
            ["TEXT_NUMBER", /^no\b/],
            ["TEXT_NUMBER", /^eleventyleven\b/],
            ['COMPARATOR', /^((?:is|are)* *(?:greater|more|less|fewer|equal) *(?:than)* *(?:or equal )* *(?:to|with)*)/i],
            ['COMPARATOR', /^(is the same as|are the same as)/i],
            ['COMPARATOR', /^(is >|is <|is <=|is >=|is =|is ==|are >|are <|are <=|are >=|are =|are ==|>=|<=|>|<|==)/],
            ['MORE', /^more/],
            ['LESS', /^less/],
            ['LESS', /^fewer/],
            ['THAN', /^than\b/],
            ['AND', /^and\b/],
            ['TO', /^to\b/],
            ['OR', /^or\b/],
            ['NOT', /^not\b/],
            ['XOR', /^xor\b/],
            ['ASSIGN', /^(is\b|=|are\b)/],
            ['STRING', /^"[^"]*"/],
            ['STRING', /^'[^']*'/],
            ['ARITHMETIC', /^\+/],
            ['ARITHMETIC', /^-/],
            ['ARITHMETIC', /^\*/],
            ['ARITHMETIC', /^\//],
            ['ARITHMETIC', /^%/],
            ['LPAREN', /^\(/],
            ['RPAREN', /^\)/],
            ['CONDITIONAL', /^(if|when)/],
            ['DOT', /^\./],
            ['THEN', /^then\b/],
            ['ANY', /^any\b/],
            ['NONE', /^none\b/],
            ['UNTIL', /^until\b/],
            ['ELSE', /^else\b/],
            ['ELSE', /^otherwise\b/],
            ['PRINT', /^print\b/],
            ['THERE_ARE', /^(there are|there is)\b/],
            ['IT_IS', /^it is\b/],
            ['ACTION', /^(hire|fire|build|demolish|relocate)\b/],
            ['IDENT', /^(construction worker|construction workers)\b/],
            ['IDENT', /^(homeless people|homeless person)\b/],
            ['IDENT', /^(unemployed people)\b/],
            ['IDENT', /^(large (?:hut|huts))\b/],
            ['IDENT', /^(available housing)\b/],
            ['IDENT', /^(total housing)\b/],
            ['IDENT', /^(total population)\b/],
            ['IDENT', /^(current population)\b/],
            ['IDENT', /^[a-zA-Z_]\w*\s*(consumption|production)/],
            ['IDENT', /^[a-zA-Z_]\w*/],

        ];


        const tokens = [];
        let remaining = input;
        let line = 1;
        let id = 0;
        let lastWasTextNumber = false;
        let textNum = "";

        while (remaining.length > 0) {
            let matched = false;

            for (let [type, regex] of tokenSpec) {
                let lowerForMatching = remaining.toLowerCase();
                const match = regex.exec(lowerForMatching);
                if (match) {
                    matched = true;

                    let start = match.index;
                    let end = start + match[0].length;

                    let raw = remaining.slice(start, end);

                    let text = type == "STRING" ? raw : raw.toLowerCase();
                    let inText = text;

                    if (type == 'SKIP') {
                        var newlines = (text.match(/\n/g) || []).length;
                        line += newlines;
                        remaining = remaining.slice(text.length);
                        continue;
                    }
                    if (type == "TEXT_NUMBER" && !lastWasTextNumber) {
                        textNum = inText + ' ';
                        type = "NUMBER";
                        lastWasTextNumber = true;
                    }
                    else if (type == "TEXT_NUMBER" && lastWasTextNumber) {
                        textNum += inText + ' ';
                        lastWasTextNumber = true;
                        type = "NUMBER";
                    }
                    else if (type != "TEXT_NUMBER" && lastWasTextNumber) {
                        //Get whatever the number was as a number token
                        let numToken = this.textNumberToNumber(textNum);
                        tokens.push({ type: "NUMBER", value: numToken, line: line, id: id });
                        lastWasTextNumber = false;
                        textNum = "";
                        if (type !== 'SKIP') {
                            tokens.push({ type, value: inText, line: line, id: id });
                            id++;
                        }
                    }
                    else {
                        lastWasTextNumber = false;

                        if (type !== 'SKIP') {
                            tokens.push({ type, value: inText, line: line, id: id });
                            id++;
                        }
                    }
                    var newlines = (text.match(/\n/g) || []).length;
                    line += newlines;
                    remaining = remaining.slice(text.length);
                    break;
                }
            }

            if (!matched) {
                console.error(`Unexpected token: '${remaining[0]}'`);
                break;
            }
        }
        if (this.verbose) {
            console.log(tokens);
        }
        tokens.push({ type: 'EOF' });
        return tokens;
    },

    textNumberToNumber(text) {
        text = text.replace(/\s+$/, '');
        if (text == "") {
            return '';
        }
        if (text == "no" || text == "zero") {
            return "0";
        }
        if (text == "eleventyleven") {
            return 1111;
        }

        let numDict = {
            'one': [1, 1],
            'two': [2, 1],
            'three': [3, 1],
            'four': [4, 1],
            'five': [5, 1],
            'six': [6, 1],
            'seven': [7, 1],
            'eight': [8, 1],
            'nine': [9, 1],
            'ten': [10, 1],
            'eleven': [11, 1],
            'twelve': [12, 1],
            'thirteen': [13, 1],
            'fourteen': [14, 1],
            'fifteen': [15, 1],
            'sixteen': [16, 1],
            'seventeen': [17, 1],
            'eighteen': [18, 1],
            'nineteen': [19, 1],
            'twenty': [20, 1],
            'thirty': [30, 1],
            'forty': [40, 1],
            'fifty': [50, 1],
            'sixty': [60, 1],
            'seventy': [70, 1],
            'eighty': [80, 1],
            'ninety': [90, 1],
            'hundred': [0, 100],
            'thousand': [0, 1000],
            'million': [0, 1000000],
            'billion': [0, 1000000000],
            'trillion': [0, 1000000000000],
            'quadrillion': [0, 1000000000000000],
            'quintillion': [0, 1000000000000000000],
            'sextillion': [0, 1000000000000000000000],
            'septillion': [0, 1000000000000000000000000],
            'octillion': [0, 1000000000000000000000000000],
            'nonillion': [0, 1000000000000000000000000000000],
            'decillion': [0, 1000000000000000000000000000000000],
        }
        if (numDict[text]) {
            return numDict[text];
        }
        let numWords = text.split(' ');
        let current = 0;
        let result = 0;
        for (let word of numWords) {
            let num = numDict[word];
            if (!num) {
                console.error("somehow we got a non-number in the textNumberToNumber......");
            }
            current = current * num[1] + num[0];
            if (num[1] > 100) {
                result += current;
                current = 0;
            }
        }
        return result + current;

    },

    peek(offset = 0) {
        return this.parser.tokens[this.parser.i + offset] || {};
    },

    expect(type, offset = 0) {
        const token = this.peek(offset);
        if (token.type !== type) {
            throw new SyntaxError(`Expected ${type} at position ${this.parser.i + offset}, got ${token.type}`);
        }
        return token;
    },

    consume(count = 1) {
        this.parser.i += count;
    },

    next() {
        return this.parser.tokens[this.parser.i++];
    },
};

export default Mori;
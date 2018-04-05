const assert = require("assert");
const TreeModel = require("tree-model");
import {Node, WhileStatement} from "./schema";
import {GenLabel} from "./utils";
/**
 *  Coverts a node to a simplified series of nodes
 *  @param   node The node to convert(JS object)
 *  @return       An array of nodes repesenting the simplified construct
 */
function convertWhileStatement(node) {

    assert.ok(node.type=='WhileStatement');

    let ifGuard = {
        type: "LabeledStatement",
        body: {
            type: "IfGotoStatement",
            test: node.test,
            label: null
        },
        label: GenLabel()
    };
    let topGoto = {
        type: "GotoStatement",
        label: null
    }
    let body = {
        type: "LabeledStatement",
        label: GenLabel(),
        body: node.body
    }
    ifGuard.body.label = body.label;
    let endGoto = {
        type: "GotoStatement",
        label: ifGuard.label
    }
    let loopExit = {
        type: 'LabeledStatement',
        label: GenLabel(),
        body: {
            type: "EmptyStatement"
        }
    }

    return {
        type: "Sequence",
        statements: [ifGuard, topGoto, body, endGoto, loopExit]
    }
}

function convertAll(node) {
    if (node == null)
        return;

    let props = node.getOwnPropertyNames();
    props.forEach(prop => {
        let n = node[prop];
        if (typeof n !== null && (typeof n === 'object' || typeof n == 'array'))
            node[prop] = convertAll(node[prop]);
        }
    );

    switch (node.type) {
        case "WhileStatement":
            node = convertWhileStatement(node);
            break;
        case "ForStatement":
            node = convertWhileStatement(node);
            break;
        case "IfStatement":
            node = convertWhileStatement(node);
            break;
        case "ExpressionStatement":
            node = convertWhileStatement(node);
            break;
    }
}
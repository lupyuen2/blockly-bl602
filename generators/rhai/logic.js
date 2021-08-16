/**
 * @license
 * Copyright 2014 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rhai for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Rhai.logic');

goog.require('Blockly.Rhai');


Blockly.Rhai['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.Rhai.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.Rhai.injectId(Blockly.Rhai.STATEMENT_PREFIX, block);
  }
  do {
    conditionCode = Blockly.Rhai.valueToCode(block, 'IF' + n,
        Blockly.Rhai.ORDER_NONE) || 'false';
    branchCode = Blockly.Rhai.statementToCode(block, 'DO' + n);
    if (Blockly.Rhai.STATEMENT_SUFFIX) {
      branchCode = Blockly.Rhai.prefixLines(
          Blockly.Rhai.injectId(Blockly.Rhai.STATEMENT_SUFFIX, block),
          Blockly.Rhai.INDENT) + branchCode;
    }
    code += (n > 0 ? 'else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.Rhai.STATEMENT_SUFFIX) {
    branchCode = Blockly.Rhai.statementToCode(block, 'ELSE');
    if (Blockly.Rhai.STATEMENT_SUFFIX) {
      branchCode = Blockly.Rhai.prefixLines(
          Blockly.Rhai.injectId(Blockly.Rhai.STATEMENT_SUFFIX, block),
          Blockly.Rhai.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.Rhai['controls_ifelse'] = Blockly.Rhai['controls_if'];

Blockly.Rhai['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Rhai.ORDER_EQUALITY : Blockly.Rhai.ORDER_RELATIONAL;
  var argument0 = Blockly.Rhai.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Rhai.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Rhai['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Rhai.ORDER_LOGICAL_AND :
      Blockly.Rhai.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Rhai.valueToCode(block, 'A', order);
  var argument1 = Blockly.Rhai.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Rhai['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Rhai.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.Rhai.valueToCode(block, 'BOOL', order) || 'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Rhai['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Rhai.ORDER_ATOMIC];
};

Blockly.Rhai['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Rhai.ORDER_ATOMIC];
};

Blockly.Rhai['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Rhai.valueToCode(block, 'IF',
      Blockly.Rhai.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Rhai.valueToCode(block, 'THEN',
      Blockly.Rhai.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Rhai.valueToCode(block, 'ELSE',
      Blockly.Rhai.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Rhai.ORDER_CONDITIONAL];
};

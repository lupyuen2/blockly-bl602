/**
 * @license
 * Copyright 2014 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rhai for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Rhai.procedures');

goog.require('Blockly.Rhai');


Blockly.Rhai['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Rhai.nameDB_.getName(block.getFieldValue('NAME'),
      Blockly.PROCEDURE_CATEGORY_NAME);
  var xfix1 = '';
  if (Blockly.Rhai.STATEMENT_PREFIX) {
    xfix1 += Blockly.Rhai.injectId(Blockly.Rhai.STATEMENT_PREFIX, block);
  }
  if (Blockly.Rhai.STATEMENT_SUFFIX) {
    xfix1 += Blockly.Rhai.injectId(Blockly.Rhai.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Blockly.Rhai.prefixLines(xfix1, Blockly.Rhai.INDENT);
  }
  var loopTrap = '';
  if (Blockly.Rhai.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.Rhai.prefixLines(
        Blockly.Rhai.injectId(Blockly.Rhai.INFINITE_LOOP_TRAP, block),
        Blockly.Rhai.INDENT);
  }
  var branch = Blockly.Rhai.statementToCode(block, 'STACK');
  var returnValue = Blockly.Rhai.valueToCode(block, 'RETURN',
      Blockly.Rhai.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.Rhai.INDENT + 'return ' + returnValue + ';\n';
  }
  var returnType = returnValue ? 'dynamic' : 'void';
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.Rhai.nameDB_.getName(variables[i],
        Blockly.VARIABLE_CATEGORY_NAME);
  }
  var code = returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.Rhai.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Rhai.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Rhai['procedures_defnoreturn'] = Blockly.Rhai['procedures_defreturn'];

Blockly.Rhai['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Rhai.nameDB_.getName(block.getFieldValue('NAME'),
      Blockly.PROCEDURE_CATEGORY_NAME);
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.Rhai.valueToCode(block, 'ARG' + i,
        Blockly.Rhai.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Rhai.ORDER_UNARY_POSTFIX];
};

Blockly.Rhai['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.Rhai['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

Blockly.Rhai['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Rhai.valueToCode(block, 'CONDITION',
      Blockly.Rhai.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (Blockly.Rhai.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.Rhai.prefixLines(
        Blockly.Rhai.injectId(Blockly.Rhai.STATEMENT_SUFFIX, block),
        Blockly.Rhai.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.Rhai.valueToCode(block, 'VALUE',
        Blockly.Rhai.ORDER_NONE) || 'null';
    code += Blockly.Rhai.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.Rhai.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};

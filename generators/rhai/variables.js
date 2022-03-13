/**
 * @license
 * Copyright 2014 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rhai for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Rhai.variables');

goog.require('Blockly.Rhai');


Blockly.Rhai['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Rhai.nameDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.Rhai.ORDER_ATOMIC];
};

Blockly.Rhai['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Rhai.valueToCode(block, 'VALUE',
      Blockly.Rhai.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Rhai.nameDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};

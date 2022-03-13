/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rhai for dynamic variable blocks.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.provide('Blockly.Rhai.variablesDynamic');

goog.require('Blockly.Rhai');
goog.require('Blockly.Rhai.variables');


// Rhai is dynamically typed.
Blockly.Rhai['variables_get_dynamic'] = Blockly.Rhai['variables_get'];
Blockly.Rhai['variables_set_dynamic'] = Blockly.Rhai['variables_set'];

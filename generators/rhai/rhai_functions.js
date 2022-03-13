/// Code Generator Functions for Custom Blocks in rhai_blocks.js.
/// Initially exported by Block Exporter from rhai_library.xml.


Blockly.Rhai['coap'] = function(block) {
  //  Generate CoAP message payload:
  //  coap!( @json {        
  //    "device": &device_id,
  //    sensor_data,
  //  })
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.Rhai.valueToCode(block, 'ADD' + i,
            Blockly.Rhai.ORDER_NONE) || '\'\'';
  }
  var code = [
    'coap!( @json {',
    //  Insert the indented elements.
    Blockly.Rhai.prefixLines(
      elements.join(',\n'), 
      Blockly.Rhai.INDENT),
    '})',
  ].join('\n');
  return [code, Blockly.Rhai.ORDER_UNARY_POSTFIX];
};

Blockly.Rhai['field'] = function(block) {
  //  Generate a field for CoAP message payload: `name: value`
  var text_name = block.getFieldValue('NAME');
  var value_name = Blockly.Rhai.valueToCode(block, 'name', Blockly.JavaScript.ORDER_ATOMIC);
  var code = [
    '"', text_name, '"',
    ': ',
    value_name,
  ].join('');
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Rhai.ORDER_NONE];
};

Blockly.Rhai['forever'] = function(block) {
  //  Run this code at forever in a loop. Inspired by MakeCode "forever" and Arduino "loop".
  var statements_stmts = Blockly.Rhai.statementToCode(block, 'STMTS');
  var code = statements_stmts;
  code = [
    `//  Loop forever`,
    `loop {`,
    code + `}`,
  ].join('\n');
  return code;
};

Blockly.Rhai['wait'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var code = [
    `//  Wait ${number_duration} seconds`,
    `time_delay(${number_duration * 1000});`,
    ``
  ].join('\n');
  return code;
};

Blockly.Rhai['digital_toggle_pin'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  //  TODO: Call init_out only once,
  var code = [
    `//  Toggle GPIO ${dropdown_pin}`,
    `gpio::toggle(${dropdown_pin});`,
    ``
  ].join('\n');
  return code;
};

Blockly.Rhai['digital_read_pin'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  //  TODO: Call init_in only once: gpio::init_in(MCU_GPIO_PORTC!(13), pull_type) ? ;
  var code = 'gpio::read(' + dropdown_pin + ')';
  //  TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Rhai.ORDER_NONE];
};

Blockly.Rhai['digital_write_pin'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var dropdown_value = block.getFieldValue('VALUE');
  //  TODO: Call gpio::enable_output only once
  var code = [
    `//  Configure GPIO ${dropdown_pin} for Output`,
    `gpio::enable_output(${dropdown_pin}, 0, 0);`,
    ``,
    `//  Set GPIO ${dropdown_pin} to ${dropdown_value == 0 ? 'Low' : 'High' }`,
    `gpio::output_set(${dropdown_pin}, ${dropdown_value});`,
    ``
  ].join('\n');  
  return code;
};
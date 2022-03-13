/// Code Generator Functions for App Blocks

Blockly.Rhai['on_start'] = function(block) {
  //  Run this code at startup. Inspired by MakeCode "on_start" and Arduino "setup".
  var statements_stmts = Blockly.Rhai.statementToCode(block, 'STMTS');
  var code = statements_stmts;
  code = [
    '( list  ',
    code + ')',
  ].join('\n');
  return code;
};

Blockly.Rhai['app'] = function(block) {
  //  Generate App Widget with ui_builder() function
  Blockly.Rhai.widgets_ = {};
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.Rhai.valueToCode(block, 'ADD' + i,
            Blockly.Rhai.ORDER_NONE) || '\'\'';
  }

  //  Create the Widgets e.g. let my_button = Button::new("increment", on_my_button_press); 
  var widgets = Object.values(Blockly.Rhai.widgets_).join('\n');

  //  Add the Widgets
  var code = [
    '/// Build the UI for the window',
    'fn ui_builder() -> impl Widget<State> {  //  `State` is the Application State',  //  TODO: Fix <State>
    Blockly.Rhai.prefixLines([
        'console::print("Rhai UI builder\\n"); console::flush();',
        widgets,
        '',
        '//  Create a column',
        'let mut col = Column::new();',
        //  Insert the elements.
        elements.join('\n'),
        '//  Return the column containing the widgets',
        'col',  
      ].join('\n'), 
      Blockly.Rhai.INDENT),
    '}',  //  TODO: Remove trailing semicolon
  ].join('\n');
  return [code, Blockly.Rhai.ORDER_NONE];
};

Blockly.Rhai['label'] = function(block) {
  //  Generate a Label Widget
  var text_name = block.getFieldValue('NAME');  //  e.g. my_label
  var value_name = Blockly.Rhai.valueToCode(block, 'name', Blockly.JavaScript.ORDER_ATOMIC);

  //  Create the Widget
  Blockly.Rhai.widgets_[text_name] = [
    '//  Create a line of text',
    'let ' + text_name + '_text = LocalizedString::new("hello-counter")',  //  TODO
    Blockly.Rhai.INDENT + '.with_arg("count", on_' + text_name + '_show);  //  Call `on_' + text_name + '_show` to get label text',
    '//  Create a label widget ' + text_name,
    'let ' + text_name + ' = Label::new(' + text_name + '_text);',
  ].join('\n');

  //  Add the Widget
  var code = [
    '//  Add the label widget to the column, centered with padding',
    'col.add_child(',
    Blockly.Rhai.INDENT + 'Align::centered(',
    Blockly.Rhai.INDENT + Blockly.Rhai.INDENT + 'Padding::new(5.0, ',  //  TODO
    Blockly.Rhai.INDENT + Blockly.Rhai.INDENT + Blockly.Rhai.INDENT + text_name,
    Blockly.Rhai.INDENT + Blockly.Rhai.INDENT + ')',
    Blockly.Rhai.INDENT + '),',
    Blockly.Rhai.INDENT + '1.0',
    ');',
  ].join('\n');

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Rhai.ORDER_NONE];
};

Blockly.Rhai['button'] = function(block) {
  //  Generate a Button Widget
  var text_name = block.getFieldValue('NAME');  //  e.g. my_button
  var value_name = Blockly.Rhai.valueToCode(block, 'name', Blockly.JavaScript.ORDER_ATOMIC);

  //  Create the Widget
  Blockly.Rhai.widgets_[text_name] = [
    '//  Create a button widget ' + text_name,  //  TODO
    'let ' + text_name + ' = Button::new("increment", on_' + text_name + '_press);  //  Call `on_' + text_name + '_press` when pressed',  //  TODO
  ].join('\n');

  //  Add the Widget
  var code = [
    '//  Add the button widget to the column, with padding',
    'col.add_child(',
    Blockly.Rhai.INDENT + 'Padding::new(5.0, ',  //  TODO
    Blockly.Rhai.INDENT + Blockly.Rhai.INDENT + text_name,
    Blockly.Rhai.INDENT + '),',
    Blockly.Rhai.INDENT + '1.0',
    ');',
  ].join('\n');
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Rhai.ORDER_NONE];
};

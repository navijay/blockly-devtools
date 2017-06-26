/**
 * @license
 * Blockly Demos: Block Factory
 *
 * Copyright 2017 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tests for DevTools Toolbox model.
 * @author Celine Choo (celinechoo)
 */

'use strict';

inputTestVar = {
  // JS special characters that need escape sequences
  specialChars: ['\'', '\\', '\\n', '\\0',
      '\\v', '\\r', '\\b', '\\t', '\\f'],

  // Literal representations needed to display the escape sequence for a special character
  charLiteral: ['\\\'', '\\\\', '\\\\n', '\\\\0',
      '\\\\v', '\\\\r', '\\\\b', '\\\\t', '\\\\f'],

  // Symbols
  symbols: '~!@#$%^&*()_+`=-_+|{};:<>.,/',

  // Random words (to include alphabet in testing)
  words: ['supercalifragilisticexpialidocious', 'blockly', 'test',
      'education', 'penguin', 'Gergle Blerkly', '  ', 'MiXiT.',
      'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch']
};

let sampleXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">' +
      '<block type="math_arithmetic">' +
        '<field name="OP">ADD</field>' +
        '<value name="A">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="B">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</xml>';

/**
 * Tests whether the default toolbox is properly loaded and displayed upon opening
 * DevTools.
 */
function test_toolboxInit() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');

  assertEquals('FAILED: toolboxList does not have just one element upon init.',
      1, len(controller));
  assertTrue('FAILED: Default toolbox name does not exist upon init.',
      project.toolboxes['']);
  assertTrue('FAILED: Default toolbox is not empty.',
      project.toolboxes[''].isEmpty());
  assertFalse('FAILED: Default toolbox is not recognized as default.',
      project.ifNamedToolbox(controller.active.toolbox));
}

/**
 * Tests WorkspaceFactoryModel.addToolbox().
 */
function test_addToolbox_simple() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  assertEquals('FAILED: Toolbox count incorrect.',
      1, len(controller));

  project.addToolbox('test').then(
      (success) => {
        // Resolved. Do nothing.
      },
      (errorMsg) => {
        // Rejected. Fail test.
        fail('FAILED: ' + errorMsg);
      });

  assertEquals('FAILED: Toolbox count incorrect.',
      2, len(controller));

  assertTrue('FAILED: Newly added toolbox is not an empty toolbox.',
      project.toolboxes['test'].isEmpty());
}

/**
 * Tests WorkspaceFactoryModel.addToolbox() with special characters.
 */
function test_addToolbox_specialChar() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  assertEquals('FAILED: Toolbox count incorrect.',
      1, len(controller));

  project.addToolbox('test').then(
      (success) => {
        // Resolved. Do nothing.
      },
      (errorMsg) => {
        // Rejected. Fail test.
        fail('FAILED: ' + errorMsg);
      });

  let specialChars = inputTestVar.specialChars;
  let charLiteral = inputTestVar.charLiteral;

  for (let i = 0; i < specialChars.length; i++) {
    project.addToolbox(specialChars[i]).then(
        (success) => {
          // Resolved. Check if it exists in toolboxList.
          assertTrue('FAILED: Adding specialChar ' + charLiteral[i] +
              'successful, but not found in toolboxList.',
              project.toolboxes[specialChars[i]]);
        },
        (errorMsg) => {
          // Rejected. Fail test.
          fail('FAILED [iteration ' + i + ']: Failed in adding special character "' +
              charLiteral[i] + '" as a toolbox. Error message: ' + errorMsg);
        });
    assertEquals('FAILED: Toolbox count incorrect',
        i + 1, len(controller));
  }
}

/**
 * Tests if WorkspaceFactoryModel.ifNamedToolbox() can properly recognize the
 * default toolbox (the empty string).
 */
function test_ifNamedToolbox() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  assertFalse('FAILED: toolboxList should contain one unnamed toolbox upon init.',
      Project.ifNamedToolbox(project.active.toolbox));

  project.renameToolbox('', 'hello');

  assertTrue('FAILED: toolboxList\'s name should not be the default.',
      Project.ifNamedToolbox(project.active.toolbox));

  project.renameToolbox('hello', 'ain\'t');

  assertTrue('FAILED: toolboxList\'s name should not be the default.',
      Project.ifNamedToolbox(project.active.toolbox));

  project.renameToolbox('ain\'t', ' ');

  assertTrue('FAILED: toolboxList\'s name should not be the default.',
      Project.ifNamedToolbox(project.active.toolbox));
}

/**
 * Tests if WorkspaceFactoryModel.renameToolbox() can properly rename default
 * toolbox.
 */
function test_renameToolbox_renameDefault() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  project.renameToolbox('', 'test2').then(
      (newName) => {},// Resolved. Do nothing.
      (errorMsg) => {
        fail('FAILED: ' + errorMsg);
      });
  assertFalse('FAILED: Default toolbox is still in list after deletion.',
      project.toolboxes['']);
  assertEquals('FAILED: Toolbox has ' + len(controller) + 'toolboxes saved.',
      1, len(controller));
}

/**
 * Tests if WorkspaceFactoryModel.renameToolbox() can properly rename toolbox
 * from non-default toolbox name to another.
 */
function test_renameToolbox_simple() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  initToolbox(project, 'Test');

  model.renameToolbox('Test', 'NewTest').then(
      (newName) => {}, // Resolved. Do nothing.
      (errorMsg) => {
        // Rejected. Fail test.
        fail('FAILED: ' + errorMsg);
      });
  assertEquals('FAILED: Toolbox count incorrect.',
      2, len(controller));
}

/**
 * Whether WorkspaceFactoryModel.renameToolbox() can rename to and from special characters.
 */
function test_renameToolbox_specialChar() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  initToolbox(project, 'Test');

  let specialChars = inputTestVar.specialChars;

  for (let i = 0; i < specialChars.length; i++) {
    project.renameToolbox('Test', specialChars[i]).then(
        (newName) => {}, // Resolved. Do nothing.
        (errorMsg) => {
          // Rejected. Fail test.
          fail(
              'FAILED [iteration ' + i + ']: Failed in renaming to special character "' +
                inputTestVar.charLiteral[i] + '" from "Test". Error message: ' + errorMsg);
        });
    assertEquals('FAILED: Toolbox count incorrect.',
        2, len(controller));

    model.renameToolbox(specialChars[i], 'Test').then(
        (newName) => {}, // Resolved. Do nothing.
        (errorMsg) => {
          // Rejected. Fail test.
          fail(
              'FAILED [iteration ' + i + ']: Failed in renaming from special character "' +
                inputTestVar.charLiteral[i] + '" to "Test". Error message: ' + errorMsg);
        });
    assertEquals('FAILED: Toolbox count incorrect.',
        2, len(controller));
  }
}

/**
 * Tests if WorkspaceFactoryModel.renameToolbox() rejects renaming to whitespace
 * characters.
 */
function test_renameToolbox_space() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  initToolbox(project, 'Test');

  project.renameToolbox('Test', ' ').then(
      (newName) => {
        // Resolved. Fail test, since newspace should not be accepted.
        fail('FAILED: Toolbox names should not be able to be renamed to a ' +
            'space.');
      },
      (errorMsg) => {
        // Rejected, as expected. Do nothing.
      });
  assertEquals('FAILED: Toolbox count incorrect.',
      2, len(controller));
}

/**
 * Tests if WorkspaceFactoryModel.renameToolbox() rejects renaming to whitespace
 * characters.
 */
function test_renameToolbox_newline() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  initToolbox(project, 'Test');

  project.renameToolbox('Test', '\n').then(
      (newName) => {
        // Resolved. Fail test, since newspace should not be accepted.
        fail('FAILED: Toolbox names should not be able to be renamed to a ' +
            'newline.');
      },
      (errorMsg) => {
        // Rejected, as expected. Do nothing.
      });
  assertEquals('FAILED: Toolbox count incorrect.',
      2, len(controller));
}

/**
 * Tests if WorkspaceFactoryModel.renameToolbox() rejects renaming to whitespace
 * characters.
 */
function test_renameToolbox_spaceAndNewline() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  initToolbox(project, 'Test');

  project.renameToolbox('Test', ' \n ').then(
      (success) => {
        // Resolved. Fail test, since newspace should not be accepted.
        fail('FAILED: Toolbox names should not be able to be renamed to a ' +
            'newline or space.');
      },
      (errorMsg) => {
        // Rejected, as expected. Do nothing.
      });
  assertEquals('FAILED: Toolbox count incorrect.',
      2, len(controller));
}

/**
 * WorkspaceFactoryController.isEmptyToolbox() test. Makes sure that empty toolboxes
 * are properly indicated as empty and non-empty toolboxes are properly indicated
 * as non-empty.
 */
function test_isEmptyToolbox() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  // Confirm that empty toolboxes return true.
  let empty_xmls = {
    'space in between': '<xml> </xml>',
    'newline in between': '<xml>\n</xml>',
    'space and newline in between': '<xml> \n </xml>',
    'space in between tags': '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">' +
        ' </xml>'
  };

  for (let key in empty_xmls) {
    assertTrue('FAILED: this.isEmptyToolbox() returned false when there was ' + key + '.',
        project.toolboxes[key].isEmpty());
  }

  // Confirm that non-empty toolboxes return false.
  let nonempty_xmls = {
    'words in between': '<xml>Hello</xml>'
  };

  nonempty_xmls['a full toolbox'] =
      '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">' +
        '<block type="math_arithmetic">' +
          '<field name="OP">ADD</field>' +
          '<value name="A">' +
            '<shadow type="math_number">' +
              '<field name="NUM">1</field>' +
            '</shadow>' +
          '</value>' +
          '<value name="B">' +
            '<shadow type="math_number">' +
              '<field name="NUM">1</field>' +
            '</shadow>' +
          '</value>' +
        '</block>' +
      '</xml>';

  for (let key in nonempty_xmls) {
    assertFalse('FAILED: this.isEmptyToolbox() returned true when there was ' + key + '.',
        project.toolboxes[key].isEmpty());
  }
}

/**
 * Tests various toolbox functions in WorkspaceFactoryController. Goes through
 * the back-end motions of adding a new toolbox to list of toolboxes, making sure
 * every step (other function calls) is correctly executed.
 */
function test_toolboxFunctions() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  // Making sure initial toolbox is an empty toolbox.
  assertTrue('FAILED: Toolbox is not empty upon init.',
      project.toolboxes[project.active.toolbox].isEmpty());

  // Checking that no extra toolboxes are accidentally created/added upon init.
  assertEquals('FAILED: controller.toolboxList has ' + len(controller) + ' elements.',
      1, len(controller));

  // Showing a toolbox should only be for preexisting toolbox names.
  controller.showToolbox('NonToolbox').then(
      (name) => {
        fail('FAILED: Showing a toolbox that does not exist.')
      },
      (errorMsg) => {
        // Failed, as expected.
      });

  // Renaming toolbox should be succesful.
  controller.renameToolbox('', 'blockly').then(
      (newName) => {}, // Resolved, as expected. Do nothing.
      (errorMsg) => {
        fail('FAILED: Renaming toolbox. ' + errorMsg);
      });

  // Adding XML to sample toolbox called 'blockly'.
  project.toolboxes['blockly'] = new Toolbox('blockly');
  project.toolboxes['blockly'].updateXml(sampleXml);

  // Make sure that trying to rename a toolbox that DNE does not work.
  controller.renameToolbox('NonToolbox', 'A Toolbox').then(
      (newName) => {
        fail('FAILED: NonToolbox should not exist.');
      },
      (errorMsg) => {
        // Rejected, as expected. Do nothing.
      });

  // Assert that no toolboxes have been accidentally added in the process.
  assertTrue(1, len(controller));

  // Make sure that trying to rename a toolbox that does exists, works.
  controller.renameToolbox('A Toolbox', 'Another Toolbox').then(
      (newName) => {}, // Resolved, as expected. Do nothing.
      (errorMsg) => {
        fail('FAILED: Renamming "A Toolbox" to "Another Toolbox" failed.');
      });

  // Assert that no toolboxes have been accidentally added in the process.
  assertTrue(1, len(controller));
}

/**
 * Tests WorkspaceFactoryController.showToolbox(). Used for showing toolboxes
 * onto workspace. Makes sure that the back-end storage of toolbox XML matches
 * with the toolbox displayed on page.
 */
function test_showToolbox() {
  let controller = new ProjectController('toolboxDiv', 'previewDiv');
  let project = controller.project;

  // Hard-code in a new toolbox.
  controller.active.toolbox = 'New_toolbox';
  project.toolboxes[controller.active.toolbox] = new Toolbox(controller.active.toolbox);
  project.toolboxes[controller.active.toolbox].updateXml(sampleXml);

  // Show toolbox.
  controller.showToolbox('New_toolbox').then(
      (toolboxName) => {}, // Resolved, as expected. Do nothing.
      (errorMsg) => {
        fail('FAILED: ' + errorMsg);
      });

  // Toolbox retrieved from workspace should be equal to saved XML.
  let actual = Blockly.Xml.domToPrettyText
      (this.generator.generateToolboxXml());
  let expected = project.toolboxes[controller.active.toolbox].buildXmlString();

  assertEquals('FAILED: showToolbox() is displaying a different toolbox than expected.',
      expected, actual);
}

/**
 * Returns how many toolboxes are saved into a project saved under the controller.
 */
function len(controller) {
  let listSize = 0;
  for (let key in controller.project.toolboxes) {
    listSize += 1;
  }
  return listSize;
}

/**
 * Initializes toolbox with default toolbox and a toolbox under toolboxName.
 * Ends with two toolboxes in toolboxList.
 * @param {!Project} project Project object into which a new toolbox will be
 *     added.
 * @param {string} toolboxName Name of new toolbox to add to project.
 */
function initToolbox(project, toolboxName) {
  assertEquals('FAILED: Toolbox list should have 1 toolbox upon init.',
      1, len(controller));

  project.addToolbox(toolboxName).then(
      (success) => {
        // Resolved. Do nothing.
      },
      (errorMsg) => {
        // Rejected. Fail test.
        fail('FAILED [in addToolbox()]: ' + errorMsg);
      });
}
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
 * @fileoverview Toolbox object. Contains references to controller and view.
 *
 * @author Celine Choo (celinechoo)
 */

class Toolbox extends Resource {
  constructor(name) {
    this.name = name;
    this.xmlString = '<xml></xml>';
  }

  /**
   * Renames toolbox.
   * @param {string} newName New name of toolbox.
   */
  setName(newName) {
    this.name = newName;
  }

  /**
   * Adds block to toolbox.
   * @returns {boolean} True if added succesfully, false if name is invalid
   *     or taken.
   */
  addBlock(categoryName, blockName, xmlDefinition) {
    console.log('Add block called!');
    // TODO: Implement function.
  }

  /**
   * Removes block from toolbox.
   */
  removeBlock(blockName) {
    console.log('Remove block called!');
    if (this.blocks[blockName]) {
      delete this.blocks[blockName];
    }
  }

  /**
   * Generates JavaScript string representation of toolbox for user to download.
   * Does not deal with popups or file system access; just generates content.
   *
   * @returns {string} String representation of JS file to be exported.
   */
  buildJsString() {
    // TODO: Implement function.
    console.log('exportJs() called.');
  }

  /**
   * Generates XML string representation of toolbox for user to download. Does
   * not deal with popups or file system access; just generates content.
   *
   * @returns {string} String representation of XML file to be exported.
   */
  buildXmlString() {
    // TODO: Implement function.
    console.log('exportXml() called.');
  }

  /**
   * Returns true if given category name already exists within toolbox.
   *
   * @param {string} categoryName Name of category.
   * @returns {boolean} Whether category name exists in toolbox.
   */
  categoryIsInToolbox(categoryName) {
    // TODO: Implement function.
  }

  /**
   * Returns true if this toolbox does not contain any blocks in any category.
   *
   * @returns {boolean} Whether the toolbox is empty.
   */
  isEmpty() {
    let xml = this.xmlString;
    let xmlTagRegEx = /<.*>/g;

    if (xmlTagRegEx.match(xml).length == 2) {
      return true;
    } else if (/ */.test(xml)) {
      return true;
    } else {
      return false;
    }
  }
}

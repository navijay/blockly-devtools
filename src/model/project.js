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
 * @fileoverview Project object. Contains references to controller and view.
 *
 * @author
 */

class Project {
  constructor(projectName) {
    /**
     * The name of the project.
     * @type {string}
     */
    this.projectName = projectName;

    /**
     * Dictionary mapping toolbox names to toolbox controllers.
     * @type {!Object<string, !Toolbox>}
     */
    this.toolboxes = {
      '': new Toolbox('')
    };
  }

  /**
   * Creates a new toolbox for users to modify and edit.
   *
   * @param {string} toolbox Name of new toolbox to add.
   * @param {Promise} Resolves with true if name is valid and successfully added
   *     to list of toolboxes; rejects with error message if name is invalid.
   */
  addToolbox(name) {
    return new Promise((resolve, reject) => {
      if (Project.ifNamedToolbox(name)) {
        reject('You cannot name with only whitespace.');
      } else if (!this.toolboxes[name]) {
        reject('This name is already taken.');
      } else {
        name = FactoryUtils.addEscape(name);
        this.toolboxes[name] = new Toolbox(name);
        resolve(name);
      }
    });
  }

  /**
   * Renames toolbox from oldName to newName. Catches for duplicates and invalid
   * names (empty strings, etc.).
   *
   * @param {string} oldName Original name of toolbox to change to newName.
   * @param {string} newName New name of toolbox to change from oldName.
   * @returns {Promise} Resolves if renamed successfully, rejects if
   *    name of toolbox is invalid or other errors arise.
   */
  renameToolbox(oldName, newName) {
    return new Promise((resolve, reject) => {
      this.addToolbox(newName).then(
          (newName) => {
            // Resolved.
            // Reset name in toolbox object.
            this.toolboxes[oldName].setName(newName);
            // Create new element in this.toolboxes for new name.
            this.toolboxList[newName] = this.toolboxList[oldName];
            delete this.toolboxes[oldName];
            resolve(name);
          },
          (errorMsg) => {
            // Rejected.
            reject(errorMsg);
          });
    });
  }

  /**
   * Verifies if current toolbox has yet been named by user.
   *
   * @returns {boolean} If named.
   */
  static ifNamedToolbox(name) {
    return /( |\n)*/g.test(name);
  }
}

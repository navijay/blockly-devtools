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
 * @fileoverview The ProjectController Class controls the management of the
 *   information contained within projects (libraries, toolboxes, workspaces);
 *   when blocks are opened, storage, importing and exporting.
 */

class ProjectController {
  constructor() {
    this.project = new Project();
    this.wFactoryController = new WorkspaceFactoryController();
    // Object which keeps track of what toolbox, workspace, or library
    // is currently active. Stores the name of BlockCollection
    // @type {!Object.<string, string>}
    this.active = {
      library: '',
      toolbox: '',
      workspace: ''
    }
  }

  /**
   * Creates a new toolbox for editing. Saves previously edited toolbox, and prompts
   * user if previous toolbox has not been saved under a user-specified name. Initial
   * default name of toolbox is the empty string, and is considered an un-named
   * toolbox that the user will eventually rename if they add another toolbox.
   */
  newToolbox() {
    // Check if toolbox was active
    if (!this.active.toolbox) {
      if (this.project.toolboxes[this.active.toolbox].isEmpty()) {
        return;
      }

      let defaultName = prompt('Your default toolbox is not named. Please provide a name.');
      this.project[this.active.toolbox].setName(defaultName).then(
          (newName) => {
            // Resolved.
            delete this.project[this.active.toolbox];
            this.active.toolbox = newName;
          },
          (errorMsg) => {
            // Rejected.
            console.log('New toolbox failed.');
            defaultName = prompt('Invalid name. ' + errorMsg + 'Please provide another' +
                'name.');
            this.newToolbox();
          });
    }

    this.saveToolbox();

    let newToolboxName = prompt('Enter the name your new toolbox.');
    this.project.addToolbox(newToolboxName).then(
        (newName) => {
          newToolboxName = newName;
        },
        (errorMsg) => {
          alert('Invalid name. ' + errorMsg);
          this.newToolbox();
          return;
        });

    this.showToolbox(newToolboxName).then(
        (name) => {
          // Resolved. Do nothing.
        },
        (errorMsg) => {
          console.log('ERROR: ' + errorMsg);
        });
  }

  /**
   * Saves XML currently in workspace into currently active toolbox under this.toolboxList.
   *
   * @returns {Promise} If saved successfully, resolve with true; else reject with
   *     error message string.
   */
  saveToolbox() {
    return new Promise((resolve, reject) => {
      let toolboxXml = Blockly.Xml.domToPrettyText
          (this.generator.generateToolboxXml());
      this.toolboxList[this.currentToolbox] = toolboxXml;
    });
  }

  /**
   * Changes view to display a different or new toolbox to edit.
   *
   * @param {string} name Name of toolbox to display.
   * @returns {Promise} If displayed successfully, resolve with true; else reject
   *     with error message string.
   */
  showToolbox(name) {
    // TODO: implement
    // Check if name exists (model.toolboxNameIsTaken()).
    // If exists, display model.toolboxList[name].
    // If name DNE within list, prompt user.
    console.log('WorkspaceFactoryController.showToolbox() called!');
    return new Promise((resolve, reject) => {
      if (!this.project.toolboxes[name]) {
        reject('This toolbox does not exist.');
      } else {
        // show toolbox
        this.active.toolbox = name;
        // Actually display toolbox onto workspace.
        wFactoryController.importToolboxFromTree_(
            Blockly.Xml.textToDom(
              this.project.toolboxes[name]));

        resolve(name);
      }
    });
  }

  exportAll() {
    // Save library
    // Save toolbox

  }
}

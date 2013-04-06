/**
 * TUNA FRAMEWORK
 *
 * Copyright (c) 2012, Sergey Kononenko
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * * Names of contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL SERGEY KONONENKO BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



/**
 * @constructor
 * @extends {ui.Widget}
 * @param {!Node} target DOM-элемент.
 * @param {!ui.Container} container Контейнер.
 */
ui.lists.ListItem = function(target, container) {
  ui.Widget.call(this, target, container);

  /**
   * @type {ui.lists.List}
   */
  this.__list = null;
};

util.inherits(ui.lists.ListItem, ui.Widget);


/**
 * @type {string}
 */
ui.lists.ListItem.NAME = 'list-item';


/**
 * @inheritDoc
 */
ui.lists.ListItem.prototype.init = function() {
  var container = this.getContainer();
  var list = null;

  var parents = util.dom.getParents(this.getTarget(), container.getTarget());
  var i = 0;

  while (i < parents.length) {
    var widgets = container.getWidgetsAt(parents[i]);
    var j = 0;

    while (j < widgets.length) {
      if (widgets[j] instanceof ui.lists.List) {
        list = widgets[j];
        break;
      }

      j += 1;
    }

    if (list !== null) {
      break;
    }

    i += 1;
  }

  if (list instanceof ui.lists.List) {
    this.__list = list;
    this.__list.registerItem(this);
  }

  ui.Widget.prototype.init.call(this);
};


/**
 * @inheritDoc
 */
ui.lists.ListItem.prototype.destroy = function() {
  if (this.__list !== null) {
    this.__list.terminateItem(this);
    this.__list = null;
  }

  ui.Widget.prototype.destroy.call(this);
};


/**
 * @return {string} Индекс.
 */
ui.lists.ListItem.prototype.getIndex = function() {
  return this.getOption('index');
};

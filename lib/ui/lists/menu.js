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
 * @extends {ui.lists.List}
 * @param {!Node} target DOM-элемент.
 * @param {!ui.Container} container Контейнер.
 */
ui.lists.Menu = function(target, container) {
  ui.lists.List.call(this, target, container);
  var self = this;

  /**
   * @type {string}
   */
  this.__itemSelector = ui.getTargetSelector(this.getOption('item-type'));

  /**
   * @param {!Event} event Объект DOM-события.
   * @param {!Node} target Цель DOM-события.
   */
  this.__clickHandler = function(event, target) {
    var widgets = container.getWidgetsAt(target);

    var i = 0,
        l = widgets.length;

    while (i < l) {
      if (widgets[i] instanceof ui.lists.ListItem) {
        self.selectItem(widgets[i]);
        break;
      }

      i += 1;
    }
  };
};

util.inherits(ui.lists.Menu, ui.lists.List);


/**
 * @type {string}
 */
ui.lists.Menu.NAME = 'menu';


/**
 * @inheritDoc
 */
ui.lists.Menu.prototype.init = function() {
  util.dom.addChildEventListener(this.getTarget(), this.__itemSelector,
      'click', this.__clickHandler);

  ui.lists.List.prototype.init.call(this);
};


/**
 * @inheritDoc
 */
ui.lists.Menu.prototype.destroy = function() {
  util.dom.removeChildEventListener(this.getTarget(), this.__itemSelector,
      'click', this.__clickHandler);

  ui.lists.List.prototype.destroy.call(this);
};


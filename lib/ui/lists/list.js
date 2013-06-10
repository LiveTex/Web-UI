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
 * @extends {ui.Container}
 * @param {!Node} target DOM-элемент.
 */
ui.lists.List = function(target) {
  ui.Container.call(this, target);

  /**
   * @type {!ui.lists.IItemsCollection}
   */
  this.__collection = new ui.lists.TableCollection();

  /**
   * @type {ui.lists.SingleSelectionRule}
   */
  this.__selectionRule =
      new ui.lists.SingleSelectionRule(this.__collection, this);

  /**
   * @type {string}
   */
  this.__itemType = this.getOption('item-type') || ui.lists.ListItem.NAME;
};

util.inherits(ui.lists.List, ui.Container);


/**
 * @type {string}
 */
ui.lists.List.NAME = 'list';


/**
 * @inheritDoc
 */
ui.lists.List.prototype.getWidgetTypes = function() {
  return [this.__itemType];
};


/**
 * @return {string} Тип виджета элемента списка.
 */
ui.lists.List.prototype.getItemType = function() {
  return this.__itemType;
};


/**
 * @param {!ui.lists.ListItem} item Элемент списка.
 */
ui.lists.List.prototype.registerItem = function(item) {
  this.__collection.registerItem(item);
};


/**
 * @param {!ui.lists.ListItem} item Элемент списка.
 */
ui.lists.List.prototype.terminateItem = function(item) {
  this.__collection.terminateItem(item);
};


/**
 * @param {number} index Индекс выделяемого элемента.
 */
ui.lists.List.prototype.selectItemAt = function(index) {
  this.__selectionRule.selectIndex(index);
};


/**
 * @param {!ui.lists.ListItem} item Элемент списка.
 */
ui.lists.List.prototype.selectItem = function(item) {
  this.__selectionRule.selectIndex(this.__collection.getItemIndex(item));
};

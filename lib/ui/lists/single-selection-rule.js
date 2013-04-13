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
 * @implements {ui.lists.ISelectionRule}
 * @param {!ui.lists.IItemsCollection} collection Коллекция элементов.
 * @param {!events.IEventDispatcher} eventDispatcher Объект обработки событий.
 */
ui.lists.SingleSelectionRule = function(collection, eventDispatcher) {

  /**
   * @type {!events.IEventDispatcher}
   */
  this.__dispatcher = eventDispatcher;

  /**
   * @type {!ui.lists.IItemsCollection}
   */
  this.__collection = collection;

  /**
   * @type {number|string}
   */
  this.__currentIndex = collection.getNullIndex();

  /**
   * @type {number|string}
   */
  this.__nullIndex = collection.getNullIndex();
};


/**
 * @inheritDoc
 */
ui.lists.SingleSelectionRule.prototype.selectIndex = function(index) {
  if (this.__currentIndex !== index) {
    var item = this.__collection.getItemAt(index);
    if (item !== null && item.isEnabled()) {

      if (this.__currentIndex !== this.__nullIndex) {
        var currentItem = this.__collection.getItemAt(this.__currentIndex);
        if (currentItem !== null) {
          currentItem.deselect();

          this.__dispatcher.dispatch(new ui.lists.ListEvent(this.__dispatcher,
              ui.lists.ListEvent.DESELECT, currentItem), index);
        }
      }

      item.select();

      this.__currentIndex = index;

      this.__dispatcher.dispatch(new ui.lists.ListEvent(
          this.__dispatcher, ui.lists.ListEvent.SELECT, item), index);
    }
  }

  return this.__currentIndex === index;
};


/**
 * @inheritDoc
 */
ui.lists.SingleSelectionRule.prototype.getSelectedIndexes = function() {
  if (this.__currentIndex !== this.__nullIndex) {
    return [this.__currentIndex];
  }

  return [];
};


/**
 * @inheritDoc
 */
ui.lists.SingleSelectionRule.prototype.clearSelection = function() {
  if (this.__currentIndex !== this.__nullIndex) {
    var item = this.__collection.getItemAt(this.__currentIndex);
    if (item !== null) {
      item.deselect();
    }

    this.__currentIndex = this.__nullIndex;
  }
};

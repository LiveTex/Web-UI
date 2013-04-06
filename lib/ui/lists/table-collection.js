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
 * @implements {ui.lists.IItemsCollection}
 */
ui.lists.TableCollection = function() {

  /**
   * @type {!Object.<(string|number), !ui.lists.ListItem>}
   */
  this.__items = {};
};


/**
 * @inheritDoc
 */
ui.lists.TableCollection.prototype.getNullIndex = function() {
  return '';
};


/**
 * @inheritDoc
 */
ui.lists.TableCollection.prototype.registerItem = function(item) {
  this.__items[item.getIndex()] = item;
};


/**
 * @inheritDoc
 */
ui.lists.TableCollection.prototype.terminateItem = function(item) {
  delete this.__items[item.getIndex()];
};


/**
 * @inheritDoc
 */
ui.lists.TableCollection.prototype.getItemAt = function(index) {
  if (this.__items[index] !== undefined) {
    return this.__items[index];
  }

  return null;
};


/**
 * @inheritDoc
 */
ui.lists.TableCollection.prototype.getItemIndex = function(item) {
  return item.getIndex();
};

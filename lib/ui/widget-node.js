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
 */
ui.WidgetNode = function() {

  /**
   * @type {!Object.<string, !ui.Widget>}
   */
  this.__widgets = {};

  /**
   * @type {number}
   */
  this.__widgetCount = 0;

  /**
   * @type {ui.Container}
   */
  this.__container = null;
};


/**
 * @return {number} Количество зарегистрированных виджетов.
 */
ui.WidgetNode.prototype.getWidgetsCount = function() {
  return this.__widgetCount;
};


/**
 * @param {string} type Тип виджета.
 * @return {ui.Widget} Виджет.
 */
ui.WidgetNode.prototype.getWidget = function(type) {
  return this.__widgets[type] || null;
};


/**
 * @return {ui.Container} Виджет.
 */
ui.WidgetNode.prototype.getContainer = function() {
  return this.__container;
};


/**
 * @return {!Array.<!ui.Widget>} Виджеты.
 */
ui.WidgetNode.prototype.getWidgets = function() {
  var result = [];

  for (var type in this.__widgets) {
    result.push(this.__widgets[type]);
  }

  return result;
};


/**
 * @param {string} type Тип виджетов.
 * @param {!ui.Widget} widget Виджет.
 */
ui.WidgetNode.prototype.addWidget = function(type, widget) {
  if (this.__widgets[type] === undefined) {
    this.__widgetCount += 1;
  }

  this.__widgets[type] = widget;

  if (widget instanceof ui.Container && this.__container === null) {
    this.__container = widget;
  }
};


/**
 * @param {string} type Тип виджетов.
 */
ui.WidgetNode.prototype.removeWidget = function(type) {
  if (this.__widgets[type] === this.__container) {
    this.__container = null;
  }

  delete this.__widgets[type];

  this.__widgetCount -= 1;
};

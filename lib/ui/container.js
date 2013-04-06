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
 * Класс контейнера с виждетами.
 *
 * Контейнер с виджетами сам является виджетом, тем самым вложенные контейнеры
 * образовывают композитную структуру.
 *
 * @see ui.Widget
 * @constructor
 * @extends {ui.Widget}
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!ui.Container=} opt_container Родительский контейнер.
 */
ui.Container = function(target, opt_container) {
  ui.Widget.call(this, target, opt_container || this);

  /**
   * @type {!Object.<string, !Array.<!ui.Widget>>}
   */
  this.__widgets = {};

  /**
   * @type {!Object.<string, !ui.Widget>}
   */
  this.__targetWidgets = {};

  /**
   * @type {!Object.<string, !ui.Widget>}
   */
  this.__namedWidgets = {};

  var types = this.getArrayOption('widgets');

  var i = 0,
      l = types.length;

  while (i < l) {
    this.__widgets[types[i]] = [];

    i += 1;
  }
};

util.inherits(ui.Container, ui.Widget);


/**
 * @type {string}
 */
ui.Container.NAME = 'container';


/**
 * @inheritDoc
 */
ui.Container.prototype.init = function() {
  this.initWidgets(this.getTarget());
  ui.Widget.prototype.init.call(this);
};


/**
 * @inheritDoc
 */
ui.Container.prototype.destroy = function() {
  this.destroyWidgets(this.getTarget());
  ui.Widget.prototype.destroy.call(this);
};


/**
 * Инициализация виджетов контейнера.
 *
 * @param {!Node} container Целевой контейнер.
 */
ui.Container.prototype.initWidgets = function(container) {
  for (var type in this.__widgets) {
    this.initWidgetsWithType(type, container);
  }

  ui.Widget.prototype.init.call(this);
};


/**
 * Инициализация виджетов контейнера.
 *
 * @param {!Node} container Целевой контейнер.
 */
ui.Container.prototype.destroyWidgets = function(container) {
  for (var type in this.__widgets) {
    this.destroyWidgetsWithType(type, container);
  }

  ui.Widget.prototype.init.call(this);
};


/**
 * Инициализация виджетов контейнера.
 *
 * @param {string} type Тип виджетов для инициализации.
 * @param {!Node} container Целефой контейнер.
 */
ui.Container.prototype.initWidgetsWithType = function(type, container) {
  if (util.dom.hasParent(container, this.getTarget())) {
    var targets = ui.findWidgetTargets(type, container, true, false);
    var i = 0,
        l = targets.length;

    var widgets = [];

    while (i < l) {
      var target = targets[i];

      if (this.getWidgetAt(type, target) === null) {
        var widget = this.__createWidget(type, target);
        if (widget !== null) {
          widgets.push(widget);
        }
      }

      i += 1;
    }

    if (this.__widgets[type] === undefined) {
      this.__widgets[type] = widgets;
    } else {
      this.__widgets[type] = this.__widgets[type].concat(widgets);
    }

    for (i = 0, l = widgets.length; i < l; i += 1) {
      widgets[i].init();
    }
  }
};


/**
 * @param {string} type Тип виджетов для уничтожения.
 * @param {!Node} container Целефой контейнер.
 */
ui.Container.prototype.destroyWidgetsWithType = function(type, container) {
  if (this.__widgets[type] !== undefined) {
    var widgets = this.__widgets[type];

    var i = widgets.length - 1;
    while (i >= 0) {
      var widget = widgets[i];

      if (util.dom.hasParent(widget.getTarget(), container)) {
        this.__destroyWidget(widget, type);
        widgets.splice(i, 1);
      }

      i -= 1;
    }
  }
};


/**
 * Получение виждета по типу и имени.
 *
 * @see ui.Widget#getName
 * @param {string} type Тип виждета.
 * @param {string} name Имя экземпляра виждета.
 * @return {ui.Widget} Виджет.
 */
ui.Container.prototype.getWidget = function(type, name) {
  var key = type + ':' + name;

  if (this.__namedWidgets[key] !== undefined) {
    return this.__namedWidgets[key];
  }

  return null;
};


/**
 * @param {string} type Тип виждета.
 * @param {!Node} target Целефой узел.
 * @return {ui.Widget} Виджет.
 */
ui.Container.prototype.getWidgetAt = function(type, target) {
  var key = type + ':' + target.id;

  if (this.__targetWidgets[key] !== undefined) {
    return this.__targetWidgets[key];
  }

  return null;
};


/**
 * @param {!Node} target Целефой узел.
 * @return {!Array.<!ui.Widget>} Виджет.
 */
ui.Container.prototype.getWidgetsAt = function(target) {
  var result = [];

  for (var type in this.__widgets) {
    var widget = this.getWidgetAt(type, target);
    if (widget !== null) {
      result.push(widget);
    }
  }

  return result;
};


/**
 * @param {string} type Тип виджетов для инициализации.
 * @param {!Node} target Целефой узел.
 * @return {ui.Widget} Виджет.
 */
ui.Container.prototype.__createWidget = function(type, target) {
  var widget = ui.createWidget(type, target, this);
  if (widget !== null) {
    this.__targetWidgets[type + ':' + widget.getTargetId()] = widget;
    this.__namedWidgets[type + ':' + widget.getName()] = widget;
  }

  return widget;
};


/**
 * @param {!ui.Widget} widget Виджет.
 * @param {string} type Тип виджета.
 */
ui.Container.prototype.__destroyWidget = function(widget, type) {
  widget.removeAllEventListeners();
  widget.destroy();

  delete this.__targetWidgets[type + ':' + widget.getTargetId()];
  delete this.__namedWidgets[type + ':' + widget.getName()];
};

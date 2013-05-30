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
 * @name Контейнер.
 *
 * @description Служит для автоматической инициализации виджетов вложенной
 * DOM-структуры в целевой DOM-элемент контейнера.
 *
 * Виджеты для инициализации задаются списком имен.
 *
 * Вложенная DOM-структура ограничена целевыми DOM-элементами вложенных
 * виджетов-контейнеров.
 *
 * @see ui.Widget
 * @constructor
 * @extends {ui.Widget}
 * @param {!Node} target Целевой DOM-элемент.
 */
ui.Container = function(target) {
  ui.Widget.call(this, target);

  /**
   * @type {!Array.<string>}
   */
  this.__widgetTypes = this.getArrayOption('widgets');

  /**
   * @type {!Object.<string, !Node>}
   */
  this.__widgetTargets = [];
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
 * Инициализация виджетов в DOM-элемента.
 *
 * @param {!Node} container Целевой DOM-элемент для поиска и инициализации
 *    виджетов.
 */
ui.Container.prototype.initWidgets = function(container) {
  if (util.dom.hasParent(container, this.getTarget())) {
    for (var i = 0, l = this.__widgetTypes.length; i < l; i += 1) {
      this.__initWidgetsWithType(this.__widgetTypes[i], container);
    }
  }
};


/**
 * Инициализация виджетов контейнера.
 *
 * @param {!Node} container Целевой контейнер.
 */
ui.Container.prototype.destroyWidgets = function(container) {
  for (var i = 0, l = this.__widgetTypes.length; i < l; i += 1) {
    this.__destroyWidgetsWithType(this.__widgetTypes[i], container);
  }
};


/**
 * Инициализация виджетов контейнера.
 *
 * Регистрировать типы виджетов для будущей инициализации.
 *
 * @param {string} type Тип виджетов для инициализации.
 * @param {!Node} container Целефой контейнер.
 */
ui.Container.prototype.__initWidgetsWithType = function(type, container) {
  var targets = ui.findWidgetTargets(type, container, true, false);
  var i = 0,
      l = targets.length;

  while (i < l) {
    var widget = ui.createWidget(type, targets[i]);
    if (widget !== null) {
      var id = widget.getTargetId();

      if (this.__widgetTargets[id] === undefined) {
        this.__widgetTargets[id] = widget.getTarget();
      }

      widget.init();
    }

    i += 1;
  }
};


/**
 * @param {string} type Тип виджетов для уничтожения.
 * @param {!Node} container Целефой контейнер.
 */
ui.Container.prototype.__destroyWidgetsWithType = function(type, container) {
  for (var id in this.__widgetTargets) {
    var target = this.__widgetTargets[id];
    var widget = ui.getWidgetAt(type, target);

    if (widget !== null && util.dom.hasParent(target, container)) {
      widget.removeAllEventListeners();
      widget.destroy();

      ui.terminateWidget(type, widget);

      if (ui.getWidgetsCount(target) === 0) {
        delete this.__widgetTargets[id];
      }
    }
  }
};

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
 * Контейнер.
 *
 * Служит для автоматической инициализации виджетов вложенной
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
  this.__widgetTargets = {};

  /**
   * @type {!Object.<string, !Node>}
   */
  this.__nameTargets = {};
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
  this.initWidgetsAt(this.getTarget());
  ui.Widget.prototype.init.call(this);
};


/**
 * @inheritDoc
 */
ui.Container.prototype.destroy = function() {
  this.destroyWidgetsAt(this.getTarget());
  ui.Widget.prototype.destroy.call(this);
};


/**
 * @return {!Array.<string>} Используемые виджеты.
 */
ui.Container.prototype.getWidgetTypes = function() {
  return this.__widgetTypes;
};


/**
 * Инициализация виджетов в DOM-элемента.
 *
 * @param {!Node} Node Целевой DOM-элемент для поиска и инициализации
 *    виджетов.
 */
ui.Container.prototype.initWidgetsAt = function(Node) {
  if (util.dom.hasParent(Node, this.getTarget())) {
    var types = this.getWidgetTypes();
    for (var i = 0, l = types.length; i < l; i += 1) {
      this.initWidgetsWithType(types[i], Node);
    }
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
ui.Container.prototype.initWidgetsWithType = function(type, container) {
  var targets = ui.findWidgetTargets(type, container, true, false);
  var i = 0,
      l = targets.length;

  while (i < l) {
    var widget = ui.getWidgetAt(type, targets[i]);

    if (widget === null) {
      widget = ui.createWidget(type, targets[i]);

      if (widget !== null) {
        widget.init()
      }
    }

    if (widget !== null) {
      var id = widget.getTargetId();
      var target = widget.getTarget();
      var name = ui.getWidgetName(target);

      if (this.__widgetTargets[id] === undefined) {
        this.__widgetTargets[id] =
            this.__nameTargets[name] = target;
      }
    }

    i += 1;
  }
};


/**
 * Разрушение виджетов DOM-элемента.
 *
 * @param {!Node} Node Целевой DOM-элемент.
 */
ui.Container.prototype.destroyWidgetsAt = function(Node) {
  for (var id in this.__widgetTargets) {
    var target = this.__widgetTargets[id];

    if (util.dom.hasParent(target, Node)) {
      var widgets = ui.getWidgetsAt(target);
      var name = ui.getWidgetName(target);

      for (var i = 0, l = widgets.length; i < l; i += 1) {
        widgets[i].destroy();
      }

      ui.terminateWidgetsAt(target);

      delete this.__widgetTargets[id];
      delete this.__nameTargets[name];
    }
  }
};


/**
 * Очищение отстутсвующих в DOM-дереве, но зарегистрированных узлов.
 */
ui.Container.prototype.handleBroken = function() {
  for (var id in this.__widgetTargets) {
    var target = this.__widgetTargets[id];
    var name = ui.getWidgetName(target);

    var parentContainer = ui.getParentContainer(target);
    if (parentContainer !== this) {
      if (parentContainer === null) {
        var widgets = ui.getWidgetsAt(target);
        for (var i = 0, l = widgets.length; i < l; i += 1) {
          widgets[i].destroy();
        }

        ui.terminateWidgetsAt(target);
      }

      delete this.__widgetTargets[id];
      delete this.__nameTargets[name];
    } else {

      var container = ui.getContainerAt(target);
      if (container !== null) {
        container.handleBroken();
      } else if (ui.getWidgetsCount(target) === 0) {
        delete this.__widgetTargets[id];
        delete this.__nameTargets[name];
      }
    }
  }
};


/**
 * @param {string} type Тип виждета.
 * @param {string} name Имя экземпляра виждета.
 * @return {ui.Widget} Виджет.
 */
ui.Container.prototype.getWidget = function(type, name) {
  if (this.__nameTargets[name] !== undefined) {
    return ui.getWidgetAt(type, this.__nameTargets[name]);
  }

  return null;
};

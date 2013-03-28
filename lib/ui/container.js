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
  ui.Widget.call(this, target, opt_container);

  /**
   * @type {!Object.<string, !Array.<!ui.Widget>>}
   */
  this.__widgetTypes = {};
};

util.inherits(ui.Container, ui.Widget);


/**
 * @inheritDoc
 */
ui.Container.prototype.init = function() {
  var types = this.getArrayOption('widgets');

  var i = 0,
      l = types.length;

  while (i < l) {
    this.initWidgets(types[i]);

    i += 1;
  }

  ui.Widget.prototype.init.call(this);
};


/**
 * @inheritDoc
 */
ui.Container.prototype.destroy = function() {
  for (var type in this.__widgetTypes) {
    while (this.__widgetTypes[type].length > 0) {
      this.__widgetTypes[type].shift().destroy();
    }

    delete this.__widgetTypes[type];
  }

  ui.Widget.prototype.destroy.call(this);
};


/**
 * @param {string} type Тип виджетов для инициализации.
 */
ui.Container.prototype.initWidgets = function(type) {
  this.destroyWidgets(type);

  var targets = ui.findWidgetTargets(type, this.getTarget(), true, false);
  var widgets = [];

  while (targets.length > 0) {
    var widget = ui.createWidget(type, targets.shift(), this);
    if (widget !== null) {
      var name = widget.getName();
      if (name === '' ||
          this.dispatch(new ui.ContainerEvent(this, name, widget))) {
        widgets.push(widget);
      }
    }
  }

  var i = 0,
      l = widgets.length;

  while (i < l) {
    widgets[i].init();

    i += 1;
  }

  this.__widgetTypes[type] = widgets;
};


/**
 * @param {string} type Тип виджетов для уничтожения.
 */
ui.Container.prototype.destroyWidgets = function(type) {
  if (this.__widgetTypes[type] !== undefined) {
    while (this.__widgetTypes[type].length > 0) {
      this.__widgetTypes[type].shift().destroy();
    }

    delete this.__widgetTypes[type];
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
  var widgets = this.__widgetTypes[type];
  if (widgets !== undefined) {
    var i = 0,
        l = widgets.length;

    while (i < l) {
      if (name === widgets[i].getName()) {
        return widgets[i];
      }

      i += 1;
    }
  }

  return null;
};

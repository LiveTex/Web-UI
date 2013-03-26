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
 * Базовый класс динамического элемента интерфейса - виджета.
 *
 * @see ui.Container
 * @constructor
 * @extends {events.EventDispatcher}
 *
 * @event {ui.WidgetEvent} init Событие инициализации виджета.
 * @event {ui.WidgetEvent} destroy Событие уничтожения виджета.
 *
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!ui.Container=} opt_container Контейнер, к которому относится виджет.
 */
ui.Widget = function(target, opt_container) {
  events.EventDispatcher.call(this, opt_container);

  /**
   * Контейнер к которому относится виджет.
   *
   * @type {ui.Container}
   */
  this.__container = opt_container || null;

  /**
   * Целевой DOM-элемент экземпляра модуля отображения.
   *
   * @type {!Node}
   */
  this.__target = target;
};


util.inherits(ui.Widget, events.EventDispatcher);


/**
 * @type {!RegExp}
 */
ui.Widget.__OPTION_SEPARATOR = /\s*,\s*/;


/**
 * Получение целевого DOM-элемента виджета.
 *
 * @return {!Node} Целевой DOM-элемент.
 */
ui.Widget.prototype.getTarget = function() {
  return this.__target;
};


/**
 * @return {ui.Container}
 */
ui.Widget.prototype.getContainer = function() {
  return this.__container;
};


/**
 * Получение имени виджета.
 *
 * Имя виджета устанавливается в аттрибуте целевого DOM-элемента
 * <code>data-name</code>.
 *
 * @return {string} Имя экземпляра.
 */
ui.Widget.prototype.getName = function() {
  return this.__target.getAttribute('data-name') || '';
};


/**
 * Инициализация виджета.
 */
ui.Widget.prototype.init = function() {
  this.dispatch(new ui.WidgetEvent(this, ui.WidgetEvent.INIT));
};


/**
 * Уничтожение виджета.
 */
ui.Widget.prototype.destroy = function() {
  this.__container = null;
  this.dispatch(new ui.WidgetEvent(this, ui.WidgetEvent.DESTROY));
};


/**
 * Отключение работоспособности виджета.
 */
ui.Widget.prototype.disable = function() {
  util.dom.addClass(this.__target, 'disabled');
};


/**
 * Включение работоспособности виджета.
 */
ui.Widget.prototype.enable = function() {
  util.dom.removeClass(this.__target, 'disabled');
};


/**
 * Проверка работоспособности виджета.
 *
 * @return {boolean} Результат проверки.
 */
ui.Widget.prototype.isEnabled = function() {
  return !util.dom.hasClass(this.__target, 'disabled');
};


/**
 * Выделение объекта отображения.
 */
ui.Widget.prototype.select = function() {
  util.dom.addClass(this.__target, 'active');
};


/**
 * Снятие выделения с объекта.
 */
ui.Widget.prototype.deselect = function() {
  util.dom.removeClass(this.__target, 'active');
};


/**
 * @return {boolean} Результат проверки.
 */
ui.Widget.prototype.isSelected = function() {
  return util.dom.hasClass(this.__target, 'active');
};


/**
 * Установка параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @param {null|string|boolean|number} value Значение параметра.
 */
ui.Widget.prototype.setOption = function(name, value) {
  if (value) {
    this.__target.setAttribute('data-' + name, value);
  } else {
    this.__target.removeAttribute('data-' + value);
  }
};


/**
 * Получение таблицы настроек виджета.
 *
 * @return {!Object.<string, string>} Таблица настроек.
 */
ui.Widget.prototype.getOptions = function() {
  return util.dom.getAttributesData(this.__target);
};


/**
 * Получение параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {string} Значение параметра.
 */
ui.Widget.prototype.getOption = function(name) {
  return this.__target.getAttribute('data-' + name) || '';
};


/**
 * Получение числового параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {number} Строковое значение параметра.
 */
ui.Widget.prototype.getNumberOption = function(name) {
  return Number(this.getOption(name)) || 0;
};


/**
 * Получение булева параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {boolean} Булево значение параметра.
 */
ui.Widget.prototype.getBooleanOption = function(name) {
  return Boolean(this.getOption(name));
};


/**
 * Получение параметра настроек виджета в виде массива.
 *
 * Для получения массива строка значения аттрибута параметра разбивается
 * указанным разделителем. По-умолчанию разделителем является регулярное
 * выражение вида: <code>\s*\,\s*</code>.
 *
 * @param {string} name Имя параметра настроек.
 * @param {(string|RegExp)=} opt_separator Разделитель строки.
 * @return {!Array.<string>} Массив разбитого значения параметра.
 */
ui.Widget.prototype.getArrayOption = function(name, opt_separator) {
  var option = this.getOption(name);

  if (opt_separator === undefined) {
    return option.split(ui.Widget.__OPTION_SEPARATOR);
  }

  return option.split(opt_separator);
};

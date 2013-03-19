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
 * @namespace
 */
var ui = {};

/**
 * @type {string}
 */
ui.VERSION = '0.0.1';

/**
 * @return {string} Идентфикатор.
 */
ui.getNextId = function() {};

/**
 * @param {string} type Тип создаваемого виджета.
 * @param {!Node} target Целевой DOM-элемент.
 * @param {ui.Container=} opt_container Родительский контейнер.
 * @return {ui.Widget} Виджет.
 */
ui.createWidget = function(type, target, opt_container) {};

/**
 * @param {string} type Тип создаваемого виджета.
 * @param {!Node} context Контекст поиска элементов.
 * @param {boolean} useContext Включаит ли элемент контекста в поиск.
 * @param {boolean} useIsolators Принимать ли во внимание классы изоляторы
 *    поиска.
 * @return {!Array.<!Node>} Массив узлов целевых для создания виджетов.
 */
ui.findWidgetTargets = function(type, context, useContext, useIsolators) {};

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
ui.Widget = function(target, opt_container) {};

/**
 * Получение целевого DOM-элемента виджета.
 *
 * @return {!Node} Целевой DOM-элемент.
 */
ui.Widget.prototype.getTarget = function() {};

/**
 * @return {ui.Container}
 */
ui.Widget.prototype.getContainer = function() {};

/**
 * Получение имени виджета.
 *
 * Имя виджета устанавливается в аттрибуте целевого DOM-элемента
 * <code>data-name</code>.
 *
 * @return {?string} Имя экземпляра.
 */
ui.Widget.prototype.getName = function() {};

/**
 * Инициализация виджета.
 */
ui.Widget.prototype.init = function() {};

/**
 * Уничтожение виджета.
 */
ui.Widget.prototype.destroy = function() {};

/**
 * Отключение работоспособности виджета.
 */
ui.Widget.prototype.disable = function() {};

/**
 * Включение работоспособности виджета.
 */
ui.Widget.prototype.enable = function() {};

/**
 * Проверка работоспособности виджета.
 *
 * @return {boolean} Результат проверки.
 */
ui.Widget.prototype.isEnabled = function() {};

/**
 * Выделение объекта отображения.
 */
ui.Widget.prototype.select = function() {};

/**
 * Снятие выделения с объекта.
 */
ui.Widget.prototype.deselect = function() {};

/**
 * @return {boolean} Результат проверки.
 */
ui.Widget.prototype.isSelected = function() {};

/**
 * Установка параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @param {null|string|boolean|number} value Значение параметра.
 */
ui.Widget.prototype.setOption = function(name, value) {};

/**
 * Получение таблицы настроек виджета.
 *
 * @return {!Object.<string, string>} Таблица настроек.
 */
ui.Widget.prototype.getOptions = function() {};

/**
 * Получение параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {string} Значение параметра.
 */
ui.Widget.prototype.getOption = function(name) {};

/**
 * Получение числового параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {number} Строковое значение параметра.
 */
ui.Widget.prototype.getNumberOption = function(name) {};

/**
 * Получение булева параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {boolean} Булево значение параметра.
 */
ui.Widget.prototype.getBooleanOption = function(name) {};

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
ui.Widget.prototype.getArrayOption = function(name, opt_separator) {};

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
 * @extends {events.Event}
 * @param {!events.IEventDispatcher} target Объект, событие которого
 *        произошло.
 * @param {string} type Тип события.
 */
ui.WidgetEvent = function(target, type) {};

/**
 * @type {string}
 */
ui.WidgetEvent.INIT = 'init';

/**
 * @type {string}
 */
ui.WidgetEvent.DESTROY = 'destroy';

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
ui.Container = function(target, opt_container) {};

/**
 * @inheritDoc
 */
ui.Container.prototype.init = function() {};

/**
 * @inheritDoc
 */
ui.Container.prototype.destroy = function() {};

/**
 * @param {string} type Тип виджетов для инициализации.
 */
ui.Container.prototype.initWidgets = function(type) {};

/**
 * @param {string} type Тип виджетов для уничтожения.
 */
ui.Container.prototype.destroyWidgets = function(type) {};

/**
 * Получение виждета по типу и имени.
 *
 * @see ui.Widget#getName
 * @param {string} type Тип виждета.
 * @param {string} name Имя экземпляра виждета.
 * @return {ui.Widget} Виджет.
 */
ui.Container.prototype.getWidget = function(type, name) {};



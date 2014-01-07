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
 * @namespace
 */
ui.buttons = {};


/**
 * @namespace
 */
ui.forms = {};


/**
 * @namespace
 */
ui.templates = {};


/**
 * @namespace
 */
ui.lists = {};


/**
 * @param {string} selector Селектор-изолятор.
 */
ui.addIsolator = function(selector) {
  if (util.indexOf(selector, ui.__isolators) === -1) {
    ui.__isolators.push(selector);
  }
};


/**
 * @return {string} Идентфикатор.
 */
ui.getNextId = function() {
  var id = ui.__ID_PREFIX + (ui.__lastId += 1);

  while (document.getElementById(id) !== null) {
    id = ui.__ID_PREFIX + (ui.__lastId += 1);
  }

  return id;
};


/**
 * @param {!Node} body Тело документа.
 * @param {!ui.IWidgetFactory} factory Фабрика виджетов.
 * @return {!ui.Container} Корнейво контейнер.
 */
ui.init = function(body, factory) {
  ui.__factory = factory;

  var container = new ui.Container(body);
  var type = factory.getContainerType();
  if (type !== '') {
    ui.addIsolator(factory.getTargetSelector(type));
    ui.registerWidget(type, container);
  } else {
    console.warn('Unable to register root container - container widget type ' +
        'is empty, see `ui.IWidgetFactory#getContainerType` for details. ' +
        '[ui.init]');
  }

  return container;
};


/**
 * @param {string} type Тип создаваемого виджета.
 * @param {!Node} target Целевой DOM-элемент.
 * @return {ui.Widget} Виджет.
 */
ui.createWidget = function(type, target) {
  var widget = ui.getWidgetAt(type, target);
  if (widget === null && ui.__factory !== null) {
    widget = ui.__factory.createWidget(type, target);

    if (widget !== null) {
      ui.registerWidget(type, widget);
    }
  }

  return widget;
};


/**
 * @param {string} type Тип виджетов.
 * @param {!ui.Widget} widget Виджет.
 */
ui.registerWidget = function(type, widget) {
  var id = widget.getTargetId();

  if (ui.__widgetNodes[id] === undefined) {
    ui.__widgetNodes[id] = new ui.WidgetNode();
  }

  ui.__widgetNodes[id].addWidget(type, widget);
};


/**
 * @param {string} type Тип виджетов.
 * @param {!ui.Widget} widget Виджет.
 */
ui.terminateWidget = function(type, widget) {
  var id = widget.getTargetId();

  if (ui.__widgetNodes[id] !== undefined) {
    ui.__widgetNodes[id].removeWidget(type);

    if (ui.__widgetNodes[id].getWidgetsCount() === 0) {
      delete ui.__widgetNodes[id];
    }
  }
};


/**
 * @param {!Node} target Целефой узел.
 */
ui.terminateWidgetsAt = function(target) {
  delete ui.__widgetNodes[target.id];
};


/**
 * @param {!Node} target Целефой узел.
 * @return {string} Виджет.
 */
ui.getWidgetName = function(target) {
  return target.getAttribute('data-name') || '';
};


/**
 * @param {!Node} target Целефой узел.
 * @return {!Array.<!ui.Widget>} Виджет.
 */
ui.getWidgetsAt = function(target) {
  if (ui.__widgetNodes[target.id] !== undefined) {
    return ui.__widgetNodes[target.id].getWidgets();
  }

  return [];
};


/**
 * @param {!Node} target Целефой узел.
 * @return {number} Виджет.
 */
ui.getWidgetsCount = function(target) {
  if (ui.__widgetNodes[target.id] !== undefined) {
    return ui.__widgetNodes[target.id].getWidgetsCount();
  }

  return 0;
};


/**
 * @param {string} type Тип виждета.
 * @param {!Node} target Целефой узел.
 * @return {ui.Widget} Виджет.
 */
ui.getWidgetAt = function(type, target) {
  if (ui.__widgetNodes[target.id] !== undefined) {
    return ui.__widgetNodes[target.id].getWidget(type);
  }

  return null;
};


/**
 * @param {!Node} target Целефой узел.
 * @return {ui.Container} Виджет.
 */
ui.getContainerAt = function(target) {
  if (ui.__widgetNodes[target.id] !== undefined) {
    return ui.__widgetNodes[target.id].getContainer();
  }

  return null;
};


/**
 * @param {!Node} target Узел DOM-дерева.
 * @return {ui.Container} Контейнер, которому он принадлежит.
 */
ui.getParentContainer = function(target) {
  var result = null;
  var parents = util.dom.getParents(target);

  for (var i = 0, l = parents.length; i < l; i += 1) {
    result = ui.getContainerAt(parents[i]);

    if (result !== null) {
      break;
    }
  }

  return result;
};


/**
 * @param {string} type Тип создаваемого виджета.
 * @return {string} Селктор.
 */
ui.getTargetSelector = function(type) {
  if (ui.__factory !== null) {
    return ui.__factory.getTargetSelector(type);
  }

  return '';
};


/**
 * @param {string} type Тип создаваемого виджета.
 * @param {!Node} context Контекст поиска элементов.
 * @param {boolean} useContext Включаит ли элемент контекста в поиск.
 * @param {boolean} useIsolators Принимать ли во внимание классы изоляторы
 *    поиска.
 * @return {!Array.<!Node>} Массив узлов целевых для создания виджетов.
 */
ui.findWidgetTargets = function(type, context, useContext, useIsolators) {
  var targets = [];
  var selector = '';

  if (ui.__factory !== null) {
    selector = ui.__factory.getTargetSelector(type);
  }

  if (selector !== '') {
    var applicants = ui.__findApplicants(context, selector, useContext);

    var i = 0,
        l = applicants.length;

    while (i < l) {
      if (ui.__isInContext(applicants[i], context, useIsolators)) {
        targets.push(applicants[i]);
      }

      i++;
    }
  }

  return targets;
};


/**
 * @type {string}
 */
ui.__ID_PREFIX = 'tuna_';


/**
 * @type {number}
 */
ui.__lastId = 0;


/**
 * @type {!Array.<string>}
 */
ui.__isolators = [];


/**
 * @type {ui.IWidgetFactory}
 */
ui.__factory = null;


/**
 * @type {!Object.<string, !ui.WidgetNode>}
 */
ui.__widgetNodes = {};


/**
 * @param {!Node} context Контекст поиска элементов.
 * @param {string} selector Селектор поиска.
 * @param {boolean} useContext Включаит ли элемент контекста в поиск.
 * @return {!Array.<!Node>}
 */
ui.__findApplicants = function(context, selector, useContext) {
  var result = util.dom.select(selector, context);

  if (useContext && util.dom.matchesSelector(context, selector)) {
    result.push(context);
  }

  return result;
};


/**
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!Node} context Контекcт поиска.
 * @param {boolean} useIsolators Принимать ли во внимание классы изоляторы
 *    поиска.
 * @return {boolean} Результат проверки.
 */
ui.__isInContext = function(target, context, useIsolators) {
  if (target !== context) {
    var i = 0,
        l = ui.__isolators.length;

    while (i < l) {
      var isolator = ui.__isolators[i];

      if (!useIsolators &&
          util.dom.getParentMatches(target, isolator, context) !== null) {
        return false;
      }

      i += 1;
    }

  }

  return true;
};

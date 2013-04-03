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
 * @param {!ui.IWidgetFactory} widgetFactory Фабрика виджетов.
 */
ui.setWidgetFactory = function(widgetFactory) {
  ui.__factory = widgetFactory;
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
 * @param {string} type Тип создаваемого виджета.
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!ui.Container=} opt_container Родительский контейнер.
 * @return {ui.Widget} Виджет.
 */
ui.createWidget = function(type, target, opt_container) {
  if (ui.__factory !== null) {
    return ui.__factory.createWidget(type, target, opt_container);
  }

  return null;
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

      if (!useIsolators && util.dom.hasClass(target, isolator) ||
          util.dom.getParentWithClass(target, isolator, context) !== null) {
        return false;
      }

      i += 1;
    }

  }

  return true;
};

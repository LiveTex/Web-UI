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
 * @extends {ui.templates.Template}
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!ui.Container} container Контейнер, к которому относится виджет.
 */
ui.templates.TunaTemplate = function(target, container) {
  ui.templates.Template.call(this, target, container);

  /**
   * @type {tt.Template}
   */
  this.__template = null;

  /**
   * @type {*}
   */
  this.__currentData = null;
};

util.inherits(ui.templates.TunaTemplate, ui.templates.Template);


/**
 * @type {string}
 */
ui.templates.TunaTemplate.NAME = 'tuna-template';


/**
 * @inheritDoc
 */
ui.templates.TunaTemplate.prototype.processTransform = function(data) {
  if (this.__template !== null) {
    var container = this.getContainer();
    var created = [],
        removed = [];

    this.__template.processData(data, created, removed);

    for (var i = 0; i < created.length; i += 1) {
      container.initWidgets(created[i]);
    }

    for (var j = 0; j < removed.length; j += 1) {
      container.initWidgets(removed[j]);
    }
  }

  this.__currentData = data;
};


/**
 * @inheritDoc
 */
ui.templates.TunaTemplate.prototype.init = function() {
  var url = this.getOption('template-url');
  if (url.length > 0) {
    this.loadTemplateSign(url);
  }

  ui.templates.Template.prototype.init.call(this);
};


/**
 * @inheritDoc
 */
ui.templates.TunaTemplate.prototype.destroy = function() {
  this.__currentData = null;
  this.__template = null;

  ui.templates.Template.prototype.destroy.call(this);
};


/**
 * @param {!Object.<string, !Object>} sign Разметка шаблона.
 */
ui.templates.TunaTemplate.prototype.setTemplateSign = function(sign) {
  this.__template = tt.createTemplate(this.getTarget(), sign);
  this.processTransform(this.__currentData);
};


/**
 * @param {string} url Адрес шаблона.
 */
ui.templates.TunaTemplate.prototype.loadTemplateSign = function(url) {
  var self = this;
  var request = net.createRequest();

  /**
   * @param {!events.Event} event Объект события.
   * @param {*=} opt_data Данные события.
   */
  function handleTemplate(event, opt_data) {
    request.removeEventListener(net.RequestEvent.COMPLETE, handleTemplate);

    if (typeof opt_data === 'string') {
      var sign = util.decodeJsonData(opt_data);
      if (sign instanceof Object) {
        self.setTemplateSign(sign);
      }
    }
  }

  request.addEventListener(net.RequestEvent.COMPLETE, handleTemplate);
  request.send('', url);
};

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
 * @extends {ui.Widget}
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!ui.Container} container Контейнер, к которому относится виджет.
 */
ui.forms.Form = function(target, container) {
  ui.Widget.call(this, target, container);
};


util.inherits(ui.forms.Form, ui.Widget);


/**
 * @type {string}
 */
ui.forms.Form.NAME = 'form';


/**
 * @type {string}
 */
ui.forms.Form.__CALLBACK_PREFIX = 'tuna_form_callback_';


/**
 * @inheritDoc
 */
ui.forms.Form.prototype.init = function() {
  var target = this.getTarget();

  var markInput = document.createElement('input');
  markInput.type = 'hidden';
  markInput.name = '__t';
  markInput.value = 'form';

  var callbackInput = document.createElement('input');
  callbackInput.type = 'hidden';
  callbackInput.name = '__c';

  target.appendChild(markInput);
  target.appendChild(callbackInput);

  var self = this;

  util.dom.addEventListener(target, 'submit', function(event) {
    if (self.isEnabled()) {
      var eventPassed = self.dispatch(
          new ui.forms.FormEvent(self, ui.forms.FormEvent.SUBMIT));

      if (eventPassed) {
        var callback = ui.forms.Form.__CALLBACK_PREFIX +
            String(Math.random()).substr(2);

        window[callback] = function(response) {
          self.__handleResponse(response);
          window[callback] = undefined;
        };

        callbackInput.value = callback;
      } else {
        util.dom.preventDefault(event);
      }
    } else {
      util.dom.preventDefault(event);
    }
  });

  util.dom.addEventListener(target, 'reset', function(event) {
    if (self.isEnabled()) {
      var eventPassed = self.dispatch(
          new ui.forms.FormEvent(self, ui.forms.FormEvent.RESET));

      if (!eventPassed) {
        util.dom.preventDefault(event);
      }
    } else {
      util.dom.preventDefault(event);
    }
  });

  ui.Widget.prototype.init.call(this);
};


/**
 *
 */
ui.forms.Form.prototype.submit = function() {
  this.getTarget().submit();
};


/**
 *
 */
ui.forms.Form.prototype.reset = function() {
  this.getTarget().reset();
};


/**
 * @param {string} param Параметр с ошибкой.
 * @param {string} message Сообщение об ошибке.
 */
ui.forms.Form.prototype.showParamError = function(param, message) {
  alert(param + '' + message);
};


/**
 * @param {string} message Сообщение об ошибке.
 */
ui.forms.Form.prototype.cancel = function(message) {
  this.dispatch(
      new ui.forms.FormEvent(this, ui.forms.FormEvent.CANCEL), message);
};


/**
 * @param {*=} opt_result Сопуствующие событию данные.
 */
ui.forms.Form.prototype.complete = function(opt_result) {
  this.dispatch(
      new ui.forms.FormEvent(this, ui.forms.FormEvent.COMPLETE), opt_result);
};


/**
 * @param {string} response Результат обработки формы.
 */
ui.forms.Form.prototype.__handleResponse = function(response) {
  var eventPassed = this.dispatch(
      new ui.forms.FormEvent(this, ui.forms.FormEvent.RESPONSE), response);

  if (eventPassed) {
    ui.forms.handleFormResponse(this, response);
  }
};


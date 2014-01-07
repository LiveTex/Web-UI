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
 */
ui.forms.Form = function(target) {
  ui.Widget.call(this, target);
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

  var fallbackInput = document.createElement('input');
  fallbackInput.type = 'hidden';
  fallbackInput.name = '__fallback__';
  fallbackInput.value = '1';

  var markInput = document.createElement('input');
  markInput.type = 'hidden';
  markInput.name = '_t';
  markInput.value = 'form';

  var callbackInput = document.createElement('input');
  callbackInput.type = 'hidden';
  callbackInput.name = '_c';

  target.appendChild(fallbackInput);
  target.appendChild(markInput);
  target.appendChild(callbackInput);

  var self = this;

  util.dom.addEventListener(target, 'submit', function(event) {
    if (self.isEnabled()) {
      self.__clearErrors();

      var eventPassed = self.dispatch(
          new ui.forms.FormEvent(self, ui.forms.FormEvent.SUBMIT));

      if (eventPassed) {
        var callback = ui.forms.Form.__CALLBACK_PREFIX +
            String(Math.random()).substr(2);

        window[callback] = function(response, code) {
          self.__handleResponse(response, code);
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
      self.__clearErrors();

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
  var form = this.getTarget();

  var inputElement = util.dom.selectOne('.j-' + param + '-input', form);
  if (inputElement !== null) {
    util.dom.addClass(inputElement, 'error');
  }

  var errorElement = util.dom.selectOne('.j-' + param + '-error', form);
  if (errorElement !== null) {
    errorElement.innerHTML = message;

    util.dom.removeClass(errorElement, 'hide');
  }
};


/**
 * @param {string} message Сообщение об ошибке.
 */
ui.forms.Form.prototype.cancel = function(message) {
  var errorElement = util.dom.selectOne('.j-form-error', this.getTarget());
  if (errorElement !== null) {
    errorElement.innerHTML = message;

    util.dom.removeClass(errorElement, 'hide');
  }

  this.dispatch(
      new ui.forms.FormEvent(this, ui.forms.FormEvent.CANCEL), message);
};


/**
 * Очищение отображения ошибок.
 */
ui.forms.Form.prototype.__clearErrors = function() {
  var form = this.getTarget();

  var errorElements = util.dom.select('.j-error', form);
  while (errorElements.length > 0) {
    util.dom.addClass(errorElements.shift(), 'hide');
  }

  var inputElements = util.dom.select('.j-input', form);
  while (inputElements.length > 0) {
    util.dom.removeClass(inputElements.shift(), 'error');
  }
};


/**
 *
 */
ui.forms.Form.prototype.complete = function() {
  this.dispatch(new ui.forms.FormEvent(this, ui.forms.FormEvent.COMPLETE));
};


/**
 * @param {string} data Результат обработки формы.
 * @param {number} code Код резульатата.
 */
ui.forms.Form.prototype.__handleResponse = function(data, code) {
  var event = new net.RequestEvent(
      this, ui.forms.FormEvent.RESPONSE, code, data);

  var eventPassed = this.dispatch(event, data);
  if (eventPassed) {
    ui.forms.handleFormResponse(this, event);
  }
};


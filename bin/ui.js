var ui = {};
ui.VERSION = "0.0.1";
ui.getNextId = function() {
  var id = ui.__ID_PREFIX + (ui.__lastId += 1);
  while(document.getElementById(id) !== null) {
    id = ui.__ID_PREFIX + (ui.__lastId += 1)
  }
  return id
};
ui.createWidget = function(type, target, opt_container) {
  return null
};
ui.findWidgetTargets = function(type, context, useContext, useIsolators) {
  var applicants = ui.__findApplicants(context, "", useContext);
  var i = 0, l = applicants.length;
  var targets = [];
  while(i < l) {
    if(ui.__isInContext(applicants[i], context, useIsolators)) {
      targets.push(applicants[i])
    }
    i++
  }
  return targets
};
ui.__ID_PREFIX = "tuna_";
ui.__lastId = 0;
ui.__isolators = [];
ui.__findApplicants = function(context, selector, useContext) {
  var result = util.dom.select(selector, context);
  if(useContext && util.dom.matchesSelector(context, selector)) {
    result.push(context)
  }
  return result
};
ui.__isInContext = function(target, context, useIsolators) {
  if(target !== context) {
    var i = 0, l = ui.__isolators.length;
    while(i < l) {
      var isolator = ui.__isolators[i];
      if(!useIsolators && util.dom.hasClass(target, isolator) || util.dom.getParentWithClass(target, isolator, context) !== null) {
        return false
      }
      i += 1
    }
  }
  return true
};
ui.Widget = function(target, opt_container) {
  events.EventDispatcher.call(this, opt_container);
  this.__container = opt_container || null;
  this.__target = target
};
util.inherits(ui.Widget, events.EventDispatcher);
ui.Widget.__OPTION_SEPARATOR = /\s*,\s*/;
ui.Widget.prototype.getTarget = function() {
  return this.__target
};
ui.Widget.prototype.getContainer = function() {
  return this.__container
};
ui.Widget.prototype.getName = function() {
  return this.__target.getAttribute("data-name")
};
ui.Widget.prototype.init = function() {
  this.dispatch(new ui.WidgetEvent(this, ui.WidgetEvent.INIT))
};
ui.Widget.prototype.destroy = function() {
  this.__container = null;
  this.dispatch(new ui.WidgetEvent(this, ui.WidgetEvent.DESTROY))
};
ui.Widget.prototype.disable = function() {
  util.dom.addClass(this.__target, "disabled")
};
ui.Widget.prototype.enable = function() {
  util.dom.removeClass(this.__target, "disabled")
};
ui.Widget.prototype.isEnabled = function() {
  return!util.dom.hasClass(this.__target, "disabled")
};
ui.Widget.prototype.select = function() {
  util.dom.addClass(this.__target, "active")
};
ui.Widget.prototype.deselect = function() {
  util.dom.removeClass(this.__target, "active")
};
ui.Widget.prototype.isSelected = function() {
  return util.dom.hasClass(this.__target, "active")
};
ui.Widget.prototype.setOption = function(name, value) {
  if(value) {
    this.__target.setAttribute("data-" + name, value)
  }else {
    this.__target.removeAttribute("data-" + value)
  }
};
ui.Widget.prototype.getOptions = function() {
  return util.dom.getAttributesData(this.__target)
};
ui.Widget.prototype.getOption = function(name) {
  return this.__target.getAttribute("data-" + name) || ""
};
ui.Widget.prototype.getNumberOption = function(name) {
  return Number(this.getOption(name)) || 0
};
ui.Widget.prototype.getBooleanOption = function(name) {
  return Boolean(this.getOption(name))
};
ui.Widget.prototype.getArrayOption = function(name, opt_separator) {
  var option = this.getOption(name);
  if(opt_separator === undefined) {
    return option.split(ui.Widget.__OPTION_SEPARATOR)
  }
  return option.split(opt_separator)
};
ui.WidgetEvent = function(target, type) {
  events.Event.call(this, target, type)
};
util.inherits(ui.WidgetEvent, events.Event);
ui.WidgetEvent.INIT = "init";
ui.WidgetEvent.DESTROY = "destroy";
ui.Container = function(target, opt_container) {
  ui.Widget.call(this, target, opt_container);
  this.__widgetTypes = {}
};
util.inherits(ui.Container, ui.Widget);
ui.Container.prototype.init = function() {
  var types = this.getArrayOption("widgets");
  var i = 0, l = types.length;
  while(i < l) {
    this.initWidgets(types[i]);
    i += 1
  }
  ui.Widget.prototype.init.call(this)
};
ui.Container.prototype.destroy = function() {
  for(var type in this.__widgetTypes) {
    while(this.__widgetTypes[type].length > 0) {
      this.__widgetTypes[type].shift().destroy()
    }
    delete this.__widgetTypes[type]
  }
  ui.Widget.prototype.destroy.call(this)
};
ui.Container.prototype.initWidgets = function(type) {
  this.destroyWidgets(type);
  var targets = ui.findWidgetTargets(type, this.getTarget(), true, false);
  var widgets = [];
  while(targets.length > 0) {
    var widget = ui.createWidget(type, targets.shift(), this);
    if(widget !== null) {
      widget.init();
      widgets.push(widget)
    }
  }
  this.__widgetTypes[type] = widgets
};
ui.Container.prototype.destroyWidgets = function(type) {
  if(this.__widgetTypes[type] !== undefined) {
    while(this.__widgetTypes[type].length > 0) {
      this.__widgetTypes[type].shift().destroy()
    }
    delete this.__widgetTypes[type]
  }
};
ui.Container.prototype.getWidget = function(type, name) {
  var widgets = this.__widgetTypes[type];
  if(widgets !== undefined) {
    var i = 0, l = widgets.length;
    while(i < l) {
      if(name === widgets[i].getName()) {
        return widgets[i]
      }
      i += 1
    }
  }
  return null
};


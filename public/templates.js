(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['drink_entry'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <option value=\""
    + alias1(container.lambda((depth0 != null ? lookupProperty(depth0,"drink_id") : depth0), depth0))
    + "\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"Base Flavor") || (depth0 != null ? lookupProperty(depth0,"Base Flavor") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Base Flavor","hash":{},"data":data,"loc":{"start":{"line":6,"column":42},"end":{"line":6,"column":59}}}) : helper)))
    + "</option>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <option value=\""
    + alias1(container.lambda((depth0 != null ? lookupProperty(depth0,"add_on_id") : depth0), depth0))
    + "\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"Topping") || (depth0 != null ? lookupProperty(depth0,"Topping") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Topping","hash":{},"data":data,"loc":{"start":{"line":14,"column":43},"end":{"line":14,"column":56}}}) : helper)))
    + "</option>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li>\r\n    <label for=\"input-drink_id\" class=\"required-field\">Drink Flavor</label>\r\n    <select name=\"input-drink_id\" class=\"input-drink_id\">\r\n        <option value=\"\"></option>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"drinks") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":7,"column":17}}})) != null ? stack1 : "")
    + "    </select>\r\n\r\n    <label for=\"input-add_on_id\">Topping</label>\r\n    <select name=\"input-add_on_id\" class=\"input-add_on_id\">\r\n        <option value=\"\"></option>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"addons") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":8},"end":{"line":15,"column":17}}})) != null ? stack1 : "")
    + "    </select>\r\n\r\n    <label for=\"input-sweetness_lvl\" class=\"required-field\">Sweetness</label>\r\n    <select name=\"input-sweetness_lvl\" class=\"input-sweetness_lvl\">\r\n        <option value=\"100\">100%</option>\r\n        <option value=\"75\">75%</option>\r\n        <option value=\"25\">25%</option>\r\n        <option value=\"0\">0%</option>\r\n    </select>\r\n\r\n    <label for=\"input-drink_size\" class=\"required-field\">Size</label>\r\n    <select name=\"input-drink_size\" class=\"input-drink_size\">\r\n        <option value=\"R\">Regular</option>\r\n        <option value=\"S\">Small</option>\r\n    </select>\r\n\r\n    <button class=\"remove-drink\">−</button>\r\n</li>";
},"useData":true});
})();
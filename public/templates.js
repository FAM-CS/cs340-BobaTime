(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['addons_entry'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <option value=\""
    + alias1(container.lambda((depth0 != null ? lookupProperty(depth0,"add_on_id") : depth0), depth0))
    + "\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"Topping") || (depth0 != null ? lookupProperty(depth0,"Topping") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"Topping","hash":{},"data":data,"loc":{"start":{"line":6,"column":43},"end":{"line":6,"column":56}}}) : helper)))
    + ", $"
    + alias1(((helper = (helper = lookupProperty(helpers,"Price") || (depth0 != null ? lookupProperty(depth0,"Price") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"Price","hash":{},"data":data,"loc":{"start":{"line":6,"column":59},"end":{"line":6,"column":70}}}) : helper)))
    + "</option>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li>\r\n    <label for=\"input-add_on_id\">Topping</label>\r\n    <select name=\"input-add_on_id\" class=\"input-add_on_id\">\r\n        <option value=\"\"></option>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"addons") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":7,"column":17}}})) != null ? stack1 : "")
    + "    </select>\r\n\r\n    <label for=\"input-add_on_quantity\">Quantity</label>\r\n    <select name=\"input-add_on_quantity\" class=\"input-add_on_quantity\">\r\n        <option value=\"1\">1</option>\r\n        <option value=\"2\">2</option>\r\n        <option value=\"3\">3</option>\r\n    </select>\r\n</li>";
},"useData":true});
templates['drink_entry'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <option value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"Drink ID") || (depth0 != null ? lookupProperty(depth0,"Drink ID") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Drink ID","hash":{},"data":data,"loc":{"start":{"line":6,"column":23},"end":{"line":6,"column":37}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"Base Flavor") || (depth0 != null ? lookupProperty(depth0,"Base Flavor") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Base Flavor","hash":{},"data":data,"loc":{"start":{"line":6,"column":39},"end":{"line":6,"column":56}}}) : helper)))
    + "</option>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li>\r\n    <label for=\"input-drink_id\" class=\"required-field\">Drink Flavor</label>\r\n    <select name=\"input-drink_id\" class=\"input-drink_id\">\r\n        <option value=\"\"></option>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"drinks") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":7,"column":17}}})) != null ? stack1 : "")
    + "    </select>\r\n\r\n    <label for=\"input-amt_add_on\">Number of toppings</label>\r\n    <select name=\"input-amt_add_on\" class=\"input-amt_add_on\">\r\n        <option value=\"0\">0</option>\r\n        <option value=\"1\">1</option>\r\n        <option value=\"2\">2</option>\r\n        <option value=\"3\">3</option>\r\n        <option value=\"4\">4</option>\r\n    </select>\r\n\r\n    <label for=\"input-sweetness_lvl\" class=\"required-field\">Sweetness</label>\r\n    <select name=\"input-sweetness_lvl\" class=\"input-sweetness_lvl\">\r\n        <option value=\"100\">100%</option>\r\n        <option value=\"75\">75%</option>\r\n        <option value=\"25\">25%</option>\r\n        <option value=\"0\">0%</option>\r\n    </select>\r\n\r\n    <label for=\"input-drink_size\" class=\"required-field\">Size</label>\r\n    <select name=\"input-drink_size\" class=\"input-drink_size\">\r\n        <option value=\"R\">Regular</option>\r\n        <option value=\"S\">Small</option>\r\n    </select>\r\n\r\n    <label for=\"input-price\">\r\n        Price: $\r\n        <output class=\"input-price\" name=\"input-price\">0</output>\r\n    </label>\r\n\r\n    <button class=\"remove-drink\">−</button>\r\n\r\n    <br/>\r\n    <div class=\"topping-entry-container\">\r\n        <ol class=\"drink-addons\">\r\n        </ol>\r\n    </div>\r\n</li>";
},"useData":true});
})();
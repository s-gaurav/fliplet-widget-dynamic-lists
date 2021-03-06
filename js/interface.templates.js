this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.interface.field-token"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<input class=\"form-control tokenfield\" type=\"text\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type field name and hit enter\" />";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.interface.filter-panels"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "right";
},"3":function(container,depth0,helpers,partials,data) {
    return "down";
},"5":function(container,depth0,helpers,partials,data) {
    return "in";
},"7":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "              <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"panel panel-default filter-panel\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"panel-heading ui-sortable-handle\">\n    <h4 class=\"panel-title\" data-toggle=\"collapse\" data-parent=\"#filter-accordion\" data-target=\"#collapse-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n      <div class=\"screen-reorder-handle\">\n        <i class=\"fa fa-ellipsis-v\"></i><i class=\"fa fa-ellipsis-v\"></i>\n      </div>\n      <span class=\"fa fa-chevron-"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fromLoading : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\"></span>\n      <span class=\"panel-title-text\">\n        <span class=\"column\">"
    + alias4(((helper = (helper = helpers.column || (depth0 != null ? depth0.column : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"column","hash":{},"data":data}) : helper)))
    + "</span> - <span class=\"logic\">"
    + alias4(((helper = (helper = helpers.logic || (depth0 != null ? depth0.logic : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logic","hash":{},"data":data}) : helper)))
    + "</span> - <span class=\"value\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</span>\n      </span>\n    </h4>\n    <a href=\"#\"><span class=\"icon-delete fa fa-trash\"></span></a>\n  </div>\n  <div id=\"collapse-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.fromLoading : depth0),{"name":"unless","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n    <div class=\"panel-body\">\n\n      <div class=\"form-group clearfix\">\n        <div class=\"col-sm-4 control-label\">\n          <label>Data field name</label>\n        </div>\n        <div class=\"col-sm-8\">\n          <label for=\"select-data-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"select-proxy-display\">\n            <select name=\"select-data-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" id=\"select-data-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-field=\"field\" data-label=\"-- Select a data field\" class=\"hidden-select form-control\">\n              <option value=\"none\">-- Select a data field</option>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.columns : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n            <span class=\"icon fa fa-chevron-down\"></span>\n            <span class=\"select-value-proxy\">-- Please wait</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"form-group clearfix\">\n        <div class=\"col-sm-4 control-label\">\n          <label>Logic</label>\n        </div>\n        <div class=\"col-sm-8\">\n          <label for=\"logic-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"select-proxy-display\">\n            <select name=\"logic-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" id=\"logic-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-field=\"logic\" data-label=\"-- Select an option\" class=\"hidden-select form-control\">\n              <option value=\"none\">-- Select an option</option>\n              <option value=\"==\">Equals</option>\n              <option value=\"!=\">Doesn't equal</option>\n              <option value=\"contains\">Contains</option>\n              <option value=\"notcontain\">Doesn't contain</option>\n              <option value=\"regex\">Regex</option>\n              <option value=\">\">Greater than</option>\n              <option value=\">=\">Greater or equal to</option>\n              <option value=\"<\">Less than</option>\n              <option value=\"<=\">Less or equal to</option>\n            </select>\n            <span class=\"icon fa fa-chevron-down\"></span>\n            <span class=\"select-value-proxy\">-- Please wait</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"form-group clearfix\">\n        <div class=\"col-sm-4 control-label\">\n          <label for=\"value-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">Value</label>\n        </div>\n        <div class=\"col-sm-8\">\n          <input type=\"text\" name=\"value-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" id=\"value-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-field=\"value\" class=\"form-control\">\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.interface.layouts"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <div class=\"layout-holder\" data-layout=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"layout-info\">\n      <p class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.warning : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</p>\n      <p class=\"description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\n    </div>\n    <div class=\"image-holder\">\n      <div class=\"selected-screen\">\n        <i class=\"fa fa-check-circle\"></i>\n        <div class=\"layout-info\">\n          \n        </div>\n      </div>\n      <img class=\"animated-gif\" src=\""
    + alias4(((helper = (helper = helpers.gif || (depth0 != null ? depth0.gif : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gif","hash":{},"data":data}) : helper)))
    + "\" />\n      <img class=\"static-img\" src=\""
    + alias4(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data}) : helper)))
    + "\" />\n    </div>\n  </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"label label-warning\">"
    + container.escapeExpression(((helper = (helper = helpers.warning || (depth0 != null ? depth0.warning : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"warning","hash":{},"data":data}) : helper)))
    + "</span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.interface.sort-panels"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "right";
},"3":function(container,depth0,helpers,partials,data) {
    return "down";
},"5":function(container,depth0,helpers,partials,data) {
    return "in";
},"7":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "              <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"panel panel-default sort-panel\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"panel-heading ui-sortable-handle\">\n    <h4 class=\"panel-title\" data-toggle=\"collapse\" data-parent=\"#sort-accordion\" data-target=\"#collapse-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n      <div class=\"screen-reorder-handle\">\n        <i class=\"fa fa-ellipsis-v\"></i><i class=\"fa fa-ellipsis-v\"></i>\n      </div>\n      <span class=\"fa fa-chevron-"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fromLoading : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\"></span>\n      <span class=\"panel-title-text\">\n        <span class=\"column\">"
    + alias4(((helper = (helper = helpers.column || (depth0 != null ? depth0.column : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"column","hash":{},"data":data}) : helper)))
    + "</span> - <span class=\"sort-by\">"
    + alias4(((helper = (helper = helpers.sortBy || (depth0 != null ? depth0.sortBy : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sortBy","hash":{},"data":data}) : helper)))
    + "</span> - <span class=\"order-by\">"
    + alias4(((helper = (helper = helpers.orderBy || (depth0 != null ? depth0.orderBy : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"orderBy","hash":{},"data":data}) : helper)))
    + "</span>\n      </span>\n    </h4>\n    <a href=\"#\"><span class=\"icon-delete fa fa-trash\"></span></a>\n  </div>\n  <div id=\"collapse-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.fromLoading : depth0),{"name":"unless","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n    <div class=\"panel-body\">\n\n      <div class=\"form-group clearfix\">\n        <div class=\"col-sm-4 control-label\">\n          <label>Data field name</label>\n        </div>\n        <div class=\"col-sm-8\">\n          <label for=\"select-data-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"select-proxy-display\">\n            <select name=\"select-data-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" id=\"select-data-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-field=\"field\" data-label=\"-- Select a data field\" class=\"hidden-select form-control\">\n              <option value=\"none\">-- Select a data field</option>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.columns : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n            <span class=\"icon fa fa-chevron-down\"></span>\n            <span class=\"select-value-proxy\">-- Please wait</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"form-group clearfix\">\n        <div class=\"col-sm-4 control-label\">\n          <label>Sort by</label>\n        </div>\n        <div class=\"col-sm-8\">\n          <label for=\"sort-by-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"select-proxy-display\">\n            <select name=\"sort-by-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" id=\"sort-by-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-field=\"sort\" data-label=\"-- Select an option\" class=\"hidden-select form-control\">\n              <option value=\"none\">-- Select an option</option>\n              <option value=\"alphabetical\">Alphabetical (A-Z)</option>\n              <option value=\"numerical\">Numerical (0-9)</option>\n              <option value=\"date\">Date</option>\n            </select>\n            <span class=\"icon fa fa-chevron-down\"></span>\n            <span class=\"select-value-proxy\">-- Please wait</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"form-group clearfix\">\n        <div class=\"col-sm-4 control-label\">\n          <label>Order by</label>\n        </div>\n        <div class=\"col-sm-8\">\n          <label for=\"order-by-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"select-proxy-display\">\n            <select name=\"order-by-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" id=\"order-by-field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-field=\"order\" data-label=\"-- Select an option\" class=\"hidden-select form-control\">\n              <option value=\"none\">-- Select an option</option>\n              <option value=\"ascending\">Ascending</option>\n              <option value=\"descending\">Descending</option>\n            </select>\n            <span class=\"icon fa fa-chevron-down\"></span>\n            <span class=\"select-value-proxy\">-- Please wait</span>\n          </label>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>";
},"useData":true});
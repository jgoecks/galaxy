define(["mvc/base-mvc","utils/localization"],function(a,b){"use strict";var c="user",d=Backbone.View.extend(a.LoggableMixin).extend({_logNamespace:c,options:{warnAtPercent:85,errorAtPercent:100},initialize:function(a){this.log(this+".initialize:",a),_.extend(this.options,a),this.listenTo(this.model,"change:quota_percent change:total_disk_usage",this.render)},update:function(a){return this.log(this+" updating user data...",a),this.model.loadFromApi(this.model.get("id"),a),this},isOverQuota:function(){return null!==this.model.get("quota_percent")&&this.model.get("quota_percent")>=this.options.errorAtPercent},_render_quota:function(){var a=this.model.toJSON(),b=a.quota_percent,c=$(this._templateQuotaMeter(a)),d=c.find(".progress-bar");return this.isOverQuota()?(d.attr("class","progress-bar progress-bar-danger"),c.find(".quota-meter-text").css("color","white"),this.trigger("quota:over",a)):b>=this.options.warnAtPercent?(d.attr("class","progress-bar progress-bar-warning"),this.trigger("quota:under quota:under:approaching",a)):(d.attr("class","progress-bar progress-bar-success"),this.trigger("quota:under quota:under:ok",a)),c},_render_usage:function(){var a=$(this._templateUsage(this.model.toJSON()));return this.log(this+".rendering usage:",a),a},render:function(){var a=null;return this.log(this+".model.quota_percent:",this.model.get("quota_percent")),a=null===this.model.get("quota_percent")||void 0===this.model.get("quota_percent")?this._render_usage():this._render_quota(),this.$el.html(a),this.$el.find(".quota-meter-text").tooltip(),this},_templateQuotaMeter:function(a){return['<div id="quota-meter" class="quota-meter progress">','<div class="progress-bar" style="width: ',a.quota_percent,'%"></div>','<div class="quota-meter-text" style="top: 6px"',a.nice_total_disk_usage?' title="Using '+a.nice_total_disk_usage+'">':">",b("Using")," ",a.quota_percent,"%","</div>","</div>"].join("")},_templateUsage:function(a){return['<div id="quota-meter" class="quota-meter" style="background-color: transparent">','<div class="quota-meter-text" style="top: 6px; color: white">',a.nice_total_disk_usage?b("Using ")+a.nice_total_disk_usage:"","</div>","</div>"].join("")},toString:function(){return"UserQuotaMeter("+this.model+")"}});return{UserQuotaMeter:d}});
//# sourceMappingURL=../../../maps/mvc/user/user-quotameter.js.map
define(["utils/utils","mvc/upload/upload-model","mvc/upload/composite/composite-row","mvc/ui/ui-popover","mvc/ui/ui-select","mvc/ui/ui-misc"],function(a,b,c,d,e,f){return Backbone.View.extend({select_extension:null,select_genome:null,collection:new b.Collection,initialize:function(a){this.app=a,this.options=a.options,this.list_extensions=a.list_extensions,this.list_genomes=a.list_genomes,this.ui_button=a.ui_button;var b=this;this.setElement(this._template()),this.btnStart=new f.Button({title:"Start",onclick:function(){b._eventStart()}}),this.btnClose=new f.Button({title:"Close",onclick:function(){b.app.modal.hide()}});var c=[this.btnStart,this.btnClose];for(var d in c)this.$("#upload-buttons").prepend(c[d].$el);this.select_extension=new e.View({css:"footer-selection",container:this.$("#footer-extension"),data:_.filter(this.list_extensions,function(a){return a.composite_files}),onchange:function(a){b.collection.reset();var c=_.findWhere(b.list_extensions,{id:a});c&&c.composite_files&&b.collection.add(c.composite_files)}}),this.$("#footer-extension-info").on("click",function(a){b.showExtensionInfo({$el:$(a.target),title:b.select_extension.text(),extension:b.select_extension.value(),placement:"top"})}).on("mousedown",function(a){a.preventDefault()}),this.select_genome=new e.View({css:"footer-selection",container:this.$("#footer-genome"),data:this.list_genomes,value:this.options.default_genome}),this.collection.on("add",function(a){b._eventAnnounce(a)}),this.collection.on("reset",function(){}),this.select_extension.options.onchange(this.select_extension.value()),this._updateScreen()},_eventRemove:function(a){var b=a.get("status");"success"==b?this.counter.success--:"error"==b?this.counter.error--:this.counter.announce--,this._updateScreen(),this.uploadbox.remove(a.id)},_eventAnnounce:function(a){console.log(a);var b=new c(this,{id:this.collection.size(),file_name:a.get("description")||a.get("name")||"Unavailable"});this.$("#upload-table > tbody:first").append(b.$el),b.render(),this.collection.size()>0?this.$("#upload-table").show():this.$("#upload-table").hide()},_eventInitialize:function(a,b){return},_eventProgress:function(a,b,c){var d=this.collection.get(a);d.set("percentage",c),this.ui_button.set("percentage",this._uploadPercentage(c,b.size))},_eventSuccess:function(a){var b=this.collection.get(a);b.set("percentage",100),b.set("status","success");var c=b.get("file_size");this.ui_button.set("percentage",this._uploadPercentage(100,c)),this.upload_completed+=100*c,this.counter.announce--,this.counter.success++,this._updateScreen(),Galaxy.currHistoryPanel.refreshContents()},_eventError:function(a,b,c){var d=this.collection.get(a);d.set("percentage",100),d.set("status","error"),d.set("info",c),this.ui_button.set("percentage",this._uploadPercentage(100,b.size)),this.ui_button.set("status","danger"),this.upload_completed+=100*b.size,this.counter.announce--,this.counter.error++,this._updateScreen()},_eventComplete:function(){this.collection.each(function(a){"queued"==a.get("status")&&a.set("status","init")}),this.counter.running=0,this._updateScreen()},showExtensionInfo:function(a){var b=a.$el,c=a.extension,e=a.title,f=_.findWhere(this.list_extensions,{id:c});this.extension_popup&&this.extension_popup.remove(),this.extension_popup=new d.View({placement:a.placement||"bottom",container:b,destroy:!0}),this.extension_popup.title(e),this.extension_popup.empty(),this.extension_popup.append(this._templateDescription(f)),this.extension_popup.show()},_eventStart:function(){if(!(0==this.counter.announce||this.counter.running>0)){var a=this;this.upload_size=0,this.upload_completed=0,this.collection.each(function(b){"init"==b.get("status")&&(b.set("status","queued"),a.upload_size+=b.get("file_size"))}),this.ui_button.set("percentage",0),this.ui_button.set("status","success"),this._updateScreen(),this.uploadbox.start()}},_eventReset:function(){0==this.counter.running&&(this.collection.reset(),this.counter.reset(),this._updateScreen(),this.uploadbox.reset(),this.select_extension.value(this.options.default_extension),this.select_genome.value(this.options.default_genome),this.ui_button.set("percentage",0))},updateGenome:function(a,b){var c=this;this.collection.each(function(d){"init"!=d.get("status")||d.get("genome")!=c.options.default_genome&&b||d.set("genome",a)})},_updateScreen:function(){var a="Please select a composite datatype and specify its components.";this.$("#upload-info").html(a),this.collection.size()>0?this.$("#upload-table").show():this.$("#upload-table").hide()},_uploadPercentage:function(a,b){return(this.upload_completed+a*b)/this.upload_size},_templateDescription:function(a){if(a.description){var b=a.description;return a.description_url&&(b+='&nbsp;(<a href="'+a.description_url+'" target="_blank">read more</a>)'),b}return"There is no description available for this file extension."},_template:function(){return'<div class="upload-view-composite"><div class="upload-top"><h6 id="upload-info" class="upload-info"></h6></div><div id="upload-footer" class="upload-footer"><span class="footer-title">Composite Type:</span><span id="footer-extension"/><span id="footer-extension-info" class="upload-icon-button fa fa-search"/> <span class="footer-title">Genome/Build:</span><span id="footer-genome"/></div><div id="upload-box" class="upload-box"><table id="upload-table" class="table table-striped" style="display: none;"><thead><tr><th>Source</th><th>Description</th><th>Size</th><th>Settings</th><th>Status</th></tr></thead><tbody></tbody></table></div><div id="upload-buttons" class="upload-buttons"/></div>'}})});
//# sourceMappingURL=../../../../maps/mvc/upload/composite/composite-view.js.map
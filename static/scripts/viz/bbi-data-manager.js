define(["viz/visualization","libs/bbi/spans","libs/bbi/sha1","libs/bbi/bin","libs/bbi/jszlib","libs/bbi/bigwig"],function(a,b,c,d,e,f){var g=a.GenomeDataManager.extend({load_data:function(a){var b=$.Deferred();this.set_data(a,b);var c=galaxy_config.root+"datasets/"+this.get("dataset").id+"/display",e=this;return f.makeBwg(new d.URLFetchable(c),function(c){c.readWigData(a.get("chrom"),a.get("start"),a.get("end"),function(c){var d=[];c.forEach(function(a){d.push([a.min,a.score]),a.min!==a.max&&d.push([a.max,a.score])});var f={data:d,region:a,dataset_type:"bigwig"};console.log(d),e.set_data(a,f),b.resolve(f)})}),b}});return{BBIDataManager:g}});
//# sourceMappingURL=../../maps/viz/bbi-data-manager.js.map
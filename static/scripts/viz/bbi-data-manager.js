define(["viz/visualization","libs/bbi/bigwig"],function(a,b){var c=a.GenomeDataManager.extend({load_data:function(a){var c=$.Deferred();this.set_data(a,c);{var d=galaxy_config.root+"datasets/"+this.get("dataset").id+"/display",e=this;new $.Deferred}return $.when(b.makeBwg(d)).then(function(b){$.when(b.readWigData(a.get("chrom"),a.get("start"),a.get("end"))).then(function(b){var d=[],f={max:Number.MIN_VALUE};b.forEach(function(a){f.max!==a.min-1&&(d.push([f.max+1,0]),d.push([a.min-2,0])),d.push([a.min-1,a.score]),d.push([a.max,a.score]),f=a});var g={data:d,region:a,dataset_type:"bigwig"};e.set_data(a,g),c.resolve(g)})}),c}});return{BBIDataManager:c}});
//# sourceMappingURL=../../maps/viz/bbi-data-manager.js.map
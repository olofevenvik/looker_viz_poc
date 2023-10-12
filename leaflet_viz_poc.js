const vis = {
    options: {},

    create: function(element, config) {
        // Leaflet.js likes the css to be loaded ahead of the js
        // So have loaded both the CSS and Leaflet.js dependency here
        // Rather than using the dependency field on the Admin page

        var csslink  = document.createElement('link');
        csslink.rel  = 'stylesheet';
        csslink.type = 'text/css';
        csslink.href = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css';
        csslink.crossorigin = "";
        document.head.appendChild(csslink);

        var scriptlink  = document.createElement('script');
        scriptlink.src  = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js';
        scriptlink.crossorigin = "";
        document.head.appendChild(scriptlink);
      
        this.container = element.appendChild(document.createElement("div"));
        this.container.id = "leafletMap";

        this.tooltip = element.appendChild(document.createElement("div"));
        this.tooltip.id = "tooltip";
        this.tooltip.className = "tooltip";
    },

    updateAsync: function(data, element, config, queryResponse, details, done) {
        this.clearErrors();

        const chartHeight = element.clientHeight - 16;
        
      
        // Leaflet seems to be very sensitive to finding its div already initialised
        // The method I found that worked is deleting the div as part of updateAsync()
        map_element = document.getElementById('leafletMap');
        if (map_element) {
            map_element.parentNode.removeChild(map_element);
        }
        map_element = element.appendChild(document.createElement("div"));
        map_element.id = "leafletMap";
        map_element.setAttribute("style","height:" + chartHeight + "px");

        var map = L.map('leafletMap').setView([55.71, 13.17], 7);
        //---------------------------------------------------------------------------

        var exteriorStyle2 = {
            "color": 'red',
            "fillColor": 'blue',
            "weight": 1,
            "fillOpacity": 0.1,
            "border": 0.1
        };
      
        //---------------------------------------------------------------------------
        const dimensions = queryResponse.fields.dimensions;
      
      

      
        //var keys = dimensions[]
        //dimensions[d].tags.includes("geojson")) {
        //
        //plockar alla dimensions med tag = geojson
        var targetDims = dimensions.filter(dimension => dimension?.tags.includes("geojson"));
        //console.log(targetDims)
        var keys = targetDims.map(dimension => dimension["label_short"])
        //console.log(keys)



        
        //en key är en sorts geografi, exempelvis al1
        keys.forEach(key => {
          const a = data.map(d => d[key]).map(a => JSON.parse(a))
          //console.log(a)
          const uniquea = [...new Map(a.map(item =>
            [item["coordinates"][0], item])).values()] //plocka unika polygoner
          //console.log(uniquea)
          //plocka ut alla raders geografi, ta bort dubbletter, loopa igenom och plotta upp

          
          
          //loopa geojson-keys per rad:
          uniquea.forEach(s => {
            new L.geoJSON(s).setStyle(exteriorStyle2).addTo(map);
          })

          //var exteriorMaskLayer = L.geoJson(exteriorMaskGeojsonPoly, {style: exteriorStyle}).addTo(map);

          //const p1 = new L.geoJSON(JSON.parse(s["Administrative Level 1 Geojson"], {style: exteriorStyle1})).addTo(map);
          //console.log(s["Administrative Level 1"])

          //var polygon = L.polygon([[35.10418, -106.62987],[35.19738, -106.875],[35.07946, -106.80634]], {color: 'red',weight:8,fillColor:'blue',fillOpacity:1}).addTo(map);
          //const p2 = new L.geoJSON(JSON.parse(s["Administrative Level 3 Geojson"])).setStyle(exteriorStyle2).addTo(map);
      
          
        })




        //--------------------------------------------------------------------------------------
      
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
            foo: 'bar', 
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map);

        // As an alternative to Looker have a location type,
        // we can use tags (e.g. "geojson") in LookML
/*         for (let d = 0; d < dimensions.length; d++) {
            if (dimensions[d].tags.includes("geojson")) {
                for (let row = 0; row < data.length; row++) {
                    geojson_value = JSON.parse(data[row][dimensions[d].name].value);
                    L.geoJSON(geojson_value).addTo(map);
                }                
            }
        } */

        done();
    }
};

looker.plugins.visualizations.add(vis);

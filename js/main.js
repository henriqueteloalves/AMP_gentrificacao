console.log(secoesAMP);
// Criar o mapa
var map = L.map('map').setView([41.15, -8.61], 11);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Função de estilo
function estilo(feature) {
  return {
    fillColor:
      feature.properties.classificacao === 1 ? '#e41a1c' :
      feature.properties.classificacao === 0 ? '#4daf4a' :
      '#cccccc',
    weight: 1,
    color: '#333',
    fillOpacity: 0.6
  };
}

// Interação
function emCadaFeature(feature, layer) {

  layer.on('click', function () {

    var resposta = prompt(
      "Classificação:\n" +
      "1 = Gentrificada\n" +
      "0 = Não gentrificada"
    );

    if (resposta === '1' || resposta === '0') {
      feature.properties.classificacao = parseInt(resposta);
      layer.setStyle(estilo(feature));
    }
  });
}

// Carregar o GeoJSON
L.geoJSON(secoesAMP, {
  style: estilo,
  onEachFeature: emCadaFeature
}).addTo(map);

// Add this at the bottom of main.js
var exportButton = L.control({position: 'topright'});
exportButton.onAdd = function(map){
    var div = L.DomUtil.create('div', 'export-button');
    div.innerHTML = '<button onclick="exportData()">Export Results</button>';
    return div;
};
exportButton.addTo(map);

function exportData(){
    var geojsonData = JSON.stringify(secoesAMP); // your variable
    var blob = new Blob([geojsonData], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'classified_results.json';
    a.click();
}
// Add a button on the map
var exportButton = L.control({position: 'topright'});
exportButton.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'export-button');
    div.innerHTML = '<button onclick="exportData()">Export Responses</button>';
    return div;
};
exportButton.addTo(map);

// Function to download JSON of all classified sections
function exportData() {
    var participantCode = prompt("Enter your expert code (e.g., EXP_01) for this download:");
    
    if (!participantCode) return;

    // Add participant code to each feature
    var exportGeoJSON = JSON.parse(JSON.stringify(secoesAMP)); // copy to avoid modifying map
    exportGeoJSON.features.forEach(f => {
        f.properties.participant_id = participantCode;
    });

    var blob = new Blob([JSON.stringify(exportGeoJSON, null, 2)], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gentrification_classification.json';
    a.click();
}



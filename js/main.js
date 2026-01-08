console.log(secoesAMP);

/* =========================
   MAP SETUP
========================= */

var map = L.map('map').setView([41.15, -8.61], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

/* =========================
   DEFAULT: NON-GENTRIFIED
========================= */

secoesAMP.features.forEach(function (feature) {
  feature.properties.classificacao = 0;
});

/* =========================
   STYLE
========================= */

function estilo(feature) {
  return {
    fillColor: feature.properties.classificacao === 1
      ? '#e41a1c'   // gentrified
      : '#cccccc',  // non-gentrified
    weight: 1,
    color: '#333',
    fillOpacity: 0.6
  };
}

/* =========================
   INTERACTION
   CLICK = GENTRIFIED
========================= */

function emCadaFeature(feature, layer) {
  layer.on('click', function () {
    feature.properties.classificacao = 1;
    layer.setStyle(estilo(feature));
  });
}

/* =========================
   LOAD GEOJSON
========================= */

L.geoJSON(secoesAMP, {
  style: estilo,
  onEachFeature: emCadaFeature
}).addTo(map);

/* =========================
   EXPORT BUTTON
========================= */

var exportButton = L.control({ position: 'topright' });

exportButton.onAdd = function () {
  var div = L.DomUtil.create('div', 'export-button');
  div.innerHTML = '<button onclick="exportData()">Export Responses</button>';
  return div;
};

exportButton.addTo(map);

/* =========================
   EXPORT FUNCTION
========================= */

function exportData() {
  var participantCode = prompt("Enter your expert code (e.g., EXP_01):");
  if (!participantCode) return;

  var exportGeoJSON = JSON.parse(JSON.stringify(secoesAMP));

  exportGeoJSON.features.forEach(function (f) {
    f.properties.participant_id = participantCode;
  });

  var blob = new Blob(
    [JSON.stringify(exportGeoJSON, null, 2)],
    { type: "application/json" }
  );

  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'gentrification_' + participantCode + '.json';
  a.click();
}




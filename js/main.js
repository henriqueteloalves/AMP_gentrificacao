console.log(secoesAMP);

/* =========================
   MAP SETUP + BASEMAPS
========================= */

var map = L.map('map').setView([41.15, -8.61], 11);

// OpenStreetMap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
});

// Satellite imagery
var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  }
);

// Labels overlay (streets + boundaries + places)
var labels = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri Labels'
  }
);

// Hybrid = satellite + labels
var hybrid = L.layerGroup([satellite, labels]);


// Default basemap
osm.addTo(map);

// Basemap control
var baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite,
  "Hybrid (Satellite + labels)": hybrid
};

L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);


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
      ? '#e41a1c'
      : '#cccccc',

    fillOpacity: feature.properties.classificacao === 1
      ? 0.6   // gentrified
      : 0.2, // non-gentrified (lighter)

    weight: 1,
    color: '#333'
  };
}

function emCadaFeature(feature, layer) {

  // Hover highlight
  layer.on('mouseover', function () {
    layer.setStyle({ weight: 3 });
  });
  layer.on('mouseout', function () {
    layer.setStyle(estilo(feature));
  });

  // Click toggle gentrified / non-gentrified
  layer.on('click', function () {
    feature.properties.classificacao =
      feature.properties.classificacao === 1 ? 0 : 1;
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
  div.innerHTML = '<button onclick="exportData()">Descarregar Respostas</button>';
  return div;
};

exportButton.addTo(map);

/* =========================
   EXPORT FUNCTION
========================= */

function exportData() {
  var participantCode = prompt("Dê um nome ao ficheiro:");
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




#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Nom du nouveau projet
const NEW_NAME = 'AffairesSceMECA';
const NEW_SLUG = 'affairesscemea';
const NEW_ANDROID_PACKAGE = 'com.magicodz.affairesscemea';
const NEW_IOS_BUNDLE = 'com.magicodz.affairesscemea';

// Fonction pour modifier JSON
function modifyJSON(filePath, modifyFn) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Fichier non trouvé : ${filePath}`);
    return;
  }
  const data = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(data);
  modifyFn(json);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log(`✅ Fichier modifié : ${filePath}`);
}

// Modifier app.json
modifyJSON(path.join(__dirname, 'app.json'), (json) => {
  json.name = NEW_NAME;
  json.slug = NEW_SLUG;
  if (!json.android) json.android = {};
  if (!json.ios) json.ios = {};
  json.android.package = NEW_ANDROID_PACKAGE;
  json.ios.bundleIdentifier = NEW_IOS_BUNDLE;
});

// Modifier package.json
modifyJSON(path.join(__dirname, 'package.json'), (json) => {
  json.name = NEW_NAME;
});

// Modifier eas.json (optionnel)
modifyJSON(path.join(__dirname, 'eas.json'), (json) => {
  if (json.cli && json.cli.projectId) {
    json.cli.projectId = ''; // Laisser vide ou mettre le nouveau projectId si tu veux relier à EAS
  }
});

console.log('🔹 Tous les fichiers ont été mis à jour !');

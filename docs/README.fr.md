# FossFLOW - Outil de Diagrammes Isométriques <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="../README.md">English</a> | <a href="README.cn.md">简体中文</a> | <a href="README.es.md">Español</a> | <a href="README.pt.md">Português</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.ru.md">Русский</a> | <a href="README.id.md">Bahasa Indonesia</a> | <a href="README.de.md">Deutsch</a>
</p>

<b>Salut !</b> C'est Stan, si vous avez utilisé FossFLOW et qu'il vous a aidé, <b>j'apprécierais vraiment si vous pouviez faire un petit don :)</b> Je travaille à temps plein, et trouver le temps de travailler sur ce projet est déjà assez difficile.
Si j'ai implémenté une fonctionnalité pour vous ou corrigé un bug, ce serait génial si vous pouviez :) sinon, ce n'est pas un problème, ce logiciel restera toujours gratuit !


<b>Aussi !</b> Si vous ne l'avez pas encore fait, veuillez consulter la bibliothèque sous-jacente sur laquelle ceci est construit par <a href="https://github.com/markmanx/isoflow">@markmanx</a> Je me tiens vraiment sur les épaules d'un géant ici 🫡

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P61KBXA3)

<img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/dc6ec9ca-48d7-4047-94cf-5c4f7ed63b84" /> <b> https://buymeacoffee.com/stan.smith </b>


Merci,

-Stan

## Essayez-le en ligne

Allez sur  <b> --> https://stan-smith.github.io/FossFLOW/ <-- </b>


------------------------------------------------------------------------------------------------------------------------------
FossFLOW est une puissante Progressive Web App (PWA) open-source pour créer de beaux diagrammes isométriques. Construit avec React et la bibliothèque <a href="https://github.com/markmanx/isoflow">Isoflow</a> (Maintenant forkée et publiée sur NPM comme fossflow), il fonctionne entièrement dans votre navigateur avec support hors ligne.

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/master/FOSSFLOW_TODO.md)** - Problèmes actuels et feuille de route avec mappages de code base, la plupart des plaintes concernent la bibliothèque isoflow elle-même.
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - Comment contribuer au projet.

## Mises à Jour Récentes (Octobre 2025)

### Support Multilingue
- **8 Langues Supportées** - Traduction complète de l'interface en anglais, chinois (simplifié), espagnol, portugais (brésilien), français, hindi, bengali et russe
- **Sélecteur de Langue** - Sélecteur de langue facile à utiliser dans l'en-tête de l'application
- **Traduction Complète** - Tous les menus, dialogues, paramètres, info-bulles et contenu d'aide traduits
- **Sensible aux Paramètres Régionaux** - Détecte et mémorise automatiquement votre préférence de langue

### Outil de Connecteur Amélioré
- **Création par Clics** - Nouveau mode par défaut : cliquez sur le premier nœud, puis sur le second pour connecter
- **Option Mode Glisser** - Le glisser-déposer original reste disponible via les paramètres
- **Sélection de Mode** - Basculez entre les modes clic et glisser dans Paramètres → onglet Connecteurs
- **Meilleure Fiabilité** - Le mode clic offre une création de connexion plus prévisible

### Importation d'Icônes Personnalisées
- **Importez Vos Propres Icônes** - Téléchargez des icônes personnalisées (PNG, JPG, SVG) à utiliser dans vos diagrammes
- **Mise à l'Échelle Automatique** - Les icônes sont automatiquement mises à l'échelle à des tailles cohérentes pour une apparence professionnelle
- **Bascule Isométrique/Plat** - Choisissez si les icônes importées apparaissent en 3D isométrique ou 2D plat
- **Persistance Intelligente** - Les icônes personnalisées sont enregistrées avec les diagrammes et fonctionnent avec toutes les méthodes de stockage
- **Ressources d'Icônes** - Trouvez des icônes gratuites sur :
  - [Iconify Icon Sets](https://icon-sets.iconify.design/) - Des milliers d'icônes SVG gratuites
  - [Flaticon Isometric Icons](https://www.flaticon.com/free-icons/isometric) - Packs d'icônes isométriques de haute qualité

### Support de Stockage Serveur
- **Stockage Persistant** - Diagrammes enregistrés sur le système de fichiers du serveur, persistent entre les sessions du navigateur
- **Accès Multi-appareils** - Accédez à vos diagrammes depuis n'importe quel appareil lors de l'utilisation du déploiement Docker
- **Détection Automatique** - L'interface utilisateur affiche automatiquement le stockage serveur lorsqu'il est disponible
- **Protection contre l'Écrasement** - Dialogue de confirmation lors de l'enregistrement avec des noms en double
- **Intégration Docker** - Stockage serveur activé par défaut dans les déploiements Docker

### Fonctionnalités d'Interaction Améliorées
- **Raccourcis Clavier Configurables** - Trois profils (QWERTY, SMNRCT, Aucun) pour la sélection d'outils avec indicateurs visuels
- **Contrôles de Panoramique Avancés** - Plusieurs méthodes de panoramique incluant glisser sur zone vide, clic milieu/droit, touches modificatrices (Ctrl/Alt) et navigation au clavier (Flèches/WASD/IJKL)
- **Basculer les Flèches du Connecteur** - Option pour afficher/masquer les flèches sur les connecteurs individuels
- **Sélection d'Outil Persistante** - L'outil connecteur reste actif après la création de connexions
- **Dialogue de Paramètres** - Configuration centralisée pour les raccourcis clavier et les contrôles de panoramique

### Améliorations Docker et CI/CD
- **Builds Docker Automatisées** - Workflow GitHub Actions pour le déploiement automatique sur Docker Hub lors des commits
- **Support Multi-architecture** - Images Docker pour `linux/amd64` et `linux/arm64`
- **Images Pré-construites** - Disponibles sur `stnsmith/fossflow:latest`

### Architecture Monorepo
- **Référentiel unique** pour la bibliothèque et l'application
- **NPM Workspaces** pour une gestion rationalisée des dépendances
- **Processus de build unifié** avec `npm run build` à la racine

### Corrections d'Interface
- Problème d'affichage des icônes de la barre d'outils de l'éditeur Quill corrigé
- Avertissements de clé React résolus dans les menus contextuels
- Style de l'éditeur markdown amélioré

## Fonctionnalités

- 🎨 **Diagrammes Isométriques** - Créez de superbes diagrammes techniques en style 3D
- 💾 **Sauvegarde Automatique** - Votre travail est automatiquement sauvegardé toutes les 5 secondes
- 📱 **Support PWA** - Installez comme une application native sur Mac et Linux
- 🔒 **Confidentialité d'Abord** - Toutes les données stockées localement dans votre navigateur
- 📤 **Importer/Exporter** - Partagez des diagrammes sous forme de fichiers JSON
- 🎯 **Stockage de Session** - Sauvegarde rapide sans dialogues
- 🌐 **Support Hors Ligne** - Travaillez sans connexion internet
- 🗄️ **Stockage Serveur** - Stockage persistant optionnel lors de l'utilisation de Docker (activé par défaut)
- 🌍 **Multilingue** - Support complet pour 8 langues : English, 简体中文, Español, Português, Français, हिन्दी, বাংলা, Русский


## 🐳 Déploiement Rapide avec Docker

```bash
# Utilisation de Docker Compose (recommandé - inclut le stockage persistant)
docker compose --profile storage up

# Ou Utilisation de Docker Compose (stockage non persistant)
docker compose --profile non-storage up

# Ou exécuter directement depuis Docker Hub avec stockage persistant
docker run -p 80:80 -v $(pwd)/diagrams:/data/diagrams stnsmith/fossflow:latest
```

Le stockage serveur est activé par défaut dans Docker. Vos diagrammes seront enregistrés dans `./diagrams` sur l'hôte.

Pour désactiver le stockage serveur, définissez `ENABLE_SERVER_STORAGE=false` :
```bash
docker run -p 80:80 -e ENABLE_SERVER_STORAGE=false stnsmith/fossflow:latest
```

## Démarrage Rapide (Développement Local)

```bash
# Cloner le référentiel
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# Installer les dépendances
npm install

# Compiler la bibliothèque (requis la première fois)
npm run build:lib

# Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Monorepo

Ceci est un monorepo contenant deux packages :

- `packages/fossflow-lib` - Bibliothèque de composants React pour dessiner des diagrammes de réseau (construit avec Webpack)
- `packages/fossflow-app` - Progressive Web App pour créer des diagrammes isométriques (construit avec RSBuild)

### Commandes de Développement

```bash
# Développement
npm run dev          # Démarrer le serveur de développement de l'application
npm run dev:lib      # Mode watch pour le développement de la bibliothèque

# Build
npm run build        # Compiler la bibliothèque et l'application
npm run build:lib    # Compiler uniquement la bibliothèque
npm run build:app    # Compiler uniquement l'application

# Tests et Linting
npm test             # Exécuter les tests unitaires
npm run lint         # Vérifier les erreurs de linting

# Tests E2E (Selenium)
cd e2e-tests
./run-tests.sh       # Exécuter les tests end-to-end (nécessite Docker et Python)

# Publication
npm run publish:lib  # Publier la bibliothèque sur npm
```

## Comment Utiliser

### Créer des Diagrammes

1. **Ajouter des Éléments** :
   - Appuyez sur le bouton "+" dans le menu en haut à droite, la bibliothèque de composants apparaîtra à gauche
   - Glissez et déposez les composants de la bibliothèque sur le canevas
   - Ou cliquez avec le bouton droit sur la grille et sélectionnez "Ajouter un nœud"

2. **Connecter des Éléments** :
   - Sélectionnez l'outil Connecteur (appuyez sur 'C' ou cliquez sur l'icône du connecteur)
   - **Mode clic** (par défaut) : Cliquez sur le premier nœud, puis cliquez sur le second nœud
   - **Mode glisser** (optionnel) : Cliquez et glissez du premier au second nœud
   - Basculez entre les modes dans Paramètres → onglet Connecteurs

3. **Sauvegarder Votre Travail** :
   - **Sauvegarde Rapide** - Enregistre dans la session du navigateur
   - **Exporter** - Télécharger comme fichier JSON
   - **Importer** - Charger depuis un fichier JSON

### Options de Stockage

- **Stockage de Session** : Sauvegardes temporaires effacées à la fermeture du navigateur
- **Exporter/Importer** : Stockage permanent sous forme de fichiers JSON
- **Sauvegarde Automatique** : Enregistre automatiquement les modifications toutes les 5 secondes dans la session

## Contribuer

Nous accueillons les contributions ! Veuillez consulter [CONTRIBUTORS.md](../CONTRIBUTORS.md) pour les directives.

## Documentation

- [FOSSFLOW_ENCYCLOPEDIA.md](../FOSSFLOW_ENCYCLOPEDIA.md) - Guide complet de la base de code
- [FOSSFLOW_TODO.md](../FOSSFLOW_TODO.md) - Problèmes actuels et feuille de route
- [CONTRIBUTORS.md](../CONTRIBUTORS.md) - Directives de contribution

## Licence

MIT

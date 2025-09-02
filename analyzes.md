# Analyses du projet "Disasters_web"

> **🎯 Mesurer, Analyser, Optimiser**  

---
## Résumé des mesures
   Métrique                         | Valeur       | Commentaire                                                                    |
 |----------------------------------|--------------|--------------------------------------------------------------------------------|
 | Taille du bundle                 | 1122 kb      | Provient surtout de librairies                                                 |
 | Poids page                       | 137 kb       | Léger                                                                          |
 | Objets DOM                       | 174          | Nombre semblant raisonnable.                                                   |
 | Nombre de ressources chargées    | 250          | Élevé pour une page de 137 kb.                                                 |
 | FCP (First Contentful Paint)     | 6 900 ms     | Mauvais                                                                        |
 | SI (Speed Index)                 | 7 900 ms     | Mauvais                                                                        |
 | LCP (Largest Contentful Paint)   | 13 400 ms    | Mauvais                                                                        |
 | TBT (Total Blocking Time)        | 370 ms       | Mauvais                                                                        | 
 | Cumulative Layout Shift (CLS)    |    0         | Bon                                                                            |
 | Utilisation mémoire (Mo)         | 20,555 (54%) | Données de la consommation mémoire par des chaînes de caractères(strings)      |
 | Requêtes/milliseconde            | ~200         | Nombre élevé de requêtes fetch                                                 |
 | Temps de rendu                   | 714002 ms    | Trop élevé, suggère une boucle ou un bug (blocage du thread principal)         |
 | EcoIndex                         | 71.54        | Score B, bon score qui peut être amélioré et à croiser avec d'autres analyses  |
 | Eau (cl)                         | 2.35         |                                                                                |
 | GES (gCO2e)                      | 1.57         |                                                                                |


## Analyses et Diagnostic avec des outils adaptés

### Chrome DevTools
#### Performance
    - Barre rouge : tâche longue représentant le thread principal bloqué pendant plusieurs secondes

**Ressource :** [Optimiser les longues tâches](https://web.dev/articles/optimize-long-tasks?utm_source=devtools&utm_campaign=stable&hl=fr)

#### Network
- Beaucoup de requêtes (`fetch`) envoyées des mêmes URL en quelques secondes. Bien que chaque requête soit petite (0,8 Ko) et rapide (environ 200 ms), leur grand nombre crée une charge inutile voire problématique en cas de connexion lente.
- Toutes les requêtes sont déclenchées par les mêmes fichiers (big.js et App.tsx) qui sont responsables de tous ces appels.

#### Memory
**Consommation mémoire** :
    - Strings : le texte occupe plus de 20 Mo (20 555 ko), soit 54% de la mémoire totale de la page, sont occupés par des chaînes de caractères (string) contenant le code source de l'application et de ses dépendances.
    Chemin de la principale source : "/node_modules/.vite/deps/..."
    Ceci est un outil de développement et non une fuite de mémoire à corriger.
    
**Recommandations :**
Cette consommation est liée au build de développement. 
Générer une version de production de l'application et l'analyser. 
Dans un build de production, le code est minifié, optimisé, et une partie du code est désactivé. Le problème de consommation mémoire n'existera très probablement pas dans la version destinée à vos utilisateurs.
Si le problème est toujours présent alors revoir la configuration des Sources Maps.


#### Lighthouse

 | Métriques                          | Valeur   | Statut.     | 
 |------------------------------------|----------|------------ |
 | FCP (First Contentful Paint)       | 6 900 ms | 🔴 Mauvais  |
 | SI (Speed Index)                   | 7 900 ms | 🔴 Mauvais  |
 | LCP (Largest Contentful Paint)     | 13 400 ms| 🔴 Mauvais  |
 | TBT (Total Blocking Time)          | 370 ms   | 🔴 Mauvais  | 
 | Cumulative Layout Shift (CLS)      |    0     | 🟢 Bon      |

**Recommandations :**
   - Élément à optimiser et identifié comme "Largest Contentful Paint" : `p.text-xl.text-slate-300.max-w-3xl.mx-auto` (fichier App.tsx, l. 266)
   - [Réduire le travail du thread principal](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown?utm_source=lighthouse&utm_medium=devtools&hl=fr)
   - Activer la compression de texte (Économies potentielles: 6 172 Kio)
   - Dimensionner correctement les images (Économies potentielles: 6 961 Kio)
   - Réduire la taille des ressources JavaScript (Économies potentielles: 6 791 Kio)
   - Réduire les ressources JavaScript inutilisées (Économies potentielles: 1 575 Kio)
   - Connecter à l'avance aux origines souhaitées (Économies potentielles: 130 ms)
   - Diffuser des images aux formats nouvelle génération (Économies potentielles: 186 Kio)
   - Réduire les ressources CSS inutilisées (Économies potentielles: 32 Kio)

#### EcoIndex (extension GreenIt pour Chrome)

 | Métrique               | Valeur     |
 |-------------------------------------|
 | EcoIndex               | 71.54      |
 | Eau (cl)               | 2.35       |
 | GES (gCO2e)            | 1.57       |
 | Nombre de requêtes     | 90         |
 | Taille de la page (Ko) | 96 (17020) |
 | Taille du DOM          | 174        |

**Recommandations :**
- Limiter le nombre de requêtes HTTP (<27)
- Valider le javascript
- Minifier les css et js
- Fournir une print css

### Plugins installés
**Ressource :** 
- [Installer Lighthouse-ecoindex et générer des rapports d'audit](https://lighthouse-ecoindex.greenit.eco/guides/1-lighthouse-ecoindex-cli/)
- [Installer Vite bundle analyzer pour visualiser la taille du bundle](https://github.com/nonzzz/vite-bundle-analyzer)
- ou [Installer Rollup Plugin Visualizer pour analyser le bundle](https://github.com/btd/rollup-plugin-visualizer)

**Eléments volumeux d'après Vite Bundle Analyzer :** 
- assets/index-C7_Wwtbw.js : 673.03 KB
- node_modules/three/build : 449.82 KB

**Recommandations :**
- Charger dynamiquement et n'importer que ce qui est utilisé : au lieu d'importer toute la bibliothèque Three.js par exemple
- Compression des images(WebP, AVIF)


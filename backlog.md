# Backlog du projet

## USER STORIES

---

### Story 1 : Design simple et intuitif

**En tant que** utilisateur qui réserve en dernière minute,  
**je veux** accéder au contenu des pages rapidement et intuitivement 
**afin de** ne pas rater les dernières places disponnibles.

- 🎯 Objectifs : taux de conversion +10% et constrast AA
- 🧱 BP associée : Favoriser un design simple et implémenter un dark mode
- 📗 Référence : [0012, 115 bonnes pratiques, coll. GreenIt] (https://rweb.greenit.fr/fr/fiches/RWEB_0005-favoriser-un-design-simple-epure-adapte-au-web) 
- 🛠️ KPI : Taux d'abandon et de conversion(Google analytics, Hotjar) + contrast (WCAG Contrast checker, Lighthouse)
- 📅 Tag roadmap : M1, M2 et M3

---

### Story 2 : Des images plus légères

**En tant que** utilisateur récurrent,  
**je veux** que les visuels soient plus légers  
**afin de** économiser de la data sur mon forfait.

- 🎯 Objectif : réduire la taille des images/ réduction de 30%
- 🧱 BP associée : Dimensionner correctement
- 📗 Référence : [0036, 115 bonnes pratiques, coll. GreenIt](https://rweb.greenit.fr/fr/fiches/RWEB_0034-ne-pas-redimensionner-les-images-cote-navigateur)
- 🛠️ KPI : poids total dossier `/assets`
- 📅 Tag roadmap : M3

---

### Story 3 : UX plus fluide

**En tant que** utilisateur avec une connexion internet lente,  
**je veux** que les pages se chargent en moins de 2s 
**afin de** accélérer le chargement des pages et acheter mes billets même en cas de réseau lent.

- 🎯 Objectif : temps de chargement inf. à 2000 ms
- 🧱 BP associée : Utiliser le chargement paresseux (lazy loading)
- 📗 Référence : [0037, 115 bonnes pratiques, coll. GreenIt](https://rweb.greenit.fr/fr/fiches/RWEB_0037-utiliser-le-chargement-paresseux)
- 🛠️ KPI : LCP(Lighthouse)
- 📅 Tag roadmap : M2

---

### Story 4 : Un hébergeur éco-responsable sans greenwhashing

**En tant que** utilisateur responsable et respectueux de l'environnement,  
**je veux** consommer en ayant une empreinte carbone la plus faible possible
**afin de** réduire l'empreinte carbone de mon activité en ligne et réserver mes billets de manière écologique.

- 🎯 Objectif : Migration vers un hébergeur éco-responsable d'ici 3 mois
- 🧱 BP associée : Choisir un hébergeur éco-responsable
- 📗 Référence : [0086, 115 bonnes pratiques, coll. GreenIt](https://rweb.greenit.fr/fr/fiches/RWEB_0086-choisir-un-hebergeur-eco-responsable)
- 🛠️ KPI : GES(EcoIndex), localisation des data centers et mix énergétique du pays(Electricitymaps)
- 📅 Tag roadmap : M2

---

### Story 5 : Limitation des connexions aux bases de données

**En tant que** utilisateur régulier pour des déplacements professionnels 
**je veux** choisir et acheter mes billets sans attente de chargement
**afin de** ne pas avoir la sensation de perdre du temps

- 🎯 Objectif : Réduction de 15% du nombre de requêtes à la base de données
- 🧱 BP associée : Limiter le nombre de connexions aux bases de données
- 📗 Référence : [0073, 115 bonnes pratiques, coll. GreenIt](https://rweb.greenit.fr/fr/fiches/RWEB_0073-ne-se-connecter-a-une-base-de-donnees-que-si-necessaire)
- 🛠️ KPI : Log, requête SQL selon le SGBD pour lister les connexions actives
- 📅 Tag roadmap : M3

# 📷 Guide d'intégration des images pour le QCM

## Structure du dossier

```
public/
└── images/
    ├── README.md (ce fichier)
    ├── gauss-surface.svg
    ├── condensateur-plan.svg
    ├── champ-fil-infini.svg
    ├── circuit-rlc-serie.svg
    └── ... (vos images personnalisées)
```

## Comment ajouter une image à une question

### Étape 1 : Placer l'image dans ce dossier

Copiez votre image (PNG, JPG, SVG, GIF) dans le dossier `public/images/`.

**Formats recommandés :**
- **SVG** : Idéal pour les schémas et diagrammes (vectoriel, léger)
- **PNG** : Pour les images avec transparence
- **JPG** : Pour les photos

**Taille recommandée :**
- Largeur : 400-600 pixels
- Hauteur : 200-400 pixels

### Étape 2 : Modifier le fichier JSON

Dans `src/data/questions.json`, ajoutez le champ `"image"` à la question concernée :

```json
{
  "id": 5,
  "theme": "Électrostatique",
  "question": "Votre question ici...",
  "réponses": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "bonnes_réponses": ["A", "B"],
  "image": "/images/votre-image.svg"
}
```

⚠️ **Important :** Le chemin doit commencer par `/images/` (sans `public`)

### Étape 3 : Vérifier l'affichage

Rechargez la page pour voir l'image s'afficher sous la question.

## Exemples d'images disponibles

| Fichier | Description |
|---------|-------------|
| `gauss-surface.svg` | Théorème de Gauss avec surface fermée |
| `condensateur-plan.svg` | Schéma d'un condensateur plan |
| `champ-fil-infini.svg` | Champ magnétique d'un fil infini |
| `circuit-rlc-serie.svg` | Circuit RLC série à la résonance |

## Créer vos propres schémas

### Outils recommandés

1. **Draw.io / Diagrams.net** (gratuit, en ligne)
   - https://app.diagrams.net
   - Export en SVG

2. **GeoGebra** (gratuit, pour les graphiques)
   - https://www.geogebra.org
   - Export en PNG/SVG

3. **Inkscape** (gratuit, logiciel)
   - https://inkscape.org
   - Pour créer/modifier des SVG

4. **Excalidraw** (gratuit, en ligne)
   - https://excalidraw.com
   - Style "dessiné à la main"

### Conseils pour les images

- Utilisez un **fond sombre** (#1e293b) pour correspondre au thème
- Utilisez des **couleurs vives** pour les éléments importants
- Ajoutez des **labels** clairs (E⃗, B⃗, I, etc.)
- Gardez les images **simples et lisibles**

## Résolution des problèmes

### L'image ne s'affiche pas

1. Vérifiez que l'image est bien dans `public/images/`
2. Vérifiez le chemin dans le JSON (doit commencer par `/images/`)
3. Vérifiez le nom du fichier (sensible à la casse)
4. Rechargez la page (Ctrl+F5)

### L'image est trop grande/petite

Les images sont automatiquement redimensionnées pour s'adapter à l'écran :
- Max hauteur : 256px (mobile) / 320px (desktop)
- Responsive : s'adapte à la largeur du conteneur

---

**Développé par PIRATK** | WhatsApp : +226 56 49 23 16

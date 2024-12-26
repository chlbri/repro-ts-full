## Instructions pour de meilleurs commits

Pour garantir une meilleure qualité de code et une meilleure collaboration,
veuillez suivre ces instructions lors de la rédaction de vos messages de
commit :

### 1. Soyez clair et concis

- Utilisez des phrases courtes et précises.
- Évitez les termes vagues comme "changement" ou "mise à jour".

### 2. Utilisez l'impératif

- Rédigez vos messages de commit comme si vous donniez un ordre, par
  exemple : "Ajoute la fonctionnalité de filtrage" au lieu de "Ajout de la
  fonctionnalité de filtrage".

### 3. Décrivez la raison du changement

- Expliquez pourquoi ce changement est nécessaire, pas seulement ce qui a
  été fait.

### 4. Référez-vous aux tickets ou issues

- Si possible, incluez des références aux tickets ou issues correspondants,
  par exemple : "Corrige le bug #123".

### 5. Structurez vos messages

- Utilisez une ligne de titre (50 caractères maximum).
- Ajoutez une ligne vide après le titre.
- Fournissez une description plus détaillée si nécessaire.
-

### 6. Types de commit

- feat: nouvelle fonctionnalité, version mineure
- fix: correction de bug, version patch
- hot-fix: correction de bug critique, version patch
- docs: modification/ajout de la documentation, version patch
- build: modification des fichiers de build, pas de versionnement
- style: modification du style du code, pas de versionnement
- test: ajout/suppression de tests, version patch
- revert: retour à un commit précédent, version patch

### 7. Autres

- Le commit peut être un breaking change, dans ce cas, ajoutez en bas
  [BREAKING CHANGE]
- IMPORTANT!! :Toujours ajouter "chlbri: bri_lvi@icloud.com" après un saut
  de ligne à la fin du commit.
- Le corps ne doit pas contenir plus de 200 mots
- Le corps est en français
- Le titre est en anglais
- Le scope global du commit est mis en parenthèses après le type de commit

### Exemple de message de commit

```
chore(guard): Ajout de la configuration de test et des types associés pour les événements et les guards

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

BREAKING CHANGE:
chlbri: bri_lvi@icloud.com
```

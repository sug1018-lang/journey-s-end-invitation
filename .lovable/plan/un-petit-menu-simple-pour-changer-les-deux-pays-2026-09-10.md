# Un petit menu simple pour changer les deux pays

Aujourd'hui, changer les deux pays d'origine demande soit de toucher au code, soit de connaître l'adresse spéciale `?edit=1`. On rend ça évident et simple.

## Ce que verront les mariés

1. **Un petit bouton discret en haut à droite de l'invitation** (une icône globe). Il n'apparaît que pour les mariés, jamais pour les invités : une fois qu'ils l'ont utilisé une fois, l'appareil s'en souvient. Plus besoin de retenir une adresse compliquée.
2. **Un menu « Vos deux pays »** qui s'ouvre par-dessus la page :
   - deux grandes cartes côte à côte, une par marié, avec le drapeau et le nom du pays actuel ;
   - un clic sur une carte ouvre une liste de pays avec **un champ de recherche** (on tape « ind » et India apparaît) et une rangée de pays fréquents en haut ;
   - un aperçu en direct : les deux drapeaux et la distance entre les deux pays s'affichent pendant le choix ;
   - un bouton **Enregistrer** et un bouton **Revoir l'introduction** pour voir tout de suite le résultat animé.
3. **Le reste des réglages** (WhatsApp, lieux) reste accessible depuis le même menu, dans un second onglet, pour ne pas surcharger l'écran principal.

Rien ne change pour les invités : même design, mêmes animations, mêmes sections.

## Comment on y accède

- Première fois : ouvrir l'invitation avec `?edit=1` (comme aujourd'hui) — ensuite le bouton reste visible sur cet appareil.
- Une adresse simple à retenir sera aussi acceptée : `/?admin`.
- Un lien « Quitter le mode mariés » permet de revenir à la vue invité.

## Détails techniques

- `edit-mode.tsx` : mémoriser l'accès admin dans `localStorage` (clé dédiée) quand `?edit=1` ou `?admin` est présent ; `isAdmin` devient « paramètre d'URL OU accès mémorisé », avec une action `exitAdmin()` qui efface la clé. Lecture après montage pour rester compatible SSR.
- Nouveau `CountryQuickPicker.tsx` : liste filtrable construite sur `COUNTRIES` de `src/lib/countries.ts`, recherche insensible aux accents, repli code pays quand les drapeaux ne s'affichent pas (`useFlagSupport`).
- `CouplePanel.tsx` : réorganisé en deux onglets (`Pays` / `Contact`) ; la partie pays utilise les cartes + `CountryQuickPicker` au lieu des `<select>` natifs ; ajout de l'aperçu distance via les coordonnées déjà présentes dans le registre pays et du bouton de relance d'intro.
- `AdminBar.tsx` : bouton principal « Vos deux pays » mis en avant, les autres (Lieux, Mode édition, Réinitialiser) regroupés sous un bouton secondaire ; ajout de « Quitter le mode mariés ».
- `index.tsx` : exposer la relance de l'introduction au panneau (contexte ou prop) pour le bouton « Revoir l'introduction ».
- Aucune modification des données pilotables de l'extérieur : `partner1Country`, `partner2Country`, `whatsappNumber`, `whatsappMessage` restent la seule source de configuration, donc le futur dashboard reste compatible.

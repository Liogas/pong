# pong
dossier tmp pour le projet ft_transcendance de 42. Contient le script de gameplay pour une partie de PONG.

## ✅🎮 Tableau d'améliorations pour le jeu Pong

| ✅ | Catégorie          | Tâche                                                                                    | Priorité  |
| - | ------------------ | ---------------------------------------------------------------------------------------- | --------- |
| ✅ | 💡 Qualité du code | Corriger la typo `heigth` → `height` dans `Ball.js`                                      | 🔥 Haute  |
| ⬜ | 💡 Qualité du code | Centrer dynamiquement les textes avec `measureText()`                                    | 🔥 Haute  |
| ⬜ | 💡 Qualité du code | Factoriser les "magic numbers" (tailles, marges, etc.) dans des constantes               | 🔥 Haute  |
| ⬜ | 💡 Qualité du code | Déplacer les méthodes `renderScore()`, `renderWinner()`, etc., dans des méthodes dédiées | ⚡ Moyenne |
| ⬜ | 💡 Qualité du code | Extraire `rules` dans un fichier `config.js`                                             | ⚡ Moyenne |
| ⬜ | ⚙️ Robustesse      | Empêcher spam du pause (verrou ou délai)                                                 | 🔥 Haute  |
| ⬜ | ⚙️ Robustesse      | Gérer le resize de la fenêtre et adapter le canvas                                       | ⚡ Moyenne |
| ⬜ | ⚙️ Robustesse      | Corriger possible blocage de balle dans la raquette                                      | ⚡ Moyenne |
| ⬜ | 🚀 Performances    | Utiliser un offscreen canvas pour double buffering                                       | ⚡ Moyenne |
| ⬜ | 🚀 Performances    | Réutiliser les objets temporaires pour éviter nouvelles allocations                      | ⚡ Moyenne |
| ⬜ | 🎨 UX / UI         | Ajouter un overlay semi-transparent pour le mode pause                                   | ✨ Faible  |
| ⬜ | 🎨 UX / UI         | Animer "GO!" (effet alpha ou scale)                                                      | ✨ Faible  |
| ⬜ | 🎨 UX / UI         | Ajouter des effets visuels lors d’un but ou rebond                                       | ✨ Faible  |
| ⬜ | 🎮 Gameplay        | Augmenter la vitesse de la balle progressivement                                         | ⚡ Moyenne |
| ⬜ | 🎮 Gameplay        | Ajouter un mode IA pour jouer contre l’ordi                                              | ✨ Faible  |
| ⬜ | 🎮 Gameplay        | Ajouter des sons (rebond, but, victoire)                                                 | ✨ Faible  |
| ⬜ | 🧹 Structuration   | Remplacer `keys` global par une classe `InputManager`                                    | ⚡ Moyenne |
| ⬜ | 🧹 Structuration   | Utiliser des events personnalisés pour `goal`, `win`, etc.                               | ⚡ Moyenne |
| ⬜ | 🛠 Dev & debug     | Ajouter un mode debug (afficher vitesse, positions, collisions en live)                  | ✨ Faible  |
| ⬜ | 🛠 Dev & debug     | Écrire quelques tests unitaires (collisions, score, fin de partie)                       | ✨ Faible  |

### 🟢 Légende priorité

* 🔥 Haute = Essentiel, améliore stabilité ou bugs
* ⚡ Moyenne = Utile, rend le code plus propre ou performant
* ✨ Faible = Bonus, améliore l'expérience ou ajout de fonctionnalités sympas

---

**💬 Si besoin, je peux aussi t’aider à découper chaque tâche en sous-étapes ou t’aider à planifier l'ordre d'implémentation !** 🚀

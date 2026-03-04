# **Micro-Projet DevOps - Arcade Snake**
## Objectif du TP
Ce TP a pour but de nous permettre de mettre en pratique l'ensemble des connaissances acquises durant les TDs sur **Git, Docker et l'intégration continue (CI/CD)**. Nous devons construire un projet DevOps complet, depuis la création du dépôt Git jusqu'à la mise en place d'une chaîne d'intégration continue automatisée.

## Mon projet
Pour réaliser ce tp, j'ai choisi de coder un serveur web représentant une borne d'arcade de Snake.
### Fonctionnalités :
* Définition du **pseudonyme** pour le leaderboard
* Choisir la **difficulté** (Facile/Moyen/Difficile) qui modifie :
  * La **taille du plateau**
  * La **vitesse du serpent**
* Démarrage de la partie avec le bouton **Démarrer**, navigation avec les flèches du clavier.
* Score sauvegardé automatiquement dans le **Leaderboard**.
## Installation et Lancement
### Prérequis
* Docker/ GitHub Codespaces
* Port **3000** disponible
### Étapes 
1. **Cloner le projet**
```sh
git clone https://github.com/Gasthorn/MicroProjetDevOps.git
```
2. **Lancer le projet avec Docker Compose**
```sh
docker compose up --build
```
3. **Ouvrir le jeu**
  * Un message s'affiche dans la console contenant l'URL (ex:`http://localhost:3000`)
  * Accéder à cet URL dans un navigateur
4. **Jouer**
  * Entrez un **pseudonyme de 3 à 5 lettres** dans l'espace prévu en haut de l'écran
  * Choisir la **Difficulté**
  * Cliquer sur **Démarrer**
  * Utiliser les **flèches** pour se déplacer
5. **Leaderboard**
  * Les scores sont enregistrés automatiquement dans le leaderboard

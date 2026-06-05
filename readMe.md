# SunuIdée

SunuIdée est une application web de gestion d’idées qui permet aux utilisateurs de créer, organiser, filtrer et améliorer leurs idées grâce à une intelligence artificielle.

Le projet est construit avec un stack moderne frontend + backend SaaS.

---

## Fonctionnalités

- Ajouter une idée (titre + description + catégorie)
- Catégorisation automatique avec IA (OpenRouter)
- Filtrage des idées par catégorie
- Modifier une idée existante
- Supprimer une idée
- Suppression de toutes les idées
- Stockage des données via Supabase
- Notifications (toast UI)
- Interface moderne avec animations GSAP

---

## Stack technique

- HTML5
- CSS3 (Tailwind possible)
- JavaScript (Vanilla JS)
- Supabase (Backend as a Service)
- OpenRouter AI (classification d’idées)
- GSAP (animations)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/moussacode/sunuidee_vite.git
cd sunuidee_vite
````

---

### 2. Installer les dépendances

npm install


### 3. Lancer le projet

npm run dev

---



## Variables d’environnement

Créer un fichier `.env` à la racine :


VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_OPENROUTER_KEY=your_openrouter_key



## Base de données Supabase

### Table : `sunuidee`

| colonne     | type      |
| ----------- | --------- |
| id          | int8      |
| titre       | text      |
| description | text      |
| categorie   | enum      |
| created_at  | timestamp |

---

## Intelligence Artificielle

L’IA (OpenRouter) est utilisée pour :

* analyser le titre + description
* proposer automatiquement une catégorie
* catégories possibles :

  * pédagogie
  * événement
  * campus
  * tech

---

##  Sécurité

* Les clés API sont stockées dans `.env`
* Le fichier `.env` est ignoré par Git (`.gitignore`)
* Supabase est utilisé avec des règles de sécurité (RLS recommandé)

---

## Structure du projet

sunuidee_vite/
│
├── index.html
├── main.js
├── style.css
├── .env
├── package.json
└── vite.config.js


---

## Déploiement

Le projet peut être déployé sur :

* Vercel
* Netlify
* GitHub Pages (build uniquement)

---

##  Important

* Ne jamais push les clés API sur GitHub
* Toujours vérifier `.gitignore`
* Régénérer la clé OpenRouter si elle a été exposée

---

## Auteur

Développé par **Moussa** 
Projet éducatif + SaaS en cours de développement



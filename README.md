# Evaluation Deuxième Semaine NODE.JS

Vous allez créer un répo Privé — NodeJS API

Vous allez implémenter une API avec Express, Mongoose et JWT.

À 17h vous rendrez le repo public. 

<aside>
⚠️ Ne pushez pas de nouveaux commits sur votre repo après 17h et tant que vous n’avez pas reçu les notes de l’évaluation.
**En cas d’infraction vous aurez la note de 0 .**
Si vous souhaitez continuer de travailler dessus, vous pouvez le faire sans PUSH vos nouveaux commits
OU plus safe, vous pouvez fork le repo et travailler sur le fork.

</aside>

# Méthode de travail incluant GIT & GITHUB (5 points)

Pour obtenir les points à chacune des spécifications suivantes vous devez utiliser ces bonnes pratiques tout au long de l’évaluation.

1. 1 POINT — Chacun de vos messages de commit est clair, bien formulé et réprésente les changements apportés (min. plus de 6 mots)
2. 1 POINT — Chacun de vos commits est atomique 
3. 1 POINT — Pour l’implémentation de chaque étape vous avez bien créé une branche de dev où vous allez développer l’implémentation de l’étape. *(`main` ne doit contenir que des étapes stables du projet)*
4. 1 POINT — Lorsque vous avez réussi avec succès l’implémentation d’une étape sur une branche, vous la remergez SANS FASTFORWARD sur la branche `main`.
5. 1 POINT — Lorsque vous avez terminé une section vous allez appliqué un TAG au commit de merge. v1 quand vous avez terminé la section n°1, v2 pour quand vous avez terminé la section n°2 etc.. 

METTRE LES VARIABLES SECRETES SUR GITHUB EN PUBLIC VOUS COÛTERA UN POINT.

<aside>
⚠️ Travaillez de manière méthodique et propre en vérifiant bien que ce que vous allez commit et que votre code fait ce que vous en attendant avant chaque commit pour maximiser le nombre de points obtenus.

</aside>

# Section 1 : Express, sans mongoose

Créez une API pour une application de listes de tâches à faire collaborative.

Le schéma Tache

```jsx
id: nombre
description: text
faite: boolean
```

| Routes | Stack | Point | Point pour les Tests avec Jest | Validation avec Joi |
| --- | --- | --- | --- | --- |
| GET | Express | 0.5 | 0.5 |  |
| GET (id) | Express | 0.5 | 0.5 |  |
| POST | Express | 0.5 | 0.5 | 0.5 |
| UPDATE | Express | 0.5 | 0.5 | 0.5 |
| DELETE | Express | 0.5 | 0.5 |  |

# Section 2 : Express et JWT

Le schéma User

```jsx
id: nombre
email: text
username: text
motdepasse: hashedPassword
```

Le schéma Tache

```jsx
id: nombre
description: text
faite: boolean
crééePar: (UserId)
```

|  |  | Point | Point test avec Jest | Point validation avec Joi |
| --- | --- | --- | --- | --- |
| Créez le système d’inscription, de connexion, d’authentification. | Express + JWT | 1 | 1 | 1 |
| Seules les personnes connectées peuvent POST ou UPDATE | Express + JWT | 0.33 | 0.33 | 0.33 |
| Seules les personnes qui ont créées une tâche peuvent DELETE cette tâche | Express + JWT | 0.33 | 0.33 | 0.33 |

# Section 3 : Mongoose & MongoDB

Le schéma User

```jsx
id: nombre
email: text
username: text
motdepasse: hashedPassword
```

Le schéma Tache

```jsx
id: nombre
description: text
faite: boolean
crééePar: (UserId)
```

|  |  | Point | Point test avec Jest |
| --- | --- | --- | --- |
| Portage de l’API Tâches sur Mongo | Express + JWT + Mongoose | 1 | 1 |
| Portage de l’API User sur Mongo | Express + JWT + mongoose | 1 | 1 |

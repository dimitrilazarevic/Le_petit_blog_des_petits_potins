# Le petit blog des petits potins

## Sommaire : 
### I : Présentation des fonctionnalités

Le petit blog des petits potins est un blog très simple permettant à un utilisateur de poster des histoires. On peut y faire une recherche par mots clés, et par nom de l'auteur.
Un utilisateur peut avoir trois statuts : 
- pending : il n'est pas encore validé.
- user : utilisateur validé, il peut publier des posts.
- admin : il peut publier et supprimer des posts.

Depuis la page d'accueil, l'utilisateur peut créer un post, et se login ou accéder aux informations de son compte s'il est déjà connecté.

Si un utilisateur non connecté ou non validé essaie de créer un post, il sera renvoyé sur la page de login.

Sur la page de login, l'utilisateur a accès à une page de création de compte, ou à une page de mot de passe oublié.

Quand un utilisateur essaie de se login, s'il entre un nom d'utilisateur ou une adresse mail inexistants, il recevra un message d'erreur adapté. S'il entre un mauvais mot de passe, également. Si le login est réussi, il est redirigé à l'accueil et peut désormais publier.

Si un utilisateur veut se register, il devra entrer une adresse mail, un nom d'utilisateur, qui n'existent pas encore dans la DB. Ensuite, il devra entrer deux fois un mot de passe compris entre 7 et 14 caractères. S'il a réussi, un message lui indique qu'un mail lui a été envoyé et l'adresse mail en question est précisée. En cliquant sur ce lien, l'utilisateur active son compte et est logged in.

Si un utilisateur oublie son mot de passe, il suivra un processus similaire : il demandera un lien, qui le renverra vers une page où il devra entrer deux fois son nouveau mot de passe et pourra ensuite se login.

#### Quelques screenshots :
##### Page d'accueil :
![alt text](src/static/images/readme/Accueil.png)
##### Page d'accueil en étant connecté en tant qu'admin :
Avec la possibilité de cliquer sur la croix à côté d'un post pour le supprimer, et de faire des recherches par mot clés.
![[Pasted image 20240420112820.png]]
##### Informations de compte :
![[Pasted image 20240420112902.png]]

##### Mauvais login :
![[Pasted image 20240420112933.png]]
### II : Requis, commandes et architecture

#### Tech stack :
- MongoDB et mongoose
- Express
- Svelte et SvelteKit
- Node JS

#### Mettre en place le projet :
Dans le terminal :
- dossier Petits Potins :
	- `npm install concurrently` : concurrently permet de lancer le serveur de backend et de frontend simultanément
	- `cd src/lib/server` 
	- ` npm install mongoose morgan cors dotenv nodemailer express`
	- `cd ../../../`
	- `npm run dev` pour lancer les serveurs
- Un bug non encore résolu empêche parfois le bon routage des pages forgottenpassword. Ce bug soit enlève les styles, soit redirige vers la page de login. Si ce bug arrive, il faut renommer le dossier forgottenpassword dans src/routes, et le renommer à nouveau forgottenpassword, pendant que le serveur tourne.

Rediriger les requêtes envoyées à /api vers le serveur de backend :
```
export default defineConfig({
	plugins: [sveltekit()],
		server :{
			proxy : {
				'/api': {
					target:"http://localhost:3000"
			}
		}
	}
});
```

#### Requis
- Avoir une BDD sur MongoAtlas ou en local
- Avoir une adresse mail configurée pour accepter les envois de mails par une app : [tuto](https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628)
- Un fichier .env dans src/lib/server avec :
	- MONGO_URI : le lien de connexion à la BDD
	- MAILER_ADRESS : l'adresse mail qui va envoyer les mails
	- MAILER_PASSWORD : le mot de passe de l'adresse mail (pas celui pour se connecter classiquement au compte mais celui spécifiquement utilisé pour se connecter à une app externe)
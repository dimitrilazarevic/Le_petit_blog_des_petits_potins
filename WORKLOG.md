## A améliorer pour l'avenir...
- Utiliser plus de layouts pour les styles ou des styles globaux pour certains éléments (forms par exemple, erreurs...). Commencé à le faire pour les erreurs mais je ne vais pas aller plus loin.
- Simplifier l'arborescence, ici, tout est dans le dossier global, il faudrait avoir quelque chose qui regroupe tout ce qui est lié à l'authentification par exemple
- Déplacer le server dans src et pas src/lib et différencier les noms de config : configServer et configClient !
- Trouver des meilleurs moyens de run des tests

- [x] Afficher les posts stockés localement et pas les posts globaux !
Pour celui là, j'ai utilisé la méthode findIndex de l'array posts pour trouver l'index du truc correspondant, et ensuite, j'ai concaténé slice(0,index) et slice(index+1,length) pour faire le nouveau posts. 
- [x] Mettre un cas d'erreur pour toutes les actions de type fetch : pas pu delete, pas pu ci pas pu ça... pour que ça montre qu'on a pris en compte la chose. 

## Encore à faire 
- [x] Changer le système de cookies !

Explication : les cookies de l'ancienne version contenaient les infos de l'user. Mais comme les cookies sont éditables, on ne peut pas stocker de façon sûre ces infos ici. Solution : mettre en place un ID de session qui est un attribut de l'user.

Cet ID de session est donné lors du login, de la confirmation de register ou du changement réussi d'un password.

Il est défini dans les routes : après avoir créé un user, si ça a réussi, on génère ce string et on l'attribue à l'user avec user.sessionId = value et await user.save

A chaque changement de page, on va fetch les données de l'user correspondant à cet ID de session. On fait donc ça dans le layout global, qui s'applique à toutes les pages. Ce fetch est dans le return de la fonction load de layout.server.svelte

Dans chaque page, ces données sont accessible dans data. A partir de là, c'est facile, on fait ce qu'on veut avec.

Le logout donc va juste supprimer le cookie sessionID.

Occasionnellement j'ai pu avoir un bug sur home où les infos d'user ne se mettaient pas à jour, après une redirection depuis confirm register. Il a donc fallu utiliser invalidate, et directement dans layout.svelte pour être sûr que ça le fasse partout au cas où.


# Documentation du projet
## Mise en place du backend

### server.js
#### Dépendances
On commence server.js en déclarant toutes les dépendances : la seule qui ne saute pas aux yeux, c'est cors, qui permet d'accéder à des ressources depuis un autre domaine (cors signifie : cross origin resource sharing). 
On déclare une app = express().
#### app.use
Ensuite, on attribue à cette app tout ce qu'on veut lui faire utiliser de base : 
- app.use(express.json()), en gros, on arrive à parser le JSON directement quand on a un Content-Type qui matche dans le header de la requête.
- app.use(cors) a les paramètres suivants :
```json
{
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
```
En gros, tous les verbes HTML sont autorisés depuis tous les domaines et renvoient un status 204 en cas de succès.
Mais on pourrait choisir de ne laisser cors que sur certaines requêtes, ou de n'autoriser que certaines URL. Ca ne nous intéresse pas tout de suite de rentrer dans le détail.
- app.use('/api',routes) : va utiliser les routes définies dans le Router routes pour tous les chemins qui commencent par '/api'. On fait bien attention à le mettre après les autres app.use parce que sinon, express ne sait pas que ces app.use s'appliquent à ces routes !

#### app.listen
app.listen(PORT,callback) dit à express de fonctionner sur tel port et de déclencher telle fonction quand c'est fait. Un simple console.log c'est très bien !
#### mongoose.connect
mongoose.connect(MONGO_URI) renvoie une promesse, qui est acceptée si la connexion se passe bien ou échoue si ça ne marche pas pour x ou Y raison. Donc on peut mettre un then avec deux arguments, deux console logs différents en fonction de si on a réussi ou non à se connecter.





### config.js
config est un petit fichier utilisé par server.js pour ne pas avoir à toucher à server.js si jamais on veut changer quelque chose.

Il y a donc un simple module.exports = {...} avec le Port et les infos pour envoyer des mails avec nodemailer.
Pour ce dernier point, il s'agit d'un objet qu'on appellera TRANSPORTER par exemple, qui est un nodemailer.createTransport avec quelques paramètres : service qui sera gmail, et auth qui est un objet contenant user et pass.

config prend des infos dans process.env pour garantir qu'elles ne soient pas divulguées : il faut donc require dotenv.config() ! et accéder aux variables avec process.env.var.
### .env
Les variables dans .env ne doivent pas avoir d'espace, et pas de point virgule. Il y a des guillemets si c'est un string.
### routes.js
Les routes seront expliquées plus en détail peut être dans les fonctionnalités, mais les généralités sont là :
- On require { Router } depuis express
- on require Post et User depuis les modèles
- on require ce dont on a besoin depuis config
- On initie un router = Router()
- A chaque fois qu'on définit une route, on écrit router.<get/post/...>
- A la toute fin, on fait module.exports = router


### models.js
- on require mongoose
- On définit un schéma : PostSchema = new mongoose.schema({details},{options})
- Dans options, on peut mettre timestamps:true pour inclure des propriétés createdAt et updatedAt
- on crée un modèle : Post = mongoose.model('NomCollection',schema)
- on module.exports = Post
L'argument NomCollection est le nom qui sera transformé en lowercase et pluriel dans la DB.


## Fonctionnalités

### '/'
Rediriger systématiquement vers home. Simple redirect code 302 dans page.server dans la fonction load. Pas de page.

## '/home'
### Afficher les posts du plus récent au plus ancien

On load les posts avec un fetch.
On rappelle que fetch renvoie une promesse. Donc res est obtenue avec async await, et sera égal à un objet response. Pour le lire, il faudra demander res.json : mais .json() renvoie aussi une promesse. Donc on doit utiliser :
res = await fetch then res=>res.json().
#### Digression sur les fonctions asynchrones
Comment fonctionnent les choses asynchrones ?
C'est en fait très simple. Parfois des choses prennent du temps et on a envie de soit arrêter le code un instant le temps d'avoir une réponse ; soit de faire d'autres choses en attendant que la réponse ait lieu.
Dans le cas 1, on utilise await.
Avec await, le code ne va pas plus loin tant que la promise n'est pas résolue : et le return est la value pour laquelle la promesse se résout, que ce soit une erreur ou pas.

Exemple :

```
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done"), 1000);
});

fan = promise;

async function abonnement1(){
  fan = promise.then((res)=>console.log(res))
  console.log("async")
}
```
Output : "async", une seconde plus tard : done
Avec `fan = await promise.then...` : 
Output : 1s de rien puis "done" et "async"

#### Côté backend
On veut envoyer une réponse uniquement lorsque l'on aura trouvé les posts. On utilise donc await.
Avec Post.find({},{},{sort:{createdAt:-1}}) pour avoir du plus récent au plus ancien.

Je rappelle que la plupart des queries de Mongoose fonctionnent comme ça :
filter, projection,options avec :
- filter l'équivalent de WHERE en SQL, c'est un object
- projection, ce qui vient juste après FIND : ça fonctionne avec un string 'key1 key2', et quand on précise ça on aura en retour que les valeurs de key1 et key2 et pas ensemble du ou des documents. On peut également formuler '-key1 -key2' pour exclure ces keys.
- options : object

On teste ensuite si on a eu une réponse. Si find() n'a pas réussi, elle répondra null. Donc si la valeur est null, on doit throw une erreur :
throw new Error('message d'erreur') ce qui renverra un objet erreur avec le message défini.

Si tout va bien, on envoie une réponse, en format json bien souvent : 
res.status(code).json(l'objet qu'on veut envoyer en format json)


###  Permettre de delete un post (afficher une icône liée à une action) si l'user est admin

#### Savoir si l'user est admin

La page doit savoir si on est admin. Donc on va lire les cookies dans page.server (ou layout.server pour notre cas). 
Dans la fonction load({cookies}), on oublie pas de mettre {cookies} en argument dans load sinon on ne sait pas ce que c'est et c'est la cata !
On return {
	user : readCookies({cookies})
}
avec la fonction readCookies une petite fonction sympathique qui lit tous les cookies définis en config.

##### Zoom sur les fonctions de cookies
Dans config, j'ai défini un export cookieList qui est un ensemble de keyValue : key est le nom du cookie et value est le nom de la variable telle qu'elle existe dans l'objet user. Et des cookieOptions : un path, une durée de vie...

##### readCookies
Dans readCookie, je définis cookieReadList comme un objet vide. Pour tous les cookies définis en config, je vais dire que `cookieReadList[cookieName] = cookies.get(cookieName)`
Et un for each, dans un objet, en js, ça donne ça : for(let key in object){balbla}
##### setCookies
Dans setCookies, je prends un user en argument : c'est l'user avec les caractéristiques à jour.
Pour chaque cookie, je fais `cookie.set(cookieName,user[cookieList[cookieName]],cookieOptions)`, puis je return readCookies !
##### resetCookies
En utilisant la méthode cookies.delete(cookieName,cookieOptions) je fais comme dans les autres.

- Rechercher par mots clés
- Compter les résultats
- Afficher l'heure de publication des posts



#### Permettre la suppression du post
Pour supprimer le post, on met en place un bouton qui n'est accessible que si l'user est admin, avec un event listener : on:click={deletePost(post.id)}

Cette fonction deletePost(id) est aussi async puisqu'elle dépend de fetch. On va revérifier si l'user est admin au cas où on ait des petits malins de hackers !


> [!failure]+ FAILLE DE SECURITE
> En fait, les cookies peuvent être modifiés par l'utilisateur côté client. Il faut donc faire autrement !

En fait, il faut attribuer ce qu'on appelle un 'session ID' qui est lié à l'user, à chaque login, et de façon random. Et à partir de ça retrouver ses infos. Donc user doit aussi avoir un session ID.
Ou utiliser une technique appelée HMAC. On verra tout ça après ?

Dans la route, il faut juste que dans le path on ait un champ avec deux points : ici, delete-post/:id

Avec ça, on accède à ce param grâce à req.params.id. Dans cette route, il n'y a pas grand chose à dire de spécial. 

Après le fetch, on a besoin de reload la page. Pour ça, on utilise invalidateAll() qui relance tous les returns de la fonction load...
Pas si vite ! Si on veut éviter de faire le gros bourrin, dans la fonction load, on rajoute un argument ; depends. 
A l'intérieur de notre fonction load, on peut écrire :
`depends('data:posts')`
Avec posts, une des key/values returned par load.
Donc quand je lance ma fonction deletePost, après fetch, j'ai la bombe atomique invalidateAll() ; mais si je veux pas tout recharger, je fais juste invalidate`('data:posts')`  

Dans mon cas, j'ai aussi des composants qui dépendent indirectement de mes posts. Pour les recharger, j'utilise une variable dite key. Ici, reloadSearch.

Voici comment ça fonctionne : 
```
{#key varKey}
	<composant/>
{/key}
```

Mon composant sera mis à jour à chaque fois que la valeur key évolue. Donc, je chaine mon then invalidate avec un then varKey={} pour forcer le composant à se reload !










### Afficher la date et l'heure des posts
Là c'est tricky. Date est un type à part entière en JS.
Dans la db, on a vraisemblablement un string qui stocke la date : createdAt.
Il faut donc le transformer avec son constructeur : new Date(Date).

A partir de là, on peut utiliser tous les getters pour obtenir les minutes, heures... mais il faut rajouter manuellement des 0 si on est en dessous de 10 sinon la date s'affiche comme de la merde.


## layout
Le layout contient un ou deux boutons en fonction des cas. Le plus souvent, le bouton en haut à gauche ramène à la page d'accueil ; mais depuis home, à create-post.
Pour ça on utilise des simples switch case avec $page.url.pathname ou des regEx quand on est sur des pages à nom variable.
A part ça rien de très compliqué sur cette page. Juste, on l'utilise pour lire les cookies avec layout.server puisque elle est active sur toutes les pages...

Et j'utilise afterNavigate qui se déclenche à chaque navigation pour changer le contenu des boutons de navigation en fonction de la page sur laquelle je me trouve.

Dans afterNavigate, je peux utiliser {from,to,cancel} mais dans mes cas à moi, je n'aurai besoin d'aucun d'eux.

## /create_post

### Publier un post
#### Front
Ici, ce qui est intéressant c'est qu'on traite un formulaire.

Dans notre form, on a un attribut action="?/submit".

Donc dans page.server, on doit exporter une const actions. C'est un objet, avec des values qui sont des fonctions, c'est tout simple, et qui sont appelées quand on submit un form qui correspond.

submit prend un argument : {req}, la requête. Il faut d'abord récupérer la formData et transformer le form en JSON. 

Pour récupérer le formData, await req.formData().
Pour transformer un form en JSON, j'ai créé une fonction qui fait ça : 
c'est en fait très simple. On itère chaque value,key par un forEach dans le formData, et on crée un objet dont les keys prennent value en valeur.
Ensuite, on JSON.stringify et on envoie.

Ensuite, on crée une requête avec un fetch dont les options précisent :
- method : 'POST'
- body : le corps de requête, variable en json donc
- headers : les headers de la requête, ici, juste Content-Type : 'application/json'

On peut ensuite mettre un then et appeler un callback qui redirect home.

#### Back
Dans routes, on a besoin de filtrer les objets vides, sinon les valeurs par défaut ne se mettent pas dans la BDD !
Pour ce faire c'est très simple : 
c'est un for const key in object. Si la value est égale à '', on fait juste `delete object[key]`

Pour créer un objet, là c'est en deux temps : newPost = new Post(reqbody) puis newPost.save() pour le mettre dans la DB.
#### Rediriger vers login si l'user n'est pas identifié
SI l'user n'est pas identifié, je le redirige vers login/redirected

## /login/[redirected]
### Savoir si l'user est redirected
Dans la fonction load, j'utilise les params pour savoir si l'user est venu ici par la voie normale ou s'il a été redirigé. S'il essaie de taper une url random, je le remets sur le droit chemin avec un redirect.
### Conserver l'username / email en cas d'erreur
Si l'utilisateur se trompe, je veux que son nom d'utilisateur ou son email ne s'efface pas. Pour ça, très facile :
Si form != null, j'associe la valeur usernameoreemail du form a une variable sur page.svelte, qui est bind à mon input.

### Afficher un message d'erreur
Si le formulaire n'est pas bon, je ne veux pas changer de page. Je veux juste un message d'erreur au dessus de mon formulaire.

Pour cela, dans page.server, j'importe fail depuis sveltejs/kit.
Avec ça, dans mon catch error, je peux return fail(status,{object})

Et dans ma page.svelte, je n'ai qu'à demander if form?.error et prendre avec form.property les infos que j'ai décidé de donner.  Etant donné que les erreurs se passent dans le backend, puisque c'est là bas que la vérification a lieu, je fais là bas des res.status.json({message:string}) ; et dans mon page.server.js, je teste avec if(!res.ok) qui me dit si ma réponse n'est pas dans les statuts 200-299, et si je tombe dans un de ces cas je throw une erreur avec le err.message que j'ai pu catch.

### Connecter l'user
Si l'user est connecté, je lui donne son cookie mais il va falloir que je refasse cette partie là qui est mauvaise à ce jour.

## /register
### Messages d'erreur dynamiques

1 - Ici, je veux que si mon password ne respecte pas une regExp ou si mes deux passwords ne sont pas les mêmes, le mettre à jour en temps réel. 
2 - Si l'user soumet une adresse mail qui existe déjà, un message d'erreur s'affiche : il doit disparaître dès lors que l'user recommence à écrire.

Pour 1, c'est très simple : à chaque fois que l'user entre un caractère dans password, il y a un événement : on:keyup{checkValidity} qui vérifie la conformité du mot de passe et change la valeur d'un booléen passwordIsGood. Et pour voir s'ils matchent, on crée une variable avec $: pw == pw2 ou pw.length<7 ou pw2='".

Pour 2, j'ai créé une fonction hideSubmitErrorMessage qui est appelée si n'importe lequel des champs est heurté.
### Message de réussite

Si la réponse est positive, on peut également donner un return à l'action, qui sera un objet. Moi je lui ai mis status et message ; comme ça, si form != null, on peut regarder son status et s'il vaut 200 on peut transmettre un super message de success.

### Envoyer un mail de confirmation
C'est ici que les choses deviennent sympa ! Dans mon user, j'ai une propriété confirmationLink (que je réutilise pour le mot de passe oublié).

Je dois d'abord générer ce lien. C'est une simple suite de par exemple 128 caractères aléatoirement choisis, grâce à `charAt(Math.floor(Math.random()*charactersLength))` qu'on vient répéter autant de fois qu'on veut.

Ensuite, le contenu de mon mail., qui est un string représentant un message en HTML. Pour le faire sur plusieurs lignes, j'utilise `\` à la fin d'une ligne. Ca marche très très bien.






## /confirm_registration/[temporary_link]
Ici, c'est un simple findoneandupdate. De plus, je veux qu'on me renvoie le nouvel utilisateur : alors, je mets new:true dans les options de query (sinon, on m'aurait envoyé l'user avant sa mise à jour). Le status devient user et confirmationLink est reset.

## /forgotten_password
Rien à dire de très nouveau ici par rapport à confirm registration et register, on prend des méthodes des deux pour faire le business en question.



## /user
Pour se logout, on utilise un formulaire avec un seul bouton qui reset les cookies et qui redirige vers home. Rien de compliqué !



## +error.svelte
On utilisera les propriétés de page : $page.error.status ou $page.error.message.


## A améliorer :
- Les cookies d'utilisateurs sont une faille de sécurité et le système doit être changé pour mettre en place un token de session à la place
- Il y a du code un peu trop répété, pas assez factorisé surtout au niveau du CSS : j'aurais peut être dû faire plus usage des styles globaux, ou trouver une autre solution
- Mettre server dans lib ne fait pas vraiment de sens. Il aurait dû être mis au même niveau que routes, juste en dessous de src
- Là, on ne loade pas beaucoup de data sur la page d'accueil donc j'ai pu me permettre de reload tout quand je supprime un élément, mais il vaudrait mieux stocker en local une liste de posts et agir sur elle, pour ne pas avoir à tout reload à chaque fois.


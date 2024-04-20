const { Router } = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { TRANSPORTER,EMAIL,WEBSITE_URL } = require('../config')

//Pour générer un lien temporaire pour valider l'inscription
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const router = Router();

function filterEmptyFields(object) {
    for (const key in object) {
        if (object[key] == '') {
            delete object[key];
        }
    }
    return object
}

//Truc random
router.get('/', (req, res) => {
    res.send("Mes hommages.");
})

//Get tous les posts
router.get('/get-posts', async (req, res) => {
    try {
        let postList = await Post.find();
        if (postList == null || undefined) {
            throw new Error("La liste n'a pas pu être chargée");
        }
        res.status(200).json(postList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Créer un post
router.post('/create-post', async (req, res) => {
    let date = new Date();
    let filteredReq = filterEmptyFields(req.body);
    filteredReq.dateCreation=date;
    try {
        const newPost = new Post(filteredReq);
        const postSuccess = await newPost.save();
        if (!postSuccess) {
            throw new error("Post pas enregistré.")
        }
        res.status(200).json(postSuccess)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

//Supprimer un post
router.delete('/delete-post/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: id });
        if (deletedPost == null | undefined) {
            throw new Error("Pas pu suprimer chef.")
        }
        res.status(200).json(deletedPost)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Créer un utilisateur
router.post('/create-user', async (req, res) => {
    try {
        let [usersWithSameUsername,usersWithSameEmail] = await Promise.all([
            User.findOne({username:req.body.username}),
            User.findOne({email:req.body.email})
        ]);
        let [usernameTaken,emailTaken]=[usersWithSameUsername,usersWithSameEmail].map((user)=>user=(user!==null));
        if(usernameTaken){
            throw new Error("Nom déjà pris !");
        }else if(emailTaken){
            throw new Error("Mail déjà pris !");
        }else{
            req.body.confirmationLink = generateString(128);
            let content = 
            '<h1>Bienvenue '+req.body.username+' !</h1>\
            <br/>\
            <a href='+WEBSITE_URL+'/confirm_registration/'+req.body.confirmationLink+'>Go to website</a>';

            TRANSPORTER.sendMail(
                {
                    from : EMAIL,
                    to : req.body.email,
                    subject : 'Inscription !',
                    html : content
                },
                (err,info) => {
                    if(err){
                        throw new Error('Mail non existant')
                    }
                }
            )
            const newUser = new User(req.body);
            const postSuccess = await newUser.save();
            if (!postSuccess) {
                throw new error("User pas enregistré.");
            }
            res.status(200).json(newUser);
        }
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
});

//login
router.post('/login',async (req,res)=>{
    try{
        let regExpMail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        let [userMatchingUsername,userMatchingEmail] = await Promise.all([
            User.findOne({username:req.body.usernameoremail}),
            User.findOne({email:req.body.usernameoremail})
        ]);
        let userMatchingSearch=[userMatchingUsername,userMatchingEmail].find((el)=>el!=undefined);
        let userExists = userMatchingSearch != undefined;
        if(!userExists){
            if(req.body.usernameoremail.match(regExpMail)){
                throw new Error("Pas d'utilisateur associé à ce mail.")
            }else{
                throw new Error("Pas d'utilisateur associé à nom d'utilisateur.")
            }
        }
        if(userMatchingSearch.password==req.body.password){
            res.status(200).json(userMatchingSearch);
        }else{
            throw new Error("Mauvais mot de passe...")
        }
    }catch(err){
        res.status(422).json({ message: err.message });
    }
})

//confirmer un utilisateur
router.get('/confirm-registration/:confirmationLink', async (req, res) => {
    try {
        let user = await 
        User
        .findOneAndUpdate(
            {confirmationLink:req.params.confirmationLink},
            {status:'user',confirmationLink:null},
            {new:true}
        );
        if(!user){
            throw new Error ('Lien inexistant')
        }
        res.status(200).json({message:'Utilisateur confirmé avec succès',user:user});
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
})

//Demander à changer un MDP
router.post('/forgotten-password',async (req,res)=>{
    try{
        let temporaryLink = generateString(128);
        let userMatchingEmail = await 
            User.findOneAndUpdate(
                {email:req.body.email},
                {confirmationLink:temporaryLink}
            );
        if(!userMatchingEmail){
            throw new Error("Pas d'utilisateur associé à ce mail.")
        }

        let content = 
        "<h1>Ce n'est pas grave d'oublier son mot de passe "+userMatchingEmail.username+" !</h1>\
        <br/>\
        <a href="+WEBSITE_URL+"/forgotten_password/"+temporaryLink+">Réinitialiser le mot de passe</a>";

        TRANSPORTER.sendMail(
            {
                from : EMAIL,
                to : req.body.email,
                subject : 'Réinitialiser le mot de passe',
                html : content
            },
            (err,info) => {
                if(err){
                    throw new Error('Mail non existant')
                }
            }
        )
        res.status(200).json({message : "Un mail contenant un lien pour changer le mot de passe a été envoyé."})

    }catch(err){
        res.status(422).json({ message: err.message });
    }
})

//Modifier un MDP
router.post('/forgotten-password/:temporaryLink',async (req,res)=>{
    try{
        let userChangingPassword = await 
            User.findOneAndUpdate(
                {confirmationLink:req.params.temporaryLink},
                {password:req.body.password,confirmationLink:null}
            );
    
        if(!userChangingPassword){
            throw new Error("Une erreur s'est produite...")
        }

        res.status(200).json(userChangingPassword);

    }catch(err){
        res.status(422).json({ message: err.message });
    }
})

module.exports = router;
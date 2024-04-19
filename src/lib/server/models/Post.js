const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {   
        title:{
            type : String,
            default : "Vous n'allez jamais croire ce qui m'est arrivé !"
        },
        body:{
            type : String,
            default : "Ce matin, en allant me promener vers les quais de Rhône, j'ai croisé Bradd Pitt. Il était de dos, mais je l'ai reconnu : c'était lui !"
        },
        author:{
            type : String,
            required : true
        },
        dateCreation:{
            type : Date
        }
    },
    {
        timestamps:true
    }
    
)

const Post = mongoose.model("Post",PostSchema);
module.exports = Post ;
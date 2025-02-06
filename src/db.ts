import mongoose, {Schema, model} from "mongoose";

// ------------------ db connection ---------------------------

export const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect('mongodb://localhost:27017/brain-dump')
        console.log(connectionInstance.connection.host)
    }
    catch(err){
        console.log(err)
    }
}

// -------------------- schemas -----------------------------------------


// ---------------- user schema --------------------------------

const userSchema =  new Schema({
    username: {
        type: String,
        requried: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', userSchema)


// ------------ content schema ------------------

const contentSchema = new Schema({
    link: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["tweet", 'youtube', 'document', 'link'],
    },
    title:{
        type: String,
        required: true
    },
    tag: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

export const Content = mongoose.model('Content', contentSchema)


// --------------- tag schema ------------------


const tagSchema = new Schema({
    title:{
        type: String
    }
})

export const Tag = mongoose.model('Tag', tagSchema)


// --------------- link schema -------------------

const linkSchema = new Schema({
    hash:{
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Link = mongoose.model('Link', linkSchema)


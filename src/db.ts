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

interface User{
    username: string,
    password: string,
}

const userSchema =  new Schema<User>({
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

export const User = mongoose.model<User>('User', userSchema)


// ------------ content schema ------------------

interface Content{
    link: string,
    type: "tweet" | "youtube" | "document" | "link",
    title: string,
    tag?: [string],
    userId: Schema.Types.ObjectId,
}
const contentSchema = new Schema<Content>({
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

export const Content = mongoose.model<Content>('Content', contentSchema)


// --------------- tag schema ------------------

interface Tag{
    title: string,
}
const tagSchema = new Schema<Tag>({
    title:{
        type: String
    }
})

export const Tag = mongoose.model<Tag>('Tag', tagSchema)


// --------------- link schema -------------------

interface Link{
    hash: string,
    userId: Schema.Types.ObjectId
}

const linkSchema = new Schema<Link>({
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

export const Link = mongoose.model<Link>('Link', linkSchema)


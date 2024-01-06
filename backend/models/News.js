import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    categories: {
        type: Array,
        default: 'General'
    }
},{timestamps: true});

const news = mongoose.model('news', NewsSchema);

export default news;
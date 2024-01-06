import mongoose from 'mongoose';

const LikeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    },
    likedDate: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

const like = mongoose.model('like', LikeSchema);

export default like;
import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    },
    comment:{
        type: String,
        required: true
    },
    commentDate: {
        type: Date,
        default: Date.now
    }
});

const comment = mongoose.model('comment', CommentSchema);

export default comment;
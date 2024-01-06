import Likes from '../models/Likes.js';

export const newLike = async (req, res) => {
    try {
        const like = await new Likes({
            userId: req.user._id,
            blogId: req.params.blogId
        });

        like.save();

        res.status(200).json('Like saved successfully');
    } catch (error) {
        res.status(500).json(error);
    }
}


export const getLikes = async (req, res) => {
    try {
        const likes = await Likes.find({ blogId: req.params.blogId });
        
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteLike = async (req, res) => {
    try {
        const like = await Likes.findById(req.params.blogId);
        await like.delete()

        res.status(200).json('Post unliked successfully');
    } catch (error) {
        res.status(500).json(error)
    }
}

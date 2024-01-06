import Comments from '../models/Comments.js';

export const newComment = async (req, res) => {
    try {
        const newentry = req.body.comment;
        const comment = await new Comments({
            userId: req.user._id,
            blogId: req.params.blogId,
            comment: newentry
        });

        comment.save();

        res.status(200).json('Comment saved successfully');
    } catch (error) {
        res.status(500).json(error);
    }
}


export const getComments = async (req, res) => {
    try {
        const comments = await Comments.find({blogId: req.params.blogId});
        if(!comments){
            res.status(404).send({msg: "No comments have been linked to this blog."});
        }
        
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.blogId);
        await comment.delete()

        res.status(200).json('comment deleted successfully');
    } catch (error) {
        res.status(500).json(error)
    }
}

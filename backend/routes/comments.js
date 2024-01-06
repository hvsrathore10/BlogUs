import express from 'express';
const router = express.Router();
import fetchuser from '../middleware/fetchuser.js';
import { 
    newComment,
    getComments,
    deleteComment } from '../controllers/comments.js'

//Route 1: Get All the comment associated with 'id'(blog) using 
//GET "/api/v1/blog/comments/fetchcomments/:id"  Login required 
router.get('/fetchcomments/:blogId', fetchuser, getComments);


//Route 2: Add new comment to 'id'(blog) using 
//POST "/api/v1/blog/comments/addcomment/:id"  Login required 
router.post('/addcomment/:blogId', fetchuser, newComment);


//Route 3: Deleting an exiting comment using 
//DELETE "/api/v1/blog/comment/deletecomment/:id"  Login required 
router.delete('/deletecomment/:blogId', fetchuser, deleteComment);


export default router;
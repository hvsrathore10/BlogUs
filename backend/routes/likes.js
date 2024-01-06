import express from 'express';
const router = express.Router();
import fetchuser from '../middleware/fetchuser.js';
import {newLike,getLikes,deleteLike} from '../controllers/likes.js';


//Route 1: Get All the likes associated with 'id' using 
//GET "/api/v1/blogs/likes/fetchlikes"  Login required 
router.get('/fetchlikes/:blogId', fetchuser, getLikes);


//Route 2: Add like to 'id'(blog) using POST "/api/v1/blogs/likes/addlike"  Login required 
router.post('/addlike/:blogId', fetchuser, newLike);


//Route 3: Unlike a liked blog using DELETE "/api/blogs/likes/deletelike"  Login required 
router.delete('/deletelike/:blogId', fetchuser, deleteLike)


export default router;
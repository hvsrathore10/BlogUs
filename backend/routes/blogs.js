import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Blogs from '../models/Blogs.js';
import fetchuser from '../middleware/fetchuser.js';
import multer from 'multer';
import path from 'path';

//Route 1: Get All the Blogs of user using GET "/api/v1/blogs/fetchallblogs" Login required 
router.get('/fetchallblogs', fetchuser, async (req,res)=>{
    try {
        const blogs = await Blogs.find({user: req.user._id});
        res.json(blogs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})

//image upload system ::
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    }
})
const upload = multer({ storage: storage })

//Route 2: Add new Blog using POST "/api/v1/blogs/addblog" Login required 
router.post('/addblog', fetchuser, upload.single("coverImage") , [
    body('title','Enter a valid Title').isLength({min: 3}),
    body('description','Description must be atleast 5 Characters').isLength({min: 5})
], async (req,res)=>{
    //try-catch use to protact database from malfunctioning
    try {
        const {tags,title,description,video,categories} = req.body.formData;
        //If there are errors, return Bed Reqiust and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        // Validate tagged users
        const valid = await Promise.all(tags.map(async (tagId) => !!await User.findById(tagId)));
        if (!valid.every(Boolean)) {
            return res.status(400).json({ error: 'Invalid tag' });
        }
        const blogs = new Blogs({
            title, description, picture: `/uploads/${req.file.filename}`, video, 
            categories, user: req.user._id, tags
        })
        const savedBlog = await blogs.save();
        res.json(savedBlog);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})


//Route 3: Updating an existing Blog using PUT "/api/v1/blogs/updateblog" Login required 
router.put('/updateblog/:id', fetchuser, async (req,res)=>{
    const {title,description,picture,video,categories} = req.body;
    //create a newBlog object
    const newBlog = {};
    if(title){{newBlog.title = title}}
    if(description){{newBlog.description = description}}
    if(picture){{newBlog.picture = picture}}
    if(video){{newBlog.video = video}}
    if(categories){{newBlog.categories = categories}}

    //check for correct uses with it's own blogs only
    let blog = await Blogs.findById(req.params.id);
    if(!blog){ return res.status(404).send("Not Found")}

    if(blog.user.toString() !== req.user._id){
        return res.status(401).send("Not Allowed");
    }

    //find the blog to be updated and update it
    blog = await Blogs.findByIdAndUpdate(req.params.id, {$set: newBlog},{new: true});
    res.json({blog});
})


//Route 4: Deleting an existing blog using DELETE "/api/blogs/deleteblog" Login required 
router.delete('/deleteblog/:id', fetchuser, async (req,res)=>{
    
    //find the blog to be delete and delete it
    //check for correct uses with it's own blogs only
    let blog = await Blogs.findById(req.params.id);
    if(!blog){ return res.status(404).send("Not Found")}
    
    //Allowed deletion only if user own this blog
    if(blog.user.toString() !== req.user._id){
        return res.status(401).send("Not Allowed");
    }

    blog = await Blogs.findByIdAndDelete(req.params.id);
    res.json({"Success" : "blog as been deleted"});
    // res.json({blog})
})

//Route 5: Get All the Blogs using GET "/api/v1/blogs/getblogs" No Login required 
router.get('/getblogs', async (req,res)=>{
    try {
        const blogs = await Blogs.find();
        res.json(blogs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})

//Route 1: Get the Blog with id using GET "/api/v1/blogs/readblog" Login required 
router.get('/readblog/:id', async (req,res)=>{
    try {
        const blog = await Blogs.findById(req.params.id);
        if(!blog){
            res.status(404).send('Not Found');
        }
        res.json(blog);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})

export default router;
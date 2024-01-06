import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import News from '../models/News.js';
import fetchuser from '../middleware/fetchuser.js';

//Route 1: Get All the News using GET "/api/v1/news/fetchallnews" Login required 
router.get('/fetchallnews', fetchuser, async (req,res)=>{
    try {
        const news = await News.find({user: req.user._id});
        res.json(news);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})


//Route 2: Add new News using POST "/api/v1/news/addnews" Login required 
router.post('/addnews', fetchuser, [
    body('title','Enter a valid Title').isLength({min: 3}),
    body('description','Description must be atleast 5 Characters').isLength({min: 5})
], async (req,res)=>{
    //try-catch use to protact database from malfunctioning
    try {
        const {title,description,picture,categories} = req.body;
        //If there are errors, return Bed Reqiust and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const news = new News({
            title, description, picture, 
            categories, user: req.user._id
        })
        const savedNews = await news.save();
        res.json(savedNews);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})


//Route 3: Updating an exiting News using PUT "/api/v1/news/updatenews" Login required 
router.put('/updatenews/:id', fetchuser, async (req,res)=>{
    const {title,description,picture,categories} = req.body;
    //create a newNews object
    const newNews = {};
    if(title){{newNews.title = title}}
    if(description){{newNews.description = description}}
    if(picture){{newNews.picture = picture}}
    if(categories){{newNews.categories = categories}}

    //check for correct uses with it's own News only
    let news = await News.findById(req.params.id);
    if(!news){ return res.status(404).send("Not Found")}

    if(news.user.toString() !== req.user._id){
        return res.status(401).send("Not Allowed");
    }

    //find the news to be updated and update it
    news = await News.findByIdAndUpdate(req.params.id, {$set: newNews},{new: true});
    res.json({news});
})


//Route 4: Deleting an exiting news using DELETE "/api/news/deletenews" Login required 
router.delete('/deletenews/:id', fetchuser, async (req,res)=>{
    
    //find the news to be delete and delete it
    //check for correct uses with it's own News only
    let news = await News.findById(req.params.id);
    if(!news){ return res.status(404).send("Not Found")}
    
    //Allowed deletion only if user own this news
    if(news.user.toString() !== req.user._id){
        return res.status(401).send("Not Allowed");
    }

    news = await News.findByIdAndDelete(req.params.id);
    res.json({"Success" : "news as been deleted"});
    // res.json({news})
})


export default router;
const express=require('express');
const router = express.Router();
const Category = require('../models/Category').Category;


router.get('/',async(req,res)=>{
    const categories= await Category.find();
    res.json(categories);
});

router.post('/',async (req,res)=>{
    const categories = new Category({
        name:req.body.name      
    });

    const savedCategory = await categories.save()
    res.json(savedCategory);
});

router.get('/:Id',async (req,res)=>{
    
    const category=await Category.findById(req.params.Id);
    res.json(category);
});

router.delete('/:Id',async(req,res)=>{
    const category = await Category.remove({_id:req.params.Id});
    res.json(category);
});

router.patch('/:Id', async(req,res)=>{
    const category = await Category.updateOne(
        {_id:req.params.Id},
        {$set:
            {name:req.body.name}
    });
    res.json(category);
})

module.exports = router;

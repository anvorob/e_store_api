const express=require('express');
const router = express.Router();
const Brand = require('../models/Brand').Brand;


router.get('/',async(req,res)=>{
    const brands= await Brand.find();
    res.json(brands);
});

router.post('/',async (req,res)=>{
    const brands = new Brand({
        name:req.body.name,
        image:req.body.image,
        category:req.body.category
    });

    const savedBrands = await brands.save()
    res.json(savedBrands);
});

router.get('/:Id',async (req,res)=>{
    
    const brand=await Brand.findById(req.params.Id);
    res.json(brand);
});

router.delete('/:Id',async(req,res)=>{
    const brand = await Brand.remove({_id:req.params.Id});
    res.json(brand);
});

router.patch('/:Id', async(req,res)=>{
    const brand = await Brand.updateOne(
        {_id:req.params.Id},
        {$set:
            {name:req.body.name}
    });
    res.json(brand);
})

module.exports = router;

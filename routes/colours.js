const express=require('express');
const router = express.Router();
const Colour = require('../models/Colour').Colour;
const Product = require('../models/Product').Product;
const mongoose = require('mongoose')
router.get('/',async(req,res)=>{
    const colours= await Colour.find();
    res.json(colours);
});

router.post('/',async (req,res)=>{
    const colours = new Colour({
        name:req.body.name,
        sample:req.body.sample,
        isAvailable:req.body.isAvailable
    });

    const savedColour = await colours.save()
    res.json(savedColour);
});

router.get('/:colourId',async (req,res)=>{
    
    const colour=await Colour.findById(req.params.colourId);
    res.json(colour);
});

router.delete('/:colourId',async(req,res)=>{
    const colour = await Colour.remove({_id:req.params.colourId});
    res.json(colour);
});

router.patch('/:colourId', async(req,res)=>{
    const oldColour = await Colour.findById(req.params.colourId);
    
    const colour = await Colour.updateOne(
        {_id:req.params.colourId},
        {$set:
            {name:req.body.name,
            sample:req.body.sample,
            isAvailable:req.body.isAvailable}
    });
    
    await Product.updateMany({}, 
                                {$set: 
                                    {
                                        "colour.$[i].name": req.body.name,
                                        "colour.$[i].sample": req.body.sample,
                                        "colour.$[i].isAvailable": req.body.isAvailable
                                    }
                                }, 
                                {arrayFilters: 
                                    [{"i.name": oldColour.name}]
                                }
                                );
    res.json(colour);
})
module.exports = router;

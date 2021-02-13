const express=require('express');
const router = express.Router();
const Location = require('../models/Location').Schema;
const Product = require('../models/Product').Product;

router.get('/',async(req,res)=>{
    const locations= await Location.find();

    res.json(locations);
});

router.post('/',async (req,res)=>{
    const locations = new Location({
        name:req.body.name,      
        address:req.body.address,
        workhours:req.body.workhours,
    });

    const savedLocation = await locations.save()

    res.json(savedLocation);
});

router.get('/:Id',async (req,res)=>{
    
    const location=await Location.findById(req.params.Id);

    res.json(location);
});

router.delete('/:Id',async(req,res)=>{
    const location = await Location.remove({_id:req.params.Id});
    res.json(location);
});

router.patch('/:Id', async(req,res)=>{
    const oldLocation = await Location.findById(req.params.Id);
    const location = await Location.updateOne(
        {_id:req.params.Id},
        {$set:
            {name:req.body.name,      
                address:req.body.address,
                workhours:req.body.workhours,}
    });
    await Product.updateMany({}, 
        {$set: 
            {
                "location.$[i].name": req.body.name,
                "location.$[i].address": req.body.address,
                "location.$[i].workhours": req.body.workhours
            }
        }, 
        {arrayFilters: 
            [{"i.name": oldLocation.name}]
        }
        );
    res.json(location);
})

module.exports = router;

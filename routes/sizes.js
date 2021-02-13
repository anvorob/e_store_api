const express=require('express');
const router = express.Router();
const Size = require('../models/Size').Schema;

router.get('/',async(req,res)=>{
    const sizes= await Size.find();
    res.json(sizes);
});

router.post('/',async (req,res)=>{
    const sizes = new Size({
        size:req.body.size,
        type:req.body.type,
        isAvailable:req.body.isAvailable
    });

    const savedSize = await sizes.save()

    res.json(savedSize);
});

router.get('/:Id',async (req,res)=>{
    
    const size=await Size.findById(req.params.Id);
    res.json(size);
});

router.delete('/:Id',async(req,res)=>{
    const size = await Size.remove({_id:req.params.Id});
    res.json(size);
});

router.patch('/:Id', async(req,res)=>{
    const size = await Size.updateOne(
        {_id:req.params.Id},
        {$set:
            {size:req.body.size,
             type:req.body.type,
            isAvailable:req.body.isAvailable}
    });
    res.json(size);
})
module.exports = router;

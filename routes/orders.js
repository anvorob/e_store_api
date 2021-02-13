const express=require('express');
const router = express.Router();
const Order = require('../models/Order').Order;

router.get('/:id',async(req,res)=>{
    const order= await Order.find({_id:req.params.id});
    //console.log(brands);
    res.json(order);
});

router.get('/customer/:id',async(req,res)=>{
    const order= await Order.find({customer:req.params.id});
    console.log(req.params.id);
    res.json(order);
});

module.exports = router;
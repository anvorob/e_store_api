const express = require('express');
const router = express.Router();
const url = require('url');
const Favorite = require('../models/Favorite').Favorite;
router.get('/:id',async(req,res)=>{
    console.log(req.params.id);
    const existingFavoriteList = await Favorite.findOne({customer:req.params.id})
    if(existingFavoriteList!==null){
        res.json(existingFavoriteList.products)
    }
    res.json([])
})

router.post('/:id',async(req,res)=>{

    const FavoriteList = await Favorite.findOne({customer:req.params.id});
    console.log(FavoriteList)
    if(FavoriteList===null)
    {
        console.log("PRODUCT TO ADD")
        let newFavoriteList =new Favorite(req.body);
        newFavoriteList.customer=req.params.id;
        newFavoriteList.products= req.body;
        const savedList = await newFavoriteList.save().then(data=>{
                 res.json(data);
            }).catch(err=>{
                res.json(err);
            })
    }
    else
    {
        let productExists = FavoriteList.products.filter(item=>item._id+""===req.body._id+"").length>0;
        console.log("PRODUCT TO UPDATE")
        if(productExists)
        {
            // Do not add item if exists (this should never occure, delete function should be run)
            res.json(FavoriteList.products)
        }
        else
        {
            FavoriteList.products.push(req.body);
            Favorite.updateOne({customer:req.params.id},FavoriteList).then(result=>{
                res.json(FavoriteList.products);
            }).catch(err => console.error(`Failed to add product to fav: ${err}`));
        }
        
    }
})

router.delete('/:id',async(req,res)=>{
    const FavoriteList = await Favorite.findOne({customer:req.params.id});
    console.log("DELETE")
    if(FavoriteList!=null)
    {
        let UpdatedList = FavoriteList.products.filter(item=>""+item._id!==""+req.body._id);
        FavoriteList.products = UpdatedList;
        Favorite.updateOne({customer:req.params.id},FavoriteList).then(result=>{
            res.json(UpdatedList);
        }).catch(err => console.error(`Failed to add review: ${err}`));
    }
})

module.exports = router;
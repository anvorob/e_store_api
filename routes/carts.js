const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const Cart = require('../models/Cart').Cart;
const Order = require('../models/Order').Order;
const Customer = require('../models/Customer').Customer;

router.get('/:id',async(req,res)=>{
    console.log("GET")
    if(req.params.id===undefined)
    {
        res.json({"message":"null"})
    }else{
        const result =await Cart.find({customer:req.params.id});
        
        res.json(result);

    }
});

router.get('/submit/:id', async (req,res)=>{
    console.log(req.params.id)

    const cartObj =await Cart.findOne({customer:req.params.id});
    const numberOfOrders = await Cart.find().count();
    var d = new Date();
    
    const order = new Order({
        customer:cartObj.customer,
        reference:"PO_"+numberOfOrders,
        date:new Date(),
        products:[...cartObj.product],
        totalPrice:cartObj.totalPrice,
        deliveryAddress:cartObj.deliveryAddress,
        billingAddress:cartObj.billingAddress
    });

     await order.save().then(data=>{
        res.json(data);
        Cart.deleteOne({customer:req.params.id});
   }).catch(err=>{
       res.json(err);
   })
    
})
router.post('/',async(req,res)=>{
    try{

    let totalPrice = 0;
    if(req.body.customer===undefined || req.body.customer==null)
    {
        res.json({"customer":"is null"})
        return;
    }
    
    const existingConsumer = await Cart.findOne({customer:req.body.customer});
    const cart = {
        product:req.body.product,//mergeProductsInCart(existingConsumer!==null?existingConsumer.product:[],req.body.product),
        location:req.body.location,
        totalPrice:totalPrice,
        promoCode:req.body.promoCode,
        billingAddress:req.body.billingAddress,
        deliveryAddress:req.body.deliveryAddress
    };

    let value =cart.product;
    for(var i=0;i<cart.product.length;i++)
    { 
        let fPrice =parseFloat(value[i].price);
        let iQty = value[i].qty||1;
        totalPrice+=fPrice*iQty;
    }
    cart.totalPrice = totalPrice;

    if(JSON.stringify({})===JSON.stringify(existingConsumer) || existingConsumer==null){
        console.log("create")
        
        let newCart =new Cart(cart);
        newCart.customer=req.body.customer;
        const savedCustomers = await newCart.save().then(data=>{
                 res.json(data);
            }).catch(err=>{
                res.json(err);
            })
        
    }else{
        
        Cart.updateOne({customer:req.body.customer},cart).then(result => {
            const { matchedCount, modifiedCount } = result;
            console.log(result);
            res.json(cart)
            
          })
          .catch(err => console.error(`Failed to add/update cart: ${err}`));
        
    }
    }catch(Exception){
        console.log(Exception)
    }
})

router.post('/additem',async(req,res)=>{
    try{

    let totalPrice = 0;
    if(req.body.customer===undefined || req.body.customer==null)
    {
        res.json({"customer":"is null"})
        return;
    }
    
    const existingConsumer = await Cart.findOne({customer:req.body.customer});
    const cart = {
        product:existingConsumer!==null?existingConsumer.product:[],//(existingConsumer!==null)?[...existingConsumer.product,...req.body.product]:req.body.product,
        location:req.body.location,
        totalPrice:totalPrice,
        promoCode:req.body.promoCode,
        ...existingConsumer
    };

    let newItem =req.body.product[0];
    if(cart.product.length>0)
    {
        let itemFound=false;
        cart.product.every(item=>{
            if(newItem._id+""===item._id+"")
            {
                if(newItem.sizes[0].size===item.sizes[0].size && newItem.sizes[0].type===item.sizes[0].type)
                {
                    let index = cart.product.indexOf(newItem);
                    cart.product[index].qty+=newItem.qty;
                    itemFound=true;
                    return false;
                }
            }
        })
        if(!itemFound)
        {
            cart.product.push(newItem);
        }
        
    }
    else{
        cart.product.push(newItem);
    }
    let value =cart.product;
    for(var i=0;i<cart.product.length;i++)
    { 
        let fPrice =parseFloat(value[i].price);
        let iQty = value[i].qty||1;
        totalPrice+=fPrice*iQty;
    }
    cart.totalPrice = totalPrice;

    if(JSON.stringify({})===JSON.stringify(existingConsumer) || existingConsumer==null){
        console.log("create")
        
        let newCart =new Cart(cart);
        newCart.customer=req.body.customer;
        const savedCustomers = await newCart.save().then(data=>{
                 res.json(data);
            }).catch(err=>{
                res.json(err);
            })
        
    }else{
        
        Cart.updateOne({customer:req.body.customer},cart).then(result => {           
            res.json(cart)
          })
          .catch(err => console.error(`Failed to add/update cart: ${err}`));
    }
    }catch(Exception){
        console.log(Exception)
    }
})


function mergeProductsInCart(oArray,sArray)
{
    // Add original products to array
    let tempArray = [...oArray];
    //loop over incoming array of products
    sArray.map(item=>{
        //console.log("CURRENT ITEM: "+JSON.stringify(item))
        // check every element of original product array if there any matching products to update qty
        let matched=oArray.every(oitem=>{
            if(oitem._id+""===item._id+"")
            {
                if(oitem.sizes[0].size===item.sizes[0].size && oitem.sizes[0].type===item.sizes[0].type)
                {
                    let index = tempArray.indexOf(oitem);
                    tempArray[index].qty=item.qty;
                    console.log("Updated qty of the item with same size.")
                    return true;
                }
                console.log("Item exist in the cart but has different size")
                return false;
            }
            return true;
        });
        // If source element doesnt exist in the cart (no matches found)
        if(!matched)
        {
            console.log("Added new item to cart")
            tempArray.push(item);
        }
    })
    // console.log("OARR: "+JSON.stringify(oArray))
    // console.log(tempArray)
    return tempArray;
}
router.delete('/:id',async(req,res)=>{
    console.log("DELETE ONE ITEM")
    let customerId = req.params.id;
    let productId = req.body[0]._id;
    let productSize = req.body[0].sizes;
    console.log(req.body)
    let existingCart= await Cart.findOne({customer:customerId});
    if(existingCart!==null){
        let filteredArrr = existingCart.product.filter(product=>{
            return ""+product._id!==productId+"" && JSON.stringify(product.sizes)!==JSON.stringify(productSize)
        });
        console.log(filteredArrr.length);
        existingCart.product= filteredArrr;
    }
    let value =existingCart.product;
    let totalPrice = 0;
    for(var i=0;i<existingCart.product.length;i++)
    { 
        totalPrice+=parseFloat(value[i].price)||0;
    }
    existingCart.totalPrice = totalPrice;
    Cart.updateOne({customer:customerId},existingCart).then(result=>{
        res.json(existingCart);
    }).catch(err => console.error(`Failed to add cart item: ${err}`));
})

router.patch('/:id',async(req,res)=>{
    let totalPrice = 0;
    for(var value in req.body.products)
    {  
        totalPrice+=parseFloat(value.price);
     }
    const cart = await Cart.updateOne(
        {_id:req.params.Id},
        {$set:
            {   
                product:req.body.products,
                location:req.body.location,
                totalPrice:totalPrice,
                promoCode:req.body.promoCode
            }
    });
    res.json(cart);
})

module.exports = router;
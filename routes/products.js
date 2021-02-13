const express=require('express');
const router = express.Router();
const Product = require('../models/Product').Product;
const Colour = require('../models/Colour').Colour;
const url = require('url');
const { query } = require('express');
const { Category } = require('../models/Category');

router.get('/',async(req,res)=>{
    const queryObject = url.parse(req.url,true).query;
    if(Object.keys(queryObject).length==0){

        const products= await Product.find();

        res.json(products);
        return;
    }
    const categories = await Category.find();
    //getSubCategory(categories,queryObject.category)
    console.log(queryObject)
    var searchObject = {};
    Object.keys(queryObject).map(key=>{
        switch(key){
            case 'colour':console.log("COLOUR");
                    searchObject.colour={$elemMatch:{name:queryObject.colour}}; break;
            case 'brand':console.log("BRAND");
                    searchObject.brand=queryObject.brand;
                    break;
            case 'tag':console.log("TAG")
                    searchObject.tag=queryObject.tag
                        break;
            case 'category':console.log("CATEGORY")
                    let subCategories = getSubCategory(categories,queryObject.category);
                    if(subCategories.length>0)
                    {
                        let array =subCategories.map(item=>new RegExp(item.name, 'i'));
                        array.push(new RegExp(queryObject.category,'i'))
                        searchObject.tag={ $in: array}
                        
                    }else
                    searchObject.tag=queryObject.category
                        break;
            case 'query': console.log("QUERY")
                    
                    searchObject.name=new RegExp(queryObject.query, 'i');
                    
                    break;
            case 'price-max': 
                    searchObject.price={ $lte:queryObject["price-max"],...searchObject.price};
                    break;
            case 'price-min': 
                    searchObject.price={ $gte:queryObject["price-min"],...searchObject.price};
                    break;
            case 'sale':
                    searchObject.price_origin=null;
                    if(queryObject.sale=='true')
                    searchObject.price_origin={$ne:null};

        }
    })
    
    const products= await Product.find(searchObject);
    res.json(products);
    
    // const fs = require('fs');
    // fs.writeFileSync('test.json', req);
});

function getSubCategory(list,name)
{
    let array=[];
    let arr = list.filter(item=>item.name===name);
    if(arr.length>0){
        array=[...arr[0].subCategory,...array];
    }
        
    list.forEach(element => {
        array = [...array,...getSubCategory(element.subCategory,name)];
    });
    return array;
}
router.post('/',async (req,res)=>{
    
    const products = new Product({
        name:req.body.name,      
        colour:req.body.colour,
        size:req.body.size,
        sale_percent:req.body.sale_percent,
        image:req.body.image,
        price:req.body.price,
        old_price:req.body.old_price,
        shipping:req.body.shipping,
        brand:req.body.brand
    });
//console.log(req.body);
const fs = require('fs');
var d = new Date();
  var n = d.getMilliseconds();
  var s = d.getSeconds();
  var m = d.getMinutes();
    fs.writeFileSync('test'+m+""+s+""+n+'.txt', JSON.stringify(req.body));
    //const savedProduct = await products.save()
    // .then(data=>{
    //     res.json(data);
    // }).catch(err=>{
    //     res.json(err);
    // })
    //res.json(savedProduct);
});

router.get('/:productId',async (req,res)=>{
    
    const product=await Product.findById(req.params.productId);
   
    res.json(product);
});

router.delete('/:productId',async(req,res)=>{
    const product = await Product.remove({_id:req.params.productId});
    res.json(product);
});

router.patch('/:productId', async(req,res)=>{

    const product = await Product.findOne({_id:req.params.productId});
    console.log(req.body.colour);

    product.colour=JSON.parse(req.body.colour);
    product.price=req.body.price;
    product.name=req.body.name;
    product.brand=req.body.brand;
    product.image=req.body.image;
    Product.updateOne({_id:req.params.productId},product).then(result=>{
        res.json(product);
    }).catch(err => console.error(`Failed to add product to fav: ${err}`));


})

module.exports = router;

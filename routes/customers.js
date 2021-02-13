const express=require('express');
const router = express.Router();
const Customer = require('../models/Customer').Customer;
const crypto = require('crypto');
const algorithm = process.env.ALGORITHM;
const key = process.env.KEY;
const iv = process.env.IV;

function encrypt(text){
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return encrypted.toString('hex') ;
}

router.get('/',async(req,res)=>{
    const customers= await Customer.find();
    
    res.json(customers);
});

router.get('/isLogged/:id',async(req,res)=>{
    const customer = await Customer.findById(req.params.id);
    console.log(customer);
    res.json(customer.isLoggedIn);
})

router.post('/login/',async(req,res)=>{
    const userInPassword = req.body.password;
 
    if(req.body.email ===undefined)
        res.json({"message":"Email is null"});
    else{
        const searchObject = {
            "email":req.body.email,
            "password":encrypt(req.body.password)
        }
       const customer = await Customer.findOneAndUpdate(searchObject,{isLoggedIn:true,lastLoggedIn:new Date().toISOString()},{new:true,lean:true})
        res.json(customer);
        
    
        
    }
    
})

router.get('/logout/:id',async(req,res)=>{
    const userInPassword = req.body.password;
    
    Customer.findById(req.params.id,async (err,doc)=>{
        if(err)
        {
            console.log(err);
            res.json(err);
        }
        doc.isLoggedIn = false;
        const result =await doc.save()
        res.json(result);
    });
   
})

router.post('/',async (req,res)=>{
    const customers = new Customer({
        name:req.body.name,
        password:encrypt(req.body.password),
        email:req.body.email,
        billingAddress:req.body.billingAddress,
        deliveryAddress:req.body.deliveryAddress,
        lastLoggedIn:null,
        isLoggedIn:false
    });
    const existingConsumer = await Customer.find({email:req.body.email});
    if(!existingConsumer){
        const savedCustomers = await customers.save()
        res.json(savedCustomers);
    }
    res.json({"message":"User with this email already exist"});
});

router.get('/:Id',async (req,res)=>{
    
    const customer=await Customer.findById(req.params.Id);
    
    res.json(customer);
});

router.delete('/:Id',async(req,res)=>{
    const customer = await Customer.remove({_id:req.params.Id});
    res.json(customer);
});

router.patch('/:Id', async(req,res)=>{
    console.log(req.body)
    const customer = await Customer.findOneAndUpdate({_id:req.params.Id},{
        billingAddress:req.body.billingAddress,
        deliveryAddress:req.body.deliveryAddress
    },{new:true,lean:true})
    res.json(customer);
})

module.exports = router;

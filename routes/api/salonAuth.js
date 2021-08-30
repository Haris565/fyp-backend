const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Salon = require("../../model/salon")
const auth = require ("../../middleware/auth");
const { compareSync } = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken")
const config = require ('config');

//route GET api/auth
//@desc Test route 


router.get('/', auth, async (req,res)=>{
    try{
        const salon = await Salon.findById(req.user.id).select("-password")
        console.log(salon);
        res.json(salon);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("server error")
    }
  
})


router.post("/login", [
    check('email', "Please include a valid email").isEmail(),
    check('password', "Password is required").exists()
], async (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }

    const {email, password}=req.body;
    

    try {
        let salon = await Salon.findOne({email});
        console.log(salon);
        if(!salon){
            return res.status(400).json ({error : [{msg:"Invalid credentials"}]})
        }

        const isMatch = await bcrypt.compare(password, salon.password);
        if(!isMatch){
            return res.status(400).json ({error : [{msg:"Invalid credentials"}]})
        }

        const payload = {
            user:{
              id: salon.id
            }
        }
        jwt.sign(payload, config.get("jwtsecret"), {expiresIn: 360000}, 
        (err, token)=>{
            if(err) throw err;
            res.json({token})
        }
        )
    }
    catch(err){
        console.error(err.message)
        res.status(500).json("Server error")
    }


})

module.exports= router;

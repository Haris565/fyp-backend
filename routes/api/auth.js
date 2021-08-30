const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../../model/user")
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
        const user = await User.findById(req.user.id).select("-password")
        console.log(user);
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("server error")
    }
  
})


router.post("/", [
    check('email', "Please include a valid email").isEmail(),
    check('password', "Password is required").exists()
], async (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }

    const {email, password}=req.body;
    

    try {
        let user = await User.findOne({email});
        console.log(user);
        if(!user){
            return res.status(400).json ({error : [{msg:"Invalid credentials"}]})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json ({error : [{msg:"Invalid credentials"}]})
        }

        const payload = {
            user:{
              id: user.id
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

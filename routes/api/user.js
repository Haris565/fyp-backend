const { compareSync } = require('bcryptjs');
const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar')
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken")
const config = require ('config');
const auth =require("../../middleware/auth")


const User = require('../../model/user');
const Appointment = require("../../model/Appointments")
const Salon = require('../../model/salon');

const router = express.Router();


//route POST api/user
//@desc Register user


router.post('/',[
    check('name', 'name is required ').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more character').isLength({min:6}),
    check('number', 'Please enter a valid number').isLength({min:11})
], async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
    }
    // if user exist 
    const {name,email,password,number}=req.body
    try {
        let user = await User.findOne({email});
        if (user){
           return res.status(400).json({ errors: [{msg: "email is already register"}]})
        }

        const avatar = gravatar.url(email, {
            d:'retro', 
            s:'200',
            r:'pg',
             
           
        })

        user = new User ({
            name,
            email,
            password,
            number,
            avatar
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        
        await user.save();
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
        res.status(500).send("Server Error")
    }
    
   
})


//route POST api/user/booking
//@desc book an apppointment for Register user


router.post('/booking', auth , async (req,res)=> {
    const {salon_id, start_time, services} =req.body;
    const customer_id = req.user.id

    try {
        
        const appointment = new Appointment({
            customer_id, salon_id, start_time, services
        })
        let booking = await appointment.save()
        res.json(booking)
        console.log(booking._id)
        if(booking){
            let user = await User.findById(req.user.id)
            if(user){
                let appointmentsByUser = user.appointment
                appointmentsByUser=[...appointmentsByUser, booking._id]
                console.log(appointmentsByUser)
                const updated= await User.updateOne({_id:req.user.id},{appointment:appointmentsByUser})
                console.log(updated)
            }
        
            let salon = await Salon.findById(req.body.salon_id)
            console.log(salon)
            if(salon){
                let appointmentsforSalon = salon.appointment
                appointmentsforSalon=[...appointmentsforSalon, booking._id]
                console.log(appointmentsforSalon)
                const updated= await Salon.updateOne({_id:req.body.salon_id},{appointment:appointmentsforSalon})
                console.log(updated)
            }
            
        }

    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
})

//route POST api/user/appointmentsforSalon
//@desc see all apointments booked for Register salon

router.get("/appointmentsforUser", auth, async (req,res)=>{
    console.log('hello')
    try {
        let allappointments = await Appointment.find({customer_id:req.user.id})
        res.json(allappointments)
        console.log(allappointments)
    }
    catch (err){
        res.status(500).send("Server Error")
    }
})

module.exports= router;
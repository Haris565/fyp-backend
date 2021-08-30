// const express = require('express');
// const { check, validationResult } = require('express-validator');
// const auth = require("../../middleware/auth")



// const Appointment = require('../../model/Appointments');
// const Salon = require('../../model/salon');
// const Profile =require ("../../model/Profile")
// const router = express.Router();


// router.post('/', auth , async (req,res)=> {
//     const {salon_id, start_time, services} =req.body;
//     const customer_id = req.user.id

//     try {
        
//         const appointment = new Appointment({
//             customer_id, salon_id, start_time, services
//         })
//         let booking = await appointment.save()
//         res.json(booking)

//     }
//     catch(err){
//         console.log(err)
//         res.status(500).send("Server Error")
//     }
// })
const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const EventNew = require('../models/Events')
const router = Router()

router.post(
    '/register',
     [
        check('email', 'wrong email').isEmail(),
        check('password', "wrong pass").isLength({min:6})
    ] 
     , async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: "error"
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
            res.status(400).json({message: "auth.routes Email error"})
        }

        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPass})

        await user.save()

        res.status(201).json({message: "user created"})

    } catch (e) {
        res.status(500).json({message: "500 error"})
    }
})

router.post(
    '/login',
    [
        check('email', 'wrong email').normalizeEmail().isEmail(),
        check('password', "worng pass").exists()
    ] 
     , async (req, res) => {
    try {
        
        const errors = validationResult(req)

        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: "error"
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: 'error'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: "wrong pass"})
        }

        const token = jwt.sign(
            {userId : user.id},
            config.get('jwtSecret'),
            {expiresIn: '1000000h'}
        )

        res.json({ token, userId: user.id })

    } catch (e) {
        res.status(500).json({message: "auth routes 500"})
    }
})

router.get(
    "/events",
     async (req, res) => {
    try {
        const you = await User.findOne({token: req.token})
        const allEvents = await EventNew.find({token: you})
        res.json(allEvents)
        

    }catch(e){
        res.status(500).json({message:"something went wrong"})
    }
})

router.post(
    "/create",
    async (req, res) => {
        try {
            const {date, description, owner, token} = req.body
            console.log(date, description, owner)
            const event = new EventNew({date, description, owner, token})

             await event.save()
            res.status(201).json({message: "ok"})
        } catch (e) {
            console.error(req.body);
            res.status(500).json({message: "bug"})
        }
    })

module.exports = router
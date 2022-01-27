const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const StaticInfo = require('../models/StaticInformation')
const Licenses = require('../models/Licenses')
const Company = require('../models/Company')
const { isValidObjectId } = require('mongoose')
const router = Router()

router.post(
    '/register',
     [
        check('name', "short name").isLength({min:3}),
        check('email', 'wrong email').normalizeEmail().isEmail(),
        check('password', "wrong pass").isLength({min:6}),
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

        const {name, email, password} = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
            res.status(400).json({message: "auth.routes Email error"})
        }

        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({name, email, password: hashedPass, isAdmin: false})

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
        check('password', "wrong pass").exists(),
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
        // console.log(user)

        if (!user) {
            return res.status(400).json({message: 'error'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: "wrong pass"})
        }

        // const token = jwt.sign(
        //     {userId : user.id},
        //     config.get('jwtSecret'),
        //     {expiresIn: '10h'}
        // )

        res.json({name: user.name, userId: user.id, isAdmin: user.isAdmin })

    } catch (e) {
        res.status(500).json({message: "auth routes 500"})
    }
})

router.get(
    "/allCompanies",
     async (req, res) => {
    try {
        const allCompanies = await Company.find()
        res.json(allCompanies)
    }catch(e){
        res.status(500).json({message:"something went wrong"})
    }
})

router.get(
    "/edit/:id",
     async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
        res.json(company)
    }catch(e){
        res.status(500).json({message:"something went wrong"})
    }
})

router.post(
    "/create",
    async (req, res) => {
        try {
            const {name, edrpou, numOfWorkers, payerPDW, address, phoneNum, haveLicenses, responsible, taxationSystem, tasks, infoESW, kwed} = req.body
            const company = new Company({name, edrpou, numOfWorkers, payerPDW, address, phoneNum, haveLicenses, responsible, taxationSystem, infoESW, kwed, tasks})
            await company.save()
            res.status(201).json({message: "ok"})
        } catch (e) {
            console.error(req.body);
            res.status(500).json({message: "bug"})
        }
    })

router.post(
    "/update",
    async (req, res) => {
        try {
            const {id, tasksList} = req.body
            await Company.findOneAndUpdate( {_id: id}, {tasks: tasksList})
            res.status(201).json({message: "update completed"})
        } catch (e) {
            console.error(req.body);
            res.status(500).json({message: "bug"})
        }
    })

router.post(
    "/updateCompany",
    async (req, res) => {
        try {
            const {_id, name, edrpou, numOfWorkers, payerPDW, address, phoneNum, haveLicenses, responsible, taxationSystem, infoESW, kwed, tasks} = req.body
            await Company.findOneAndUpdate( {_id: _id}, {
                name: name,
                edrpou: edrpou, 
                numOfWorkers: numOfWorkers, 
                address: address, 
                payerPDW: payerPDW, 
                phoneNum: phoneNum,
                haveLicenses: haveLicenses, 
                responsible: responsible, 
                taxationSystem: taxationSystem,  
                tasks: tasks,
                infoESW: infoESW,
                kwed: kwed
            })
            res.status(201).json({message: "update completed"})
        } catch (e) {
            console.error(req.body);
            res.status(500).json({message: "bug"})
        }
    })

router.post(
    "/deleteCompany",
    async (req, res) => {
        try {
            await Company.deleteOne({_id: req.body.id})
            res.status(201).json({message: "successful deleted"})
        } catch (e) {
            console.error(req.body);
            res.status(500).json({message: "bug"})
        }
    })

router.get(
    "/allUsers",
     async (req, res) => {
    try {
        const allUsers = await User.find()
        res.json(allUsers)
    }catch(e){
        res.status(500).json({message:"something went wrong"})
    }
})

router.get(
    "/staticInfoGet",
    async(req, res) => {
        try {
            const staticInfo = await StaticInfo.find()
            res.json(staticInfo)
        } catch (e) {
            res.status(500).json({message: 'auth routes error'})
        }
    }
)

router.post(
    "/staticInfoUpdate",
    async(req, res) => {
        const { info, name } = req.body

        try {
            await StaticInfo.findOneAndUpdate({name: name}, {
                info: info
            })
            res.status(201).json({message: "successful updated"})
        } catch (e) {
            res.status(500).json({message: 'auth routes error'})
        }
    }
)

router.post(
    "/LicensesPost",
    async(req, res) => {
        try {
            const {companyName, licensesList} = req.body
            const companyWithLicenses = new Licenses({companyName, licensesList})
            await companyWithLicenses.save()
            res.status(201).json({massage: 'added successfully '})
        } catch (e) {
            console.log(e)
        }
    }
)

router.post(
    "/LicensesUpdate",
    async(req, res) => {
        try {
            const {companyName, licensesList} = req.body
            await Licenses.findOneAndUpdate({companyName: companyName}, {
                licensesList: licensesList
            })
            res.status(201).json({massage: 'added successfully '})
        } catch (e) {
            console.log(e)
        }
    }
)

router.post(
    "/LicensesDelete",
    async (req, res) => {
        try {
            const {companyName} = req.body
            await Licenses.findOneAndDelete({'companyName': companyName})
            res.status(201).json({messgae: 'deleted'})
        } catch (e) {
            console.log(e)
        }
    }
)

router.get(
    "/LicensesGet",
    async(req, res) => {
        try {
            const allLicenses = await Licenses.find()
            res.json(allLicenses)
        } catch (e) {
            console.log(e)
        }
    }
)

module.exports = router
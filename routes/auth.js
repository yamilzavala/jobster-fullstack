const express = require('express')
const authenticateUser = require('../middleware/authentication')
const rateLimiter = require('express-rate-limit')

const router = express.Router()
const { register, login, updateUser } = require('../controllers/auth')
const testUser = require('../middleware/testUser')

const apiLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 500,
    message: {
      msg: 'To many request from this IP, plese try again after 5 minutes'
    }
  })

router.post('/register', apiLimiter, register)
router.post('/login', apiLimiter, login)
router.patch('/updateUser',authenticateUser, testUser, updateUser )

module.exports = router

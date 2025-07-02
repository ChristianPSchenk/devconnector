const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const config = require('config');
const { check, validationResult } = require('express-validator');



// @route  GET api/users
// @desc   Test route
// @access Public
router.get('/',auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
);

// @route  GET api/auth
// @desc   authenticate
// @access Public
router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password','Password not supplied').exists()],
    async  (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;


        try {
            let user = await User.findOne({email })
            if(!user) 
            {
                return res.status(400).json({errors: [ {msg: 'Invalid Credentials'}]});
            }


            const isMatch = await bcrypt.compare(password,user.password)

            if(!isMatch) 
            {
                return res.status(400).json({errors: [ {msg: 'Invalid Credentials'}]});
            }                

            const payload= {
                user: {
                    id: user.id
                }
            }
     
            jsonwebtoken.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: Number(config.get('jwtExpiry')) },
                (err, token) => {
                    if(err) throw err;
                    return res.json({ token });
                }
            );
           

            return
            
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
        
        
    
}
);

module.exports = router
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/user');


// @route  GET api/users
// @desc   Test route
// @access Public
router.post('/',
    [
    check('name', 'Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','at least 6+ chars').isLength({ min: 6 })
], async  (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { name, email, password } = req.body;


        try {
            let user = await User.findOne({email })
            if(user) 
            {
                return res.status(400).json({errors: [ {msg: 'User already exists'}]});
            }
            //debugger
            const avatar = gravatar.url(email,{
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            user = new User({
                email,
                avatar,
                name,
                password
            })

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

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
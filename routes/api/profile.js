const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile');
const User = require('../../models/user')
const Post = require('../../models/post');
const { check, validationResult } = require('express-validator');




// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error');
    }

}
);

// @route POST api/profile
// @desc  Create or update user profile
// @access Private
router.post('/', [auth, [check('status', 'Status is required').not().isEmpty(),
check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: [errors.array()] })
    }
    const { company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())

    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            //update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }
        profile = new Profile(profileFields);

        await profile.save(profile);
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }

    res.send('hello')

})

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles)
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');

    }
}
)


// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })

        }
        return res.json(profile)
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).send('Server Error');

    }
}
)

// @route  DELETE api/profile
// @desc   Delete profile, user and post of current user
// @access Private
router.delete('/', auth, async (req, res) => {
    try {

        await Post.deleteMany({ user: req.user.id });
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findOneAndDelete({ _id: req.user.id });


        return res.status(200).json({ msg: 'Profile deleted' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).send('Server Error');

    }
}
)

// @route  PUT api/profile/experience
// @desc   add profile experience
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } = req.body
    const newExp = {
        title, company, location, from, to, current, description
    }


    try {
        // @todo - remove users and posts
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        if (profile.experience.filter(exp => exp.title === title && exp.company === company).length > 0) {
            return res.status(400).json({ msg: 'Experience already exists' });
        }

        profile.experience.unshift(newExp);
        await profile.save();
        return res.status(200).json(profile);

        return res.status(200).json({ msg: 'Profile deleted' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).send('Server Error');

    }
}
)



// @route  DELETE api/profile/experience/:exp_id
// @desc   delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {



    try {
        // @todo - remove users and posts
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        if ((profile.experience.filter(exp => exp._id == req.params.exp_id)).length === 0) {
            return res.status(400).json({ msg: 'Experience not found' });
        }

        profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
        await profile.save();
        return res.status(200).json(profile);


    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).send('Server Error');

    }
}
)


// @route  PUT api/profile/education
// @desc   add profile education
// @access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body
    const newEdu = {
        school, degree, fieldofstudy, from, to, current, description
    }


    try {
        // @todo - remove users and posts
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        if (profile.education.filter(edu => edu.school === school && edu.degree === degree).length > 0) {
            return res.status(400).json({ msg: 'Education already exists' });
        }

        profile.education.unshift(newEdu);
        await profile.save();
        return res.status(200).json(profile);

        return res.status(200).json({ msg: 'Profile deleted' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).send('Server Error');

    }
}
)



// @route  DELETE api/profile/education/:edu_id
// @desc   delete profile education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {



    try {

        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        if ((profile.education.filter(edu => edu._id == req.params.edu_id)).length === 0) {
            return res.status(400).json({ msg: 'Education not found' });
        }

        profile.education = profile.education.filter(edu => edu._id.toString() !== req.params.edu_id);
        await profile.save();
        return res.status(200).json(profile);


    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).send('Server Error');

    }
}
)

// @route api/profile/github/:username
// @desc  Get user repos from github    
// @access Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`
            ,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }

        };
        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'problems connecting to github' })
            }
            if (response.statusCode != 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }
            return res.json(JSON.parse(body));
        }
        );
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
})

module.exports = router
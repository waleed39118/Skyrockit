// Those are the skeleton of the controller (it should always be there when creating a controller)
const router = require ('express').Router();

const { application } = require('express');
const User = require ('../models/user');

// module.exports = router;

router.get('/new', async (req, res) => {
    res.render('applications/new.ejs')
})

router.post('/', async(req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/applications`); 
}) 

router.get('/', async(req,res) => {
    const currentUser = await User.findById(req.session.user._id);
    res.render('applications/index.ejs', {applications: currentUser.applications})

})

router.get("/:applicationId", async (req,res) => {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/show.ejs', {application})
})

// Update for edit
router.get('/:applicationId/edit', async (req,res) => {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {application});
} )

router.put("/:applicationId", async (req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    application.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`);
})

// Deleting now
router.delete("/:applicationId", async (req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId).deleteOne(); // for deleting from the the array we use delete one | we cannot use remove becasue remove is only for the objects 
    await currentUser.save();
    res.redirect("/users/${currentUser._id}/applications"); 
}); 


module.exports = router;
const router = require('express').Router();

const publicationService = require('../services/publicationService');
const userService = require('../services/userService');
const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { preloadPublication } = require('../middlewares/publicationMiddleware');

router.get('/', async (req, res) => {
   const publications = await publicationService.getAll().lean();
   
   res.render('publication', { publications });
});

router.get('/:publicationId/details', async (req, res) => {
   const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
   
   const isAuthor = req.user?._id == publication.author?._id
   const isShared = publication.usersShared.some(x => x._id == req.user?._id);

   res.render('publication/details', { ...publication, isAuthor, isShared });
});

router.get('/:publicationId/edit', isAuth, preloadPublication, async (req, res) => {
   const publication = await publicationService.getOne(req.params.publicationId).lean();
   
   res.render('publication/edit', { ...publication });
});

router.post('/:publicationId/edit', isAuth, preloadPublication, async (req, res) => {
   try {
        await publicationService.update(req.params.publicationId, req.body);

        res.redirect(`/publications/${req.params.publicationId}/details`);

   } catch (error) {
        res.render('publication/edit', { ...req.body, error: getErrorMessage(error) });
   }      
});

router.get('/:publicationId/delete', isAuth, preloadPublication, async (req, res) => {
    await publicationService.delete(req.params.publicationId);

    res.redirect('/publications');
});

router.get('/create', isAuth, (req, res) => {

    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
   try {
        const createdPublication = await publicationService.create({...req.body, author: req.user._id });
        await userService.addPublication(req.user._id, createdPublication._id)

        res.redirect('/publications');
   } catch (error) {

        res.render('publication/create', { ...req.body, error: getErrorMessage(error) });
   }      
});

router.get('/:publicationId/share', isAuth, async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId);
    const user = await userService.getOne(req.user._id);
    
    const isAuthor = req.user?._id == publication.author?._id;
    const isShared = publication.usersShared.some(x => x._id == req.user?._id);

    if (isAuthor || isShared) {
        return res.redirect('/');
    }

    publication.usersShared.push(req.user._id);
    user.publications.push(publication);

    await publication.save();
    await user.save();

    res.redirect(`/publications/${req.params.publicationId}/details`);
});

module.exports = router;
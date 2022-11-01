const publicationService = require('../services/publicationService');

exports.preloadPublication = async (req, res, next) => {
    const publication = await publicationService.getOne(req.params.publicationId).lean();

    if(publication.author != req.user._id) {
        return next ({ message: 'You are not authorized!', status: 401 });
    }

    req.publication = publication;

    next();
}
const Publication = require('../models/Publication');

exports.getAll = () => Publication.find();
exports.create = (publicationData) => Publication.create(publicationData);
exports.getOneDetailed = (publicationId) => Publication.findById(publicationId).populate('author');
exports.getOne = (publicationId) => Publication.findById(publicationId);
exports.update = (publicationId, publicationData) => Publication.updateOne({_id: publicationId}, {$set: publicationData}, {runValidators: true});
exports.delete = (publicationId) => Publication.deleteOne(publicationId);
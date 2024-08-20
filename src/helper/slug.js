
const slugify = require('slugify')
const TicketCategoryModel = require("../models/ticket-category.model");
const EventModel = require("../models/event.model");

exports.generateSlug = async (typeOfTicket) => {
    const joinetTicketTitle = slugify(typeOfTicket, {lower: true, strict: true}) +'-';
    const count = await TicketCategoryModel.countDocuments();
    return joinetTicketTitle + count + 1;
};

exports.generateEventSlug = async (_id,title) => {
    const joinetTicketTitle = slugify(title, { lower: true, strict: true }) + '-';
    const count = await EventModel.find({_id}).countDocuments();
    return joinetTicketTitle + count + 1;
};
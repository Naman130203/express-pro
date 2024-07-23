import asyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";


// @desc GET all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

// @desc GET a specific contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    res.status(200).json(contact)
});

// @desc CREATE New contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is :" , req.body);
    const {name , email , phone } = req.body ; 
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name ,
        email ,
        phone,
        user_id: req.user.id
    });
    res.status(201).json(contact);
});

// @desc UPDATE contact
// @route PUT /api/contacts/:id
// @access private
const UpdateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
       res.status(403);
       throw new Error("Not authorized for the contact")
    }

    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true},
    )
    res.status(200).json(updateContact);
});

// @desc DELETE contact
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Not authorized for the contact")
     }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
});


export  {getContacts , createContact , UpdateContact , deleteContact , getContact};

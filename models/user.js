const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    ethaddress: { type : String , unique : true, required : true },
    // refcode: { type : String , unique : true, required : true },
    points: { type: Number }
})


module.exports = mongoose.model('User' ,userSchema );
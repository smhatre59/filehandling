var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UploadSchema   = new Schema({
    title: {type: String, required: true},
    allDay: {type: Boolean, required: true},
    start: {type: Date,required:true},
    end: {type:Date,required:true}
});

module.exports = mongoose.model('Upload', UploadSchema);

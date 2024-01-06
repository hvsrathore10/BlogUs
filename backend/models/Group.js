import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: String,
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }],
    admins: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        max: 2 
    }],  
});

const group = mongoose.model('group', GroupSchema);

export default group;
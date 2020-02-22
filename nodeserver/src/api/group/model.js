import mongoose, { Schema } from 'mongoose'
import { env } from '../../config'

const groupSchema = new Schema({

    title: {
        type: String,
        trim: true
    },
    members: [{
        type: String
    }]

}, {
  timestamps: true
})

groupSchema.methods = {
  view (full) {
    let view = {}

    view.id = this.id
    view.title = this.title;
    view.members = this.members;
 
    if (full) {
      view.createdAt = this.createdAt;
      view.updatedAt = this.updatedAt;
    }     

    return view;
  }
}

const model = mongoose.model('Group', groupSchema)

export const schema = model.schema
export default model
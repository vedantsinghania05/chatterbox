import mongoose, { Schema } from 'mongoose'
import { env } from '../../config'

const messageSchema = new Schema({

    poster: {
        type: ObjectId
    },
    group: {
        type: ObjectId
    },
    content: {
        type: String
    }

}, {
  timestamps: true
})

messageSchema.methods = {
  view (full) {
    let view = {}

    view.poster = this.poster
    view.group = this.group
    view.content = this.content
 
    if (full) {
      view.createdAt = this.createdAt;
      view.updatedAt = this.updatedAt;
    }     

    return view;
  }
}

const model = mongoose.model('', messageSchema)

export const schema = model.schema
export default model
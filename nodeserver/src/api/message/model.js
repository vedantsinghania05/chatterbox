import mongoose, { Schema } from 'mongoose'
import { env } from '../../config'

const messageSchema = new Schema({

    poster: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    group: {
        type: Schema.ObjectId,
        ref: 'Group',
        index: true
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

export const populateManyPosters = (messages) => {
  let promises = [];
  messages.forEach(m => promises.push(new Promise(function(resolve, reject) {
    model.populate(m, [{ path: 'poster' }], function (err, popmessage) {
      if (!err && popmessage) {
        resolve(popmessage);
      } else {
        reject(m); // return the unpopulated message
      }
    });
  })))

  let popmanymessages = [];
  return Promise.all(promises.map(p =>
    p.catch((message) => { // we should get the original user here since that is what we returned above
      if (message) popmanymessages.push(message);
      return undefined;
    })
  ))
  .then((messages) => {
    messages.forEach(message => {
      if (message) popmanymessages.push(message);
    })

    return popmanymessages;
  }) 
}

export const populateMessagePoster = (message) => {
  return new Promise(function(resolve, reject) {
    model.populate(message, [{ path: 'poster' }], function (err, popmessage) {
      if (!err && popmessage) {
        resolve(popmessage);
      } else {
        reject(null);
      }
    });
  })
}

const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
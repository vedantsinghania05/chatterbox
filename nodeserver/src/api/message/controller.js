import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Message } from '.'
import { populateManyPosters, populateMessagePoster } from './model';

export const create = ({ body }, res, next) => {
  console.log('>>>>>>>>> controller is being called')
  let fields = { poster: body.poster, group: body.group, content: body.content };
  console.log('fields = ok')

  return Message.create(fields)
    .then(message => {
      if (!message) return next(resInternal('Failed to create message'));
      return populateMessagePoster(message)})
    .then(message => {
      if (!message) return next(resInternal('Failed to populate message'))
      return resCreated(res, message.view(true))
    })
    .catch(next)
}

export const getMessages = ({ query }, res, next) => {
  let { group, skipCount } = query
  skipCount = Number(skipCount)

  console.log('>>>>>>> query', query)

  return Message.find({ group: group })
    .sort('-createdAt')
    .limit(10)
    .skip(skipCount)
    .then(messages => {
      console.log('*******: ', messages)
      if (!messages) return next(resInternal('Failed to find messages'));
      return populateManyPosters(messages);
    })
    .then(messages => {
      console.log('>>>>>>>>>', messages)
      if (!messages) return next(resInternal('Failed to populate messages'));
      return resOk(res, messages.map(m => m.view()));
    })
    .catch(next)
}
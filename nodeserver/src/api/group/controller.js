import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Group } from '.'

export const create = ({ body }, res, next) => {
    let fields = { title: body.title, members: body.members };
  
    return Group.create(fields)
      .then(group => {
        if (!group) return next(resInternal('Failed to create group'));
        return resCreated(res, group.view(true) )})
      .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Group.find(query, select, cursor)
    .then(groups => {
      if (!groups) return next(resInternal('Failed to find groups'));
      return resOk(res, groups.map(group => group.view()));
    })
    .catch(next)

export const show = ({ params, group }, res, next) => {
  Group.findById(params.id === 'me' ? group.id : params.id)
    .then(group => {
      if (!group) return next(resNotFound('Failed to find group'));
      return resOk(res, group.view(true));
    })
    .catch(next)
  }

export const update = ({ params, body, group }, res, next) =>
  Group.findById(params.id === 'me' ? group.id : params.id)
    .then(group => {
      if (!group) return next(resNotFound('Failed to find group'));

      if (body.members) group.members = body.members
      return group.save();
    })
    .then(group => {
      if (!group) return next(resInternal('Failed to update group'));
      return resOk(res, group.view(true));
    })
    .catch(next)
import { resInternal, resCreated, resOk } from '../../services/response/'
import { Group } from '.'
import { User } from '../user'

export const create = ({ body }, res, next) => {
  let fields = { title: body.title, members: body.members };

  User.find({ email: { $in: fields.members }})
    .then(users => {
      if (!users) return next(resInternal('Failed to find users'));

      field.members = users.map(u => u.id)

      return Group.create(fields)
    })
    .then(group => {
      if (!group) return next(resInternal('Failed to create group'));

      return resCreated(res, group.view(true) )
    })
    .catch(next)
}

export const getGroupsForUser = ({ user }, res, next) => {
  
  Group.find({ members: user.id })
    .then(groups => {
      if (!groups) return next(resInternal('Failed to get groups for user'))

      return resOk(res, groups.map(g => g.view(true)))
    })
    .catch(next)
}
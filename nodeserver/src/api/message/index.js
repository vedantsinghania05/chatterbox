import { Router } from 'express'
import { master, token } from '../../services/passport'
import { getMessages, create, deleteGroupsMessages } from './controller'
import { schema } from './model'
export Message, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/',
  token({ required: true }),
  getMessages)

router.delete('/:id',
  token({ required: true }),
  deleteGroupsMessages)

export default router
import { Router } from 'express'
import authenticate from '~/middleware/authenticate'
import { index, username, signIn, signOut, check, addFriend, removeFriend, addImage } from './controllers'

const router = Router()

router.get('/', authenticate(), index.get)
router.post('/', index.post)

router.get('/check', check.get)

router.post('/sign-in', signIn.post)
router.post('/sign-out', authenticate(), signOut.post)
router.post('/:username/add-friend', authenticate(), addFriend.post)
router.post('/:username/remove-friend', authenticate(), removeFriend.post)
router.post('/:username/add-image', authenticate(), addImage.post)

router.route('/:username')
  .all(authenticate())
  .get(username.get)
  .post(username.post)
  .delete(username.delete)

export default router

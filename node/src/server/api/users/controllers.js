import bcrypt from 'bcryptjs'
import blacklist from 'express-jwt-blacklist'
import User from './models'
import jwt from 'jsonwebtoken'
import stripUser from '~/util/stripUser'
import randId from '~/util/randId'
import { ServerError } from 'express-server-error'
import fs from 'fs'
import formidable from 'formidable'

export const index = {
  async get (req, res) {
    try {
      let users = await User.find({})
      if (!users) throw new ServerError('No users exist at this moment.', { status: 404 })
      res.json(users)
    } catch (error) {
      res.handleServerError(error)
    }
  },
  async post (req, res) {
    try {
      let { username, email, firstName, lastName, password1, password2 } = req.body
      if (password1 === password2) {
        let password = await bcrypt.hash(password1, 10)
        let imageSrc = '/default.jpg'
        let newUser = new User({ username, email, firstName, lastName, password, imageSrc })
        let savedUser = await newUser.save()
        res.json({ message: `Thanks for signing up, ${savedUser.username}!` })
      } else {
        throw new ServerError('Passwords don\'t match.', { status: 400 })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const check = {
  async get (req, res) {
    try {
      let authorizedQueries = ['username', 'email']
      if (authorizedQueries.includes(req.query.check)) {
        let check = req.query.check
        let data = req.query.data
        let user = await User.find({ [check]: data })
        if (user.length) res.json({ exists: true })
        else res.json({ exists: false })
      } else {
        throw new ServerError('Query not supported.', { status: 400 })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const username = {
  async get (req, res) {
    try {
      // check if the logged in user has the same username as the requested user.
      if (req.user.username === req.params.username) {
        console.log("sending logged in user " + JSON.stringify(req.user))
        let fetchedUser = await User.findOne({ username: req.params.username })
        if (!fetchedUser) throw new ServerError(`User with username '${req.params.username}' doesn't exist.`, { status: 404 })
        res.json(fetchedUser)
      } else {
        console.log('getting ' + req.params.username)
        let fetchedUser = await User.findOne({ username: req.params.username })
        if (!fetchedUser) throw new ServerError(`User with username '${req.params.username}' doesn't exist.`, { status: 404 })
        res.json(fetchedUser)
        /*res.json({
          username: fetchedUser.username,
          message: `Authentication by ${req.params.fetchedUser.username} required to view more...`
        })*/
      }
    } catch (error) {
      res.handleServerError(error)
    }
  },
  async post (req, res) {
    try {
      let { firstName, lastName, email, imageSrc } = req.body
      console.log("in with " + firstName + " " + lastName + " " + email + " " + imageSrc + " " + req.params.username)
      let user = await User.findOne({ username: req.params.username })
      if (!user) throw new ServerError(`User with username '${req.params.username}' doesn't exist.`, { status: 404 })
      if (firstName) user.firstName = firstName
      if (lastName) user.lastName = lastName
      if (email) user.email = email
      if (imageSrc) user.imageSrc = imageSrc
      let saved_user = await user.save()
      res.json({ message: 'Updates saved successfully', user: saved_user })
    } catch (error) {
      console.log(error)
      res.handleServerError(error)
    }
  },
  async delete (req, res) {
    try {
      if (req.user.username === req.params.username) {
        let deleted = await User.findOneAndRemove({ username: req.user.username })
        if (!deleted) throw new ServerError(`User with username '${req.params.username}' doesn't exist.`, { status: 404 })
        res.json({ message: 'Successfully deleted user.' })
      } else {
        throw new ServerError('Unauthorized.', { status: 401 })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

// separate into auth app if need be. 'sign-up' is handled as a POST request to '/users'
export const signIn = {
  async post (req, res) {
    try {
      let { username, password } = req.body
      let user = await User.findOne({ username })
      if (!user) throw new ServerError('Authentication failed. Incorrect username or password', { status: 401, log: false })
      let passwordHash = user.password
      let matched = await bcrypt.compare(password, passwordHash)
      if (!user || !matched || !username || !password) {
        throw new ServerError('Authentication failed. Incorrect username or password', { status: 401, log: false })
      } else {
        user = stripUser(user)
        let token = jwt.sign(user, process.env.SECRET, { expiresIn: '30 days', jwtid: randId() })
        res.status(200).json({ message: `Welcome, ${user.username}!`, token, user })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const signOut = {
  async post (req, res) {
    try {
      blacklist.revoke(req.user)
      res.json({ message: 'Sign out successful. Good bye! :)' })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const addFriend = {
  async post (req, res) {
    try {
      let { username } = req.body
      console.log('adding friend ' + req.params.username + ' to ' + username)
      let user = await User.findOne({ username: username })
      if (!user) throw new ServerError(`User with username '${friend}' doesn't exist.`, { status: 404 })
      var friend_username = req.params.username
      if (!user.friends.includes(friend_username)) {
        user.friends.push(friend_username)
        let saved_person = await user.save()
        res.json({ message: `Added '${friend_username}' as friend.` })
      } else {
        res.status(400);
        res.json({ message: `'${friend_username}' is already a friend.` })
      }
    } catch (error) {
      console.log(error)
      res.handleServerError(error)
    }
  }
}

export const removeFriend = {
  async post (req, res) {
    try {
      let { username } = req.body
      console.log('remove friend ' + req.params.username + ' to ' + username)
      let user = await User.findOne({ username: username })
      if (!user) throw new ServerError(`User with username '${friend}' doesn't exist.`, { status: 404 })
      var friend_username = req.params.username
      console.log(user.friends.includes(friend_username))
      if (user.friends.includes(friend_username)) {
        var index = user.friends.indexOf(friend_username);
        if (index > -1) {
          user.friends.splice(index, 1);
        }
        console.log('removed him ' + JSON.stringify(user.friends))
        let saved_person = await user.save()
        res.json({ message: `Removed '${friend_username}' from friends.` })
      } else {
        res.status(400);
        res.json({ message: `'${friend_username}' is not a friend.` })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const addImage = {
  async post (req, res) {
    try {
      console.log('adding image')
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        console.log(JSON.stringify(files))
        if (!files.file) {
          res.status(400);
          res.json({
            message: 'No image to upload'
          })
        } else {
          var oldpath = files.file.path;
          var newpath = 'src/client/static/people/' + files.file.name;
          if (!oldpath.name || oldpath.name.match(/\.(jpg|jpeg|png)$/i)) {
            console.log("the file is an image");
            fs.rename(oldpath, newpath, function (err) {
              if (err) {
                res.status(400);
                res.json({
                  message: 'Error, can\'t upload image'
                })
              } else {
                res.json({
                  src: '/people/' + files.file.name,
                  message: 'Successfully uploaded'
                })
              }

            });
          } else {
            throw new ServerError("the file is not an image", { status: 400 })
            console.log("the file is not an image");
          }
        }
      })
    } catch (error) {
      console.log(error)
      res.handleServerError(error)
    }
  }
}

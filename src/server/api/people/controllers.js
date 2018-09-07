import fs from 'fs'
import formidable from 'formidable'
import Person from './models'
import { ServerError } from 'express-server-error'

export const person_index = {
  /**
   *  Finds all persons or specific person by id and returns array
   */
  async get (req, res) {
    console.log("getting person" + req.params.person_id)
    try {
      if (req.params.person_id) {
        let person = await Person.findById(req.params.person_id)
        if (!person) throw new ServerError('No person with that id exists at this moment.', { status: 404 })
        if (person.users.includes(req.params.username)) {
          res.json(person)
        } else {
          throw new ServerError(`User ${req.params.username} doesn't have access to this person`, { status: 403 })
        }
      } else {
        console.log("getting all persons")
        let persons = await Person.find({ users: req.params.username })
        if (!persons) throw new ServerError('No persons exist at this moment.', { status: 404 })
        res.json(persons)
      }
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Adds person or edits existing person
   */
  async post (req, res) {
    try {
      let { image_path, image_blob, name } = req.body
      console.log("adding person " + name)
      var person;
      if (req.params.person_id) {
        console.log("updating old person " + req.params.person_id)
        person = await Person.findById(req.params.person_id)
        if (!person) throw new ServerError('No person with that id exists at this moment.', { status: 404 })
        if (name) person.name = name
        if (image_blob) {
          if (!person.users.includes(req.params.username)) {
            person.users.push(req.params.username)
          }
          saveImage(person, image_blob, function (err) {
            if (err) res.handleServerError(err)
            else res.json(person)
          })
        } else if (image_path) {
          if (!person.users.includes(req.params.username)) {
            person.users.push(req.params.username)
          }
          person.image_path = image_path
          let saved_person = await person.save()
          res.json(saved_person)
        } else if (name) {
          let saved_person = await person.save()
          res.json(saved_person)
        } else {
          throw new ServerError('This should never happen.', { status: 400 })
        }
      } else {
        if (!name) {
          throw new ServerError('Please add an name for this person.', { status: 400 })
        } else if (!image_blob && !image_path) {
          throw new ServerError('Please add an image for ' + name, { status: 400 })
        }
        console.log("creating new person")
        person = new Person({ name: name })
        console.log("STILL GETTING HERE")
        if (!person.users.includes(req.params.username)) {
          person.users.push(req.params.username)
        }
        if (image_blob) {
          var saveImageErr = saveImage(person, image_blob, function (err) {
            if (err) res.handleServerError(err)
            else res.json(person)
          })
          if (saveImageErr) {
            console.log("there was an error " + saveImageErr)
            res.handleServerError(saveImageErr)
          }
        } else {
          person.image_path = image_path
          let saved_person = await person.save()
          res.json(saved_person)
        }
      }

    } catch (error) {
      console.log(error)
      res.handleServerError(error)
    }
  },
  async delete (req, res) {
    try {
      console.log("going to delete " + req.params.person_id + ", " + req.params.username)
      let person = await Person.findById(req.params.person_id)
      if (!person) throw new ServerError('No person with that id exists at this moment.', { status: 404 })
      var name = person.name
      var index = person.users.indexOf(req.params.username);
      if (index > -1) {
        person.users.splice(index, 1);
        if (person.users.length == 0) {
          let deleted = await Person.findOneAndRemove({ _id: req.params.person_id })
          if (!deleted) throw new ServerError(`${name} doesn't seem to exist. Try refreshing the page`, { status: 404 })
          res.json({ message: `Successfully deleted ${name}` })
        } else {
          await person.save()
          res.json({ message: `${name} is still avaliable to another user, but it has been removed for you` })
        }
      } else {
        throw new ServerError(`${name} not avaliable to user ${req.params.username}`, { status: 403 })
      }
    } catch (error) {
      console.log(error)
      res.handleServerError(error)
    }
  }
}

function saveImage(person, image_blob, callback) {
  makeDirectoryIfDoesNotExist('src/client/static/people')
  var time = new Date().getTime();
  console.log("created directories")
  fs.writeFile(`src/client/static/people/${person._id}_${time}.png`
    , image_blob, 'base64', function(err) {
    if(err) {
      console.log("err", err);
      return err
    } else {
      console.log("it was fine")
      person.image_path = `/people/${person._id}_${time}.png`
      let saved_person = person.save(callback)
    }
  });
}

//TODO: remove
function saveImageToFile(person, path, buf) {
  console.log("ok going to save image to file " + path +  " now")
  fs.writeFile(path, buf, async function(err) {
    if(err) {
      console.log("err", err);
      return false
    } else {
      console.log("it was fine")
      person.image_path = path
      let saved_person = await person.save()
      return true
    }
  });
}

function makeDirectoryIfDoesNotExist(dir) {
  console.log('checking directory ' + dir)
  if (!fs.existsSync(dir)){
    console.log('it doesn\'t exist yet')
    fs.mkdirSync(dir);
  }
}

export const upload_image = {
  async post (req, res) {
    try {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        console.log(JSON.stringify(files))
        var oldpath = files.file.path;
        var newpath = 'src/client/static/people/' + files.file.name;

        if(!oldpath.name || oldpath.name.match(/\.(jpg|jpeg|png)$/i)) {
          console.log("the file is an image");
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.log("done " + err)
            res.json({
              src: '/people/' + files.file.name,
              message: 'Successfully uploaded'
            })
          });
        }else{
          throw new ServerError("the file is not an image", { status: 400 })
          console.log("the file is not an image");
        }
      })
    } catch (error) {
      console.log(error)
      res.handleServerError(error)
    }
  }
}

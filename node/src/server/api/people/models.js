import fs from 'fs'
import mongoose from 'mongoose'
import { ServerError } from 'express-server-error'

const personSchema = new mongoose.Schema({
  image_path: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    require: true
  },
  users: [{
    type: String,
    ref: 'User'
  }]
}, {
  timestamps: true
})

const Person = mongoose.model('Person', personSchema)

/*personSchema.set('toJSON', {
  transform (doc, ret, options) {
    fs.readFile(ret.image_path, function(err, data) {
      if (err) {
        console.log(err)
        throw new ServerError('Can\'t find image.', { status: 404 })
      } else {
        var new_json = {
          name: ret.name,
          image: new Buffer(data).toString('base64')
        }
        //console.log("it was ok " + JSON.stringify(new_json))
        return new_json
      }
    });
  }
})*/

export default Person

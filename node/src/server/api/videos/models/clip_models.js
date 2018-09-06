import mongoose from 'mongoose'

const clipSchema = new mongoose.Schema({
  path: {
    type: String,
    unique: true
  },
  transcript: String,
  type: Number
}, {
  timestamps: true
})

const Clip = mongoose.model('Clip', clipSchema)

export default Clip

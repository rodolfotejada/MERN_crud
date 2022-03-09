const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //NOTE: this is how the connection to other schemas is done.
      require: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    }s
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Goal', goalSchema);

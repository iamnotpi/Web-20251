const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const pictureSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Product', 'User', 'Category', 'Review', 'Banner'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    alt: {
      type: String,
      default: '',
    },
    tags: [{ type: String }],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

pictureSchema.plugin(toJSON);
pictureSchema.plugin(paginate);

const Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;

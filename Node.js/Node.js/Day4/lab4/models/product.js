const mongoose = require('mongoose');

const productSchema = new mongoose.Schema( // product schema
  { // def of cols
    owner: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: 'User', // like join to connect btw product and user(collection)
      required: true
    },
    name: {
      type: String,
      unique: true, // no 2 products can have same name
      required: true,
      minlength: 5,
      maxlength: 20
    },
    quantity: {
      type: Number,
      required: true,
      default: 0 // if didn't say put with 0
    },
    categories: {
      type: [String], // arr of strings
      default: ['General'] // default val if didn't say
    }
  },
  { // options
    timestamps: true,
    toJSON: {virtuals: true} // show vir. fields in json (when doc is converted to json (controller) runt he vir. func )
  }
);

productSchema.virtual('status').get(function () { // calc. field from existing field
  if (this.quantity > 2) {
    return 'available';
  } else if (this.quantity > 0) {
    return 'low stock';
  } else {
    return 'out of stock';
  }
});

const Product = mongoose.model('Product', productSchema); // ref to schema (usable not just schema)

module.exports = Product;

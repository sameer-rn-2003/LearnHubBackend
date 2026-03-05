const { randomUUID } = require("crypto");
const { mongoose } = require("../config/db");

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID()
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    description: {
      type: String,
      default: null
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.virtual("id").get(function getId() {
  return this._id;
});

productSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

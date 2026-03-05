const { randomUUID } = require("crypto");
const { mongoose } = require("../config/db");

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID()
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 120
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

categorySchema.virtual("id").get(function getId() {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);

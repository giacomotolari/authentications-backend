import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const AddressSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    uniqe: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: AddressSchema,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const saltRound = await bcrypt.genSalt(10);
//if there is other save in the schema the password will update and one more time saved.
//fix this
UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRound);
  next();
});

UserSchema.methods.comparePassword = async (pass, userPass) => {
  return await bcrypt.compare(pass, userPass); // true or false
};

//hide field like password to have more security
UserSchema.methods.deleteField = function (field) {
  delete this[field];
  return this;
};

const User = model("User-2", UserSchema);

export default User;

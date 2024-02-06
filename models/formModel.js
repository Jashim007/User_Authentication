import { mongoose } from "mongoose";

const formSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const Form = mongoose.model("employee", formSchema);

export default Form;

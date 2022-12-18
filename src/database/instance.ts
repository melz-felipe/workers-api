import mongoose from "mongoose";

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_COLLECTION } =
  process.env;

const CONNECTION_STRING = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.vfykhzo.mongodb.net/${MONGODB_COLLECTION}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.Promise = global.Promise;
mongoose.connect(CONNECTION_STRING);

export default mongoose;

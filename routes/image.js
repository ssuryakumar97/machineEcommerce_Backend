// import mongoose from "mongoose";
const mongoose = require("mongoose")
const {upload} = require("../services/imageUpload.js")
// import { upload } from "../services/imageUpload.js";
const { verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

const connectDb = async() => {
    try {
        const Connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("Your app is connected to mongodb");
        return Connection
    } catch (error) {
        console.log(error);
    }
}

// const {ObjectId} = mongodb
router.post("/uploadImage", verifyTokenAndAdmin, upload.single("image"), (req,res) => {
    const file = req.file
    // console.log(file)
    res.send({
        message: "Uploaded",
        id: file.id,
        name: file.filename,
        contentType: file.contentType,
      });
} )

router.get("/download/:filename", async(req, res) => {
  try {
      // const Db = connectDb.connections[0].db;
      const mongoConfig = await connectDb();
      const Db = mongoConfig.connections[0].db
      // console.log(Db.connections[0].db)
      console.log("connected to mongodb");
  
      const imageBucket = new mongoose.mongo.GridFSBucket(Db, {
        bucketName:  "product_pictures"
      });
  
      let downloadStream = imageBucket.openDownloadStreamByName(
        req.params.filename
      );
  
      downloadStream.on("data", function (data) { //.on is an event emitter which was emitted by streams
        return res.status(200).write(data);       // data is the event which was emitted
      });
  
      downloadStream.on("error", function (data) {
        return res.status(404).send({ error: "Image not found" });
      });
  
      downloadStream.on("end", () => {
        return res.end();
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error Something went wrong",
        error,
      });
    }
} )

router.delete("/delete/:id", verifyTokenAndAdmin, async(req,res) => {
  try {
      const mongoConfig = await connectDb();
      const Db = mongoConfig.connections[0].db
      // console.log(Db.connections[0].db)
      console.log("connected to mongodb");    
      const imageBucket = new mongoose.mongo.GridFSBucket(Db, {
        bucketName: "product_pictures",
      });

      const obj_id = new mongoose.mongo.BSON.ObjectId(req.params.id);
      // console.log(obj_id)
      

      // const deletedData = await imageBucket.delete(obj_id)
      const deletedData = await imageBucket.delete(obj_id)

      return res.status(200).json({message: "Data deleted successfully"})
  } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error Something went wrong",
        error,
      });
  }
} )

module.exports = router


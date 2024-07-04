const multer = require("multer")
const {GridFsStorage} = require("multer-gridfs-storage")
const dotenv = require("dotenv")


dotenv.config()

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        // console.log("storage:",file)
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg"
          ) {
            return {
                bucketName: "product_pictures",
                filename: `${Date.now()}_${file.originalname}`
            }
          } else {
            //Otherwise save to default bucket. Default bucket is fs
            return `${Date.now()}_${file.originalname}`;
          }
    }
})

module.exports.upload = multer({storage})

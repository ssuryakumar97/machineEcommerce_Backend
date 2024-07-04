require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto")
const router = require("express").Router();

router.post("/createOrder", async (req,res) => {
    try{

        const razorpayInstance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_KEY
        })
        
        const { amount, currency, receipt } = req.body;
        
       razorpayInstance.orders.create({amount, currency, receipt}, (error, order) => {
            if(!error){
                res.json(order)
            } else {
                res.status(500).json(error)
            }
        })
    } catch(e) {
        console.log(e)
    }

})

router.post("/verifyPayment", (req, res) => {
    const {order_id, payment_id} = req.body;      
    const razorpay_signature =  req.headers['x-razorpay-signature']; 

    const key_secret = process.env.KEY_KEY
    let hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(order_id + "|" + payment_id);

    const generated_signature = hmac.digest('hex');
    if(razorpay_signature === generated_signature) {
        res.json({success: true, message: "Payment has been verified"})
    } else {
        res.json({success:false, message: "Payment verification failed"})
    }




})

module.exports = router;
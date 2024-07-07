const mongoose = require('mongoose');
const { type } = require('os');

const OrderSchema = new mongoose.Schema({
    userId:{
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    products:[
        {
            productId: {
                type: String
            },
            title:{
                type: String
            },
            categories: {
                type: [String]
            },
            img: {
                type: String
            }, 
            desc: {
                type: String
            },
            size: {
                type: [String]
            },
            quantity: {
                type: Number,
                default: 1,
            },
            pricePerQty:{
                type: Number
            },
            totalProductPrice:{
                type: Number,
            }            
        },
    ],
    amount: {type: Number, required: true},
    estimatedShipping: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    discountPercentage: {type: Number, default: 18},
    finalPrice: {type: Number, default: this.amount - (this.amount * this.discount / 100)},
    address: {type: Object, required: true},
    contactNo: {type: String, required: true},
    deliveryStatus: {type: String, default: "pending"},
    paymentStatus: {type: String, default: "pending"},
}, {timestamps: true});

module.exports = mongoose.model("Order", OrderSchema);
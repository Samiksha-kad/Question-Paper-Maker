import registerModel from '../models/RegisterSchema.js'
import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/ErrorHandler.js';
import bcrypt from 'bcrypt'
import sendData from '../middleware/SendData.js';
const jwtSecret = "asd889asds5656asdas887";
const saltRounds = 10


export const register = (async (req, res, next) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        registerModel.findOne({ email: req.body.email }, (err, data) => {
            if (err) {
                next(new ErrorHandler("Something went wrong in checking data", 500));
            }
            else if (data == null) {
                let ins = new registerModel({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, profile: req.file.filename })
                ins.save((e) => {
                    if (e) {
                        next(new ErrorHandler("Something went wrong in adding data", 500));
                    }
                    else {
                        next(new ErrorHandler("New User added", 200));
                    }
                })
            }
            else {
                next(new ErrorHandler("User already exist", 409));
            }
        })
    }
    catch (error) {
        next(new ErrorHandler("Something went wrong ", 500));

    }

})

export const login = ((req, res, next) => {
    try {
        registerModel.findOne({ email: req.body.email }, (err, data) => {
            if (err) {
                next(new ErrorHandler("Something went wrong in checking data", 500));
            }
            else if (data == null) {
                next(new ErrorHandler("Email does not Match", 401));
            }
            else {
                const hashbcrypt = bcrypt.compareSync(req.body.password, data.password)
                if (hashbcrypt) {
                    const token = encryptData(data);
                    sendData(token, 202, res)
                }
                else {
                    next(new ErrorHandler("Email or Password does not Match", 401));
                }
            }
        })
    }
    catch (error) {
        next(new ErrorHandler("Something went wrong", 500));
    }
})


const encryptData = (data) => {
    let pay = {
        ...data._doc
    }
    const token = jwt.sign(pay, jwtSecret, { expiresIn: 360000 })
    return token;
}
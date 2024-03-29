import express from 'express';
import data from '../../data.js';
import bcrypt from 'bcryptjs'
import User from '../userModel.js';
import expressAsyncHandler from 'express-async-handler'
import {generateToken, isAuth} from '../../utils.js';

const userRouter = express.Router();

userRouter.get('/seed', expressAsyncHandler(async(req, res) => {
        console.log('We got to this part of the application')
        // await User.remove({});    
        const createUsers = await User.insertMany(data.users);
        res.send({createUsers});
    })
)

//create signin router
userRouter.post(
    '/signin',
    expressAsyncHandler(async(req, res) => {
        //check the user email in the database
        const user = await User.findOne({email: req.body.email});
        //if we find this user, we continue with the password
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user),
                });
                return;
            }
        }
        res.status(401).send({message: 'Invalid email or password'})
    })
)

userRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password:bcrypt.hashSync(req.body.password, 8),
        });
        const createdUser = await user.save();
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser),
        })
    })
)
//route to return user info by id
userRouter.get(
    '/:id',
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({message: 'User Not Found'});
        }
    })
)
userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }
            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser),
            })
        }
    })
)
export default userRouter;
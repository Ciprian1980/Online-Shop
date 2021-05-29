import jwt from 'jsonwebtoken';

//helper function to generate data and return a token
export const generateToken = (user) => {
    //sign creates the token
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }, 
        process.env.JWT_SECRET || 'something secret', 
        {
            expiresIn: '30d',
        }
    );
}
//authenticate request
//if user doesn't send the authorisation token it will get an error
export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret',
        (err, decode) => {
            if (err) {
                res.status(401).send({message: 'Invalid Token'});
            } else {
                req.user = decode;
                next();
            }
        }
    );
    } else {
        res.status(401).send({message: 'No Token'});
    }
}
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({message: 'Invalid Admin Token'});
    }
}
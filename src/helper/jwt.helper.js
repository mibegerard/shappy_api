const jwt = require("jsonwebtoken")


/********************************************************************
 * @description              create a new access token
 * @param userInfo          User info to set for jwt token
 * @returns {*}             JWT Token with jsonwebtoken
 ********************************************************************/
exports.jwtSign = (userInfo) => {
    const secret = process.env.SECRET
    const expiresIn = process.env.ACCESS_TOKEN_TIME_TO_LIVE
    return jwt.sign(userInfo, secret, {expiresIn})
}

/********************************************************************
 * @description              create a new access token
 * @param userInfo          User info to set for jwt token
 * @returns {*}             JWT Token with jsonwebtoken
 ********************************************************************/
exports.createUrlToken = (data) => {
    const secret = process.env.SECRET
    const expiresIn = "24h"
    return jwt.sign(data, secret, {expiresIn})
}

/********************************************************************
 *@description          This function verify if the access is valid and not expired
 * @param token         Access Token from client side
 * @returns             {Promise<{valid: boolean, expired: boolean, verifiedToken: null}
 *                      |{valid: boolean, expired: boolean, verifiedToken: (*)}>}
 *******************************************************************/
exports.verifyJwt = async (token) => {
    try {
        const secret = process.env.SECRET
        const verifiedToken = await jwt.verify(token, secret)
        return {valid: true, expired: false, verifiedToken}
    } catch (error) {
        return {valid: false, expired: error.message === "jwt expired", verifiedToken: null}
    }
}
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const REDIRECT_URI = `${process.env.BACKEND_URL}/api/auth/callback`;

export const cfLogin = (req, res) => {
   

    const CF_CLIENT_ID = process.env.CF_CLIENT_ID;

    const authUrl =
      `https://codeforces.com/oauth/authorize?client_id=${CF_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=openid`;

   
    res.redirect(authUrl);
};

export const cfCallback = async (req, res) => {

  const { code } = req.query;
  if (!code) return res.status(400).send('Authorization failed.');
  const CF_CLIENT_ID = process.env.CF_CLIENT_ID;
  const CF_CLIENT_SECRET = process.env.CF_CLIENT_SECRET;

  try {
    const tokenRes = await axios.post('https://codeforces.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: CF_CLIENT_ID,
        client_secret: CF_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }
    });
    const idToken = tokenRes.data.id_token;
    const decodedProfile = jwt.decode(idToken);
    const handle = decodedProfile.handle;
    if (!handle) throw new Error("Could not extract handle from Codeforces");

    const cfProfile = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    const mxR = cfProfile.data.result[0].maxRating;

    let u = await User.findOne({ h: handle });
    if (!u) {
      u = new User({ h: handle, mxR });
      await u.save();
    } else {
      u.mxR = mxR;
      await u.save();
    }

    const jw = jwt.sign({ id: u._id, h: u.h, mxR: u.mxR }, process.env.JWT_SEC, { expiresIn: '7d' });

    res.cookie('token', jw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

  } catch (error) {
    console.error("OAuth Error:", error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
  }
};

export const logout=(req,res)=>{
  res.clearCookie('token'); 
  res.json({ message: "Logged out" });
}
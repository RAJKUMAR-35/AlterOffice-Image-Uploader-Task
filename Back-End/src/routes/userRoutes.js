import express from 'express';
import {   getExistingUserDetails, getUserDetails, updateUserAvatar, uploadAvatar } from '../controllers/userController';
import upload from '../middleware/upload';

const router = express.Router();

router.get('/checkUserId', getUserDetails);
router.post('/:id/avatar', upload, updateUserAvatar);
router.get("/:id",getExistingUserDetails);
router.post('/:id/uploadAvatar', upload, uploadAvatar);

export default router;

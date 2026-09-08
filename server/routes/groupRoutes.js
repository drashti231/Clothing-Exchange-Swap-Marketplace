const express = require('express');
const router = express.Router();
const {
  getGroups,
  getGroupById,
  createGroup,
  toggleMembership,
  createPost,
  getGroupPosts,
  togglePostLike,
  addComment
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGroups);
router.get('/:id', getGroupById);
router.get('/:id/posts', getGroupPosts);

// Protected routes
router.post('/', protect, createGroup);
router.put('/:id/membership', protect, toggleMembership);
router.post('/:id/posts', protect, createPost);
router.put('/posts/:postId/like', protect, togglePostLike);
router.post('/posts/:postId/comments', protect, addComment);

module.exports = router;

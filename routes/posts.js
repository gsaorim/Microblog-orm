const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const router = express.Router();

// Criar post
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;

    // Validações
    if (!content || content.trim() === '') {
      req.session.error = 'O post não pode estar vazio';
      return res.redirect('/');
    }

    if (content.length > 280) {
      req.session.error = 'O post não pode ter mais de 280 caracteres';
      return res.redirect('/');
    }

    // Criar post
    const post = new Post({
      content: content.trim(),
      user: req.session.user.id,
      likes: []
    });

    await post.save();
    req.session.success = 'Post criado com sucesso!';
    res.redirect('/');

  } catch (error) {
    console.error('Erro ao criar post:', error);
    req.session.error = 'Erro ao criar post';
    res.redirect('/');
  }
});

// Curtir/descurtir post
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      req.session.error = 'Post não encontrado';
      return res.redirect('/');
    }

    // Verificar se já curtiu
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Descurtir
      post.likes.pull(userId);
      req.session.success = 'Post descurtido';
    } else {
      // Curtir
      post.likes.push(userId);
      req.session.success = 'Post curtido!';
    }

    await post.save();
    res.redirect('/');

  } catch (error) {
    console.error('Erro ao curtir post:', error);
    req.session.error = 'Erro ao curtir post';
    res.redirect('/');
  }
});

// Comentar post
router.post('/:id/comment', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    // Validações
    if (!content || content.trim() === '') {
      req.session.error = 'O comentário não pode estar vazio';
      return res.redirect('/');
    }

    if (content.length > 280) {
      req.session.error = 'O comentário não pode ter mais de 280 caracteres';
      return res.redirect('/');
    }

    const post = await Post.findById(postId);
    if (!post) {
      req.session.error = 'Post não encontrado';
      return res.redirect('/');
    }

    // Criar comentário
    const comment = new Comment({
      content: content.trim(),
      user: req.session.user.id,
      post: postId
    });

    await comment.save();
    req.session.success = 'Comentário adicionado!';
    res.redirect('/');

  } catch (error) {
    console.error('Erro ao comentar:', error);
    req.session.error = 'Erro ao adicionar comentário';
    res.redirect('/');
  }
});

// Rota para deletar comentário 
router.post('/comment/:id/delete', requireAuth, async (req, res) => {
  try {
    const commentId = req.params.id;
    
    const comment = await Comment.findById(commentId).populate('user');
    
    if (!comment) {
      req.session.error = 'Comentário não encontrado';
      return res.redirect('/');
    }

    // Verificar se o usuário é o dono do comentário
    if (comment.user._id.toString() !== req.session.user.id) {
      req.session.error = 'Você não tem permissão para deletar este comentário';
      return res.redirect('/');
    }

    await Comment.findByIdAndDelete(commentId);
    req.session.success = 'Comentário deletado com sucesso!';
    res.redirect('/');

  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    req.session.error = 'Erro ao deletar comentário';
    res.redirect('/');
  }
});

module.exports = router;

const express = require('express');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Login - GET
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { email: '', error: '' });
});



// Login - POST
router.post('/login', redirectIfAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.render('login', { 
        error: 'Email e senha são obrigatórios',
        email 
      });
    }

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.render('login', { 
        error: 'Email ou senha incorretos',
        email 
      });
    }

    // Criar sessão
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    req.session.success = `Bem-vindo, ${user.username}!`;
    res.redirect('/');

  } catch (error) {
    console.error('Erro no login:', error);
    res.render('login', { 
      error: 'Erro no servidor. Tente novamente.' 
    });
  }
});

// Registro - GET
router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', { username: '', email: '', error: '' });
});

// Registro - POST
router.post('/register', redirectIfAuthenticated, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validações
    if (!username || !email || !password || !confirmPassword) {
      return res.render('register', { 
        error: 'Todos os campos são obrigatórios',
        username,
        email
      });
    }

    if (password !== confirmPassword) {
      return res.render('register', { 
        error: 'As senhas não coincidem',
        username,
        email
      });
    }

    if (password.length < 6) {
      return res.render('register', { 
        error: 'A senha deve ter pelo menos 6 caracteres',
        username,
        email
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.render('register', { 
        error: 'Email ou username já está em uso',
        username,
        email
      });
    }

    // Criar usuário
    const user = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    await user.save();

    req.session.success = 'Conta criada com sucesso! Faça login para continuar.';
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Erro no registro:', error);
    
    if (error.code === 11000) {
      return res.render('register', { 
        error: 'Email ou username já está em uso',
        username: req.body.username,
        email: req.body.email
      });
    }

    res.render('register', { 
      error: 'Erro ao criar conta. Tente novamente.',
      username: req.body.username,
      email: req.body.email
    });
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro no logout:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;

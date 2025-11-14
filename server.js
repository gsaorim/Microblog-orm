const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

// Importar modelos
const Post = require('./models/Post');
const User = require('./models/User');
const Comment = require('./models/Comment');

// Importar rotas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
mongoose.connect('mongodb://admin:admin123@localhost:27017/microblog?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log('Erro ao conectar MongoDB:', err));

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session
app.use(session({
  secret: 'microblog-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware para variáveis globais
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  
  delete req.session.success;
  delete req.session.error;
  next();
});

// Rotas
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Rota principal - Feed de posts
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // Convert to plain JavaScript objects

    // Buscar comentários para cada post
    for (let post of posts) {
      const comments = await Comment.find({ post: post._id })
        .populate('user', 'username')
        .sort({ createdAt: 1 })
        .limit(10)
        .lean();
      
      post.comments = comments;
      post.commentCount = comments.length;
    }
    
    res.render('index', { posts });
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    res.render('index', { posts: [], error: 'Erro ao carregar posts' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

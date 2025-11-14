// Middleware para verificar se usuário está autenticado
function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Você precisa fazer login para acessar esta página';
    return res.redirect('/auth/login');
  }
  next();
}

// Middleware para redirecionar usuários autenticados
function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};

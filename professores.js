require('dotenv').config();
const db = require('./db');

class Professor {
  constructor(id, nome, materia, email) {
    this.id = id;
    this.nome = nome;
    this.materia = materia;
    this.email = email;
  }

  static async getAll() {
    return db.many('SELECT * FROM professores');
  }

  static async create(nome, materia, email) {
    return db.one('INSERT INTO professores (nome, materia, email) VALUES ($1, $2, $3) RETURNING *', [nome, materia, email])
      .then(data => new Professor(data.id, data.nome, data.materia, data.email));
  }

  static async getById(id) {
    return db.one('SELECT * FROM professores WHERE id = $1', id)
      .then(data => new Professor(data.id, data.nome, data.materia, data.email));
  }

  static async update(id, nome, materia, email) {
    return db.one('UPDATE professores SET nome = $1, materia = $2, email = $3 WHERE id = $4 RETURNING *', [nome, materia, email, id])
      .then(data => new Professor(data.id, data.nome, data.materia, data.email));
  }

  static async delete(id) {
    return db.none('DELETE FROM professores WHERE id = $1', id);
  }
}

module.exports = Professor;

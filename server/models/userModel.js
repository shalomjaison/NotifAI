const pool = require('../db/db'); // Import the pool from db.js

class User {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

const createUser = async (username, email) => {
    const query = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
    const values = [username, email];
    try {
        const result = await pool.query(query, values);
        return new User(result.rows[0].id, result.rows[0].username, result.rows[0].email);
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows.map(row => new User(row.id, row.username, row.email));
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return new User(result.rows[0].id, result.rows[0].username, result.rows[0].email);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
};
// Export the functions as an object.
module.exports = {
    createUser,
    getAllUsers,
    getUserById
};
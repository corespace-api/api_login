const JWT = require('jsonwebtoken');

class tokenGenerator {
    constructor(id) {
      this.id = id;
      this.expiresAt = null;
      this.token = {};
    }

    /**
     * Generate a user token
     * @param {string} id - The unique identifier for the user
     * token expires in 1 hour as per default
     */
    userToken() {
      const token = JWT.sign({ id: this.id }, `${this.id}_secret`, { expiresIn: '1h' });
      this.token = token;

      // create a string with the date and time the token will expire (1 hour)
      const date = new Date();
      date.setHours(date.getHours() + 1);
      this.expiresAt = date;
    }

    /**
     * Generate a application token
     * @param {string} id - The unique identifier for the application
     * token expires in 1 hour as per default
     */
    applicationToken() {
      const token = JWT.sign({ id: this.id }, `${this.id}_secret`, { expiresIn: '1h' });
      this.token = token;

      // create a string with the date and time the token will expire (1 hour)
      const date = new Date();
      date.setHours(date.getHours() + 1);
      this.expiresAt = date;
    }

    /**
     * Set the tokens identifier
     * @param {String} id - The unique identifier for the user 
     */
    set(id) {
      this.id = id;
    }

    /**
     * Get the tokens identifier
     * @returns {String} - The unique identifier for the user
     */
    get() {
      return {
        id: this.id,
        token: this.token,
        expiresAt: this.expiresIn,
      };
    }
}

/**
 * Generate a Identifier either for a user or an application
 * @application - Generate an identifier for an application
 * @user - Generate an identifier for a user
 * @returns {string} - The generated identifier
 */
class IdentGen {
  constructor(origin) {
    this.origin = origin;
    this.identifier = '';
  }

  application() {
    this.identifier = `${this.origin}_token_${Math.floor(Math.random() * 1000000)}`;
  }

  user() {
    this.identifier = `${this.origin}_token_${Math.floor(Math.random() * 1000000)}`;
  }

  get() {
    return this.identifier;
  }
}

module.exports.tokenGenerator = tokenGenerator;
module.exports.IdentGen = IdentGen;
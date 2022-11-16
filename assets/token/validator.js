const JWT = require('jsonwebtoken');

/**
 * Validating a given token
 * @param {string} token - The token to validate
 * @set {string} id - The unique identifier for the user
 * @get {boolean} - result of the validation
 */
class TokenVerifier {
  constructor(token) {
    this.token = token;
    this.id = '';
    this.verified = false;
  }

  setId(id) {
    this.id = id;
  }

  validate() {
    try {
      const decoded = JWT.verify(this.token, `${this.id}_secret`);
      this.verified = true;
    } catch (err) {
      this.verified = false;
    }
  }

  get() {
    return this.verified;
  }

}

module.exports.TokenVerifier = TokenVerifier;
function isEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}
function isPhone(phone) {
  if (!phone) return false;
  const regex = /^[0-9]{10}$/;  
  return regex.test(phone.trim());
}
function isStrongPassword(password) {
  if (!password) return false;
  return password.trim().length >= 6;
}
function isEmpty(value) {
  return !value || value.trim().length === 0;
}
function validateRegister({ name, email, password }) {
  const errors = {};
  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!email || !isEmail(email)) {
    errors.email = "Invalid email format";
  }
  if (!password || !isStrongPassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
function validateLogin({ email, password }) {
  const errors = {};
  if (!email || !isEmail(email)) {
    errors.email = "Invalid email format";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
function validateProject({ title, description, email, phone }) {
  const errors = {};
  if (isEmpty(title)) {
    errors.title = "Title is required";
  }
  if (isEmpty(description)) {
    errors.description = "Description is required";
  }
  if (!email || !isEmail(email)) {
    errors.email = "Invalid email format";
  }
  if (!phone || !isPhone(phone)) {
    errors.phone = "Phone must be 10 digits";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
module.exports = {
  isEmail,
  isPhone,
  isStrongPassword,
  isEmpty,
  validateRegister,
  validateLogin,
  validateProject
};

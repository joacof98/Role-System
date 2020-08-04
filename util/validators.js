module.exports.validateLogin = (username, password) => {
  let errors = {};
  if (!username || !password) {
    errors.fields = "Faltan campos para la solicitud.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

module.exports.validateRegister = (
  username,
  first_name,
  last_name,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  if (!username || !first_name || !last_name || !password || !confirmPassword || !email) {
    errors.fields = "Faltan campos para la solicitud.";
  }

  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if (!email.match(regEx)) {
    errors.email = "El email debe tener formato correcto";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

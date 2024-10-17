class ValidationsConsts {
  static REQUIRED = 'Campo requerido';
  static MIN_8_CHARACTERS = 'Mínimo 8 caracteres';
  static MIN_6_CHARACTERS = 'Mínimo 6 caracteres';
  static USER_GENDER = 'Solo está permitido hombre o mujer';
  static EMAIL_FORMAT = 'Formato de correo electrónico no válido';
  static PASSWORD_CONFIRMAION = 'Las contraseñas no coinciden';
  static VALID_PHONE_NUMBER = 'Número de teléfono no válido';
  static VALID_AGE = 'Debes tener por lo meno 18 años';

  static validateImageFile(file: File): boolean {
    const validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
    return validExtensions.includes(file.type);
  };
}

export default ValidationsConsts;

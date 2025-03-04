const { body } = require("express-validator");

const createUserValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nom trop court ou trop long (min 2, max 100)"),

  body("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("L'email n'est pas valide"),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),

  body("sexe")
    .optional()
    .isIn(["HOMME", "FEMME"])
    .withMessage("Le sexe doit être soit 'HOMME' soit 'FEMME'"),

  body("phone")
    .notEmpty()
    .withMessage("Le téléphone est requis")
    .isMobilePhone()
    .withMessage("Le numéro de téléphone n'est pas valide"),

  body("role")
    .notEmpty()
    .withMessage("Le rôle est requis")
    .isIn(["CLIENT", "ADMIN"])
    .withMessage("Le rôle doit être soit 'CLIENT' soit 'ADMIN'")
];

const updateUserValidationRules = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nom trop court ou trop long (min 2, max 100)"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("L'email n'est pas valide"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),

  body("sexe")
    .optional()
    .isIn(["HOMME", "FEMME"])
    .withMessage("Le sexe doit être soit 'HOMME' soit 'FEMME'"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Le numéro de téléphone n'est pas valide"),

  body("role")
    .optional()
    .isIn(["CLIENT", "ADMIN"])
    .withMessage("Le rôle doit être soit 'CLIENT' soit 'ADMIN'")
];

module.exports = { createUserValidationRules, updateUserValidationRules };

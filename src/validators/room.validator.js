const { body } = require("express-validator");

const createRoomValidationRules = [
  body("label")
    .notEmpty()
    .withMessage("Le label est requis"),
    
  body("label")
    .isLength({ min: 3, max: 200 })
    .withMessage("Chaine trop longue ou trop courte (min 2, max 200)"),
    
  body("description")
    .notEmpty()
    .withMessage("La description est requis"),
  body("description")
      .isLength({ min: 5, max: 255 })
      .withMessage("Chaine trop longue ou trop courte (min 5, max 255)"),
    
    
  body("tarif").notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("Le prix (tarif) doit être un nombre positif"),
  
  body("category")
  .notEmpty()
  .withMessage("La catégorie est requise"),

  body("category")
  .isLength({ min: 3, max: 255 })
  .withMessage("La catégorie est trop longue ou trop courte"),

  body("visit_url")
    .optional()  
    .isURL()
    .withMessage("Le format de url n'est pas valide")

];

const updateRoomValidationRules = [
    
  body("label")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("Chaine trop longue ou trop courte (min 2, max 200)"),
    

  body("description")
      .optional()
      .isLength({ min: 5, max: 255 })
      .withMessage("Chaine trop longue ou trop courte (min 5, max 255)"),
    
    
  body("tarif")
    .optional()
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("Le prix (tarif) doit être un nombre positif"),
  
  body("category")
    .optional()
    .notEmpty()
    .isLength({ min: 5, max: 255 })
    .withMessage("La catégorie est requise"),

  body("visit_url")
    .optional()  
    .isURL()
    .withMessage("Le format de url n'est pas valide")

    
  ];

  

module.exports = { createRoomValidationRules, updateRoomValidationRules };

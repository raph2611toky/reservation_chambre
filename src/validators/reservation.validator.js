const { body,param } = require("express-validator");
const roomServices = require("../services/database/room.services");
const reservationServices = require("../services/database/reservation.services");
const { StatutReservation } = require("@prisma/client");

const reservationRule= [
    body("date_debut")
    .isISO8601({strict: true})
    .withMessage("La date début doit être en format datetime iso 8601 YYYY-MM-DDTHH:mm:ssZ")
    .custom((value)=>{
        const date= new Date(value);
        if(isNaN(date.getTime())){
            throw new Error("Date Invalide")
        }
        if(date <= new Date()){
            throw new Error("Le champ date_debut doit être après maintenant (à venir)")
        }
        return true;
    }),

    body("date_fin")
    .isISO8601({strict: true})
    .withMessage("La date fin doit être en format datetime iso 8601 YYYY-MM-DDTHH:mm:ssZ")
    .custom((value, {req})=>{
        const date= new Date(value);
        const date_debut= new Date(req.body.date_debut);
        if(isNaN(date.getTime())){
            throw new Error("Date Invalide")
        }
        if(date <= date_debut){
            throw new Error("Le champ date_fin doit être après la date debut (à venir)")
        }
        return true;
    }),


    body("room_id")
    .custom(async (value,{req})=>{
        isFree = await roomServices.isAvailable(parseInt(value),req.body.date_debut,req.body.date_fin);
        
        if(!isFree){
            throw new Error("La chambre est déjà occupé à ce moment là ! ")
        }
        return true
    })


]

const roomExist= [
    body("room_id")
    .notEmpty()
    .withMessage("Champs room_id est requis")
    .custom(async (value)=>{
        const room = await roomServices.getRoomById(parseInt(value))
        
        if(room===null){
            throw new Error("La chambre n'existe pas")
        }
        return true
    })
]

const myReservationRule = [
    body("room_id")
    .custom(async (value,{req})=>{
        
        const reservation = await reservationServices.getById(parseInt(req.params.id))
        if(!reservation){
            throw new Error("Cette reservation non trouvé");
        }
        
        if(reservation.user_id!= req.user.id){
            throw new Error("Cette reservation n'est pas le votre !");
        }
        return true
    })  
]

const reservationAttente = [
    param("id")
    .custom(async (value)=>{
        const reservation = await reservationServices.getById(parseInt(value))
        if(!reservation){
            throw new Error("Cette reservation non trouvé");
        }
        
        if(reservation.status !== StatutReservation.ATTENTE){
            throw new Error("Seul reservation en attent peut être modifier !");
        }
        return true
    })
]

const roomAvailable = [
    body("room_id")
    .custom((value,{req})=>{
        const isAvailable = roomServices.isAvailable(parseInt(value))
        if(!isAvailable){
            return false
        }
        return true
    })
    .withMessage("Le chambre n'est pas disponible dans cette intervalle de temps !")
]

module.exports = {
    reservationRule, myReservationRule, reservationAttente, 
    roomExist, roomAvailable
}
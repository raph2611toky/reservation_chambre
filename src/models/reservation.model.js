
class Reservation {
    constructor(id, user_id, user, room_id, room, date_debut, date_fin, status, created_at =null, updated_at=null) {
      this.id = id;
      this.user_id = user_id;
      this.user = user;
      this.room_id = room_id;
      this.room = room;
      this.status= status;
      this.date_debut= date_debut; 
      this.date_fin = date_fin;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  
  }

  
  module.exports = Reservation;
  
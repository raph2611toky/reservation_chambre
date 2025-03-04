class Room {
    constructor(id, label, description,tarif, category, visite_url=null,created_at =null, updated_at=null) {
      this.id = id;
      this.label = label;
      this.description = description;
      this.tarif= tarif; 
      this.category = category;
      this.visite_url = visite_url;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  
  }

  
  module.exports = Room;
  
const { Zettel } =  require("./zettel")


// helper
function getRand() {
    const randomScale = 10000;
    return Math.floor(Math.random()*randomScale);
}

// helper
function getNewZettelId() {
    return Date.now().toString() + getRand().toString();
}
    

function ZettelKasten () {


    let zettels = [];

    this.addZettel = function(zettel) {
        zettels.push(zettel);
    }

    this.getNewZettelId = function() {
        return getNewZettelId();
    }

    // this.zettelFromJson = function(id, text, username) {
    //     let zet = new Zettel(id, text, username);
    //     return zet;
    // }

    this.getZettelById = function (id) {
        for (let i = 0; i < zettels.length; i++) {
            if (zettels[i].id == id) {
                return zettels[i]
            }
        }
    }


    this.getLinkedZettels = function(zettel) {

    }


    // this.fromJsonList = function(zettelObjects) {
    //     for (let obj of zettelObjects) {
    //         zettels.push(new Zettel(obj.id, obj.text, obj.user));
    //     }
    // }

    this.getIds = function () {
        let ids = [];
        for (let zet of zettels) {
            ids.push(zet.id);
        }
        return ids;
    }
}

exports.ZettelKasten = ZettelKasten;
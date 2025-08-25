const express = require('express');
const router = express.Router();
//Controllers
const {
    listRealestate,
    readRealestate,
    createRealestate,
    updateRealestate,
    deleteRealestate,

    actionFavorite,
    listFavorites,
    filterRealestate,
} = require('../controllers/realestate')

const { authCheck } = require('../middlewares/auth')

// @ENDPOINT http://localhost:5000/api/realestate
// @METHOD GET [ list realestate ]
// @ACCESS Public
router.get("/realestates/:id", listRealestate);

// @ENDPOINT http://localhost:5000/api/realestate/5
// @METHOD GET [ read realestate ]
// @ACCESS Public
router.get("/realestate/:id", readRealestate);

// @ENDPOINT http://localhost:5000/api/realestate
// @METHOD POST [ create realestate ]
// @ACCESS Private
router.post("/realestate", authCheck, createRealestate);

// @ENDPOINT http://localhost:5000/api/realestate/5
// @METHOD PUT [ edit realestate ]
// @ACCESS Private
router.put("/realestate/:id", updateRealestate);

// @ENDPOINT http://localhost:5000/api/realestate/5
// @METHOD DELETE [ delete realestate ]
// @ACCESS Private
router.delete("/realestate/:id", deleteRealestate);




// Favorite Route
router.post('/favorite', authCheck, actionFavorite);
router.get('/favorites', authCheck, listFavorites);

//Filter
router.get('/filter-realestate', filterRealestate);



module.exports = router
const router = require('express').Router();
const { Listing } = require('../../models');
const withAuth = require('../../utils/auth');


const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, path.resolve(__dirname, '..', '..', 'public', 'uploads'));    
  }, 
  filename: function (req, file, cb) { 
     cb(null, `Uploads_${file.originalname}`);   
  }
});

const upload = multer({ 
  storage,
  limits : {fileSize : 5000000},
});

router.post('/', withAuth, async (req, res) => {
  try {
    const newListing = await Listing.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newListing);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/uploads', withAuth, upload.single('uploaded_file'), async (req, res) => {
  try {
    const newListing = await Listing.create({
      ...req.body,
      cover_art: `/uploads/${req.file.filename}`,
      user_id: req.session.user_id,
    });

    res.status(200).json(newListing);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const listingData = await Listing.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!listingData) {
      res.status(404).json({ message: 'No listing found with this ID!' });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

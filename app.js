const { json } = require('express')
const express = require('express')
const multer = require('multer')
const path = require('path')
const app = express()
const fs =  require('fs')


app.use(json())

app.use(express.static('public'))

// Define the upload directory
const UPLOAD_DIR = 'uploads'

// Define the storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        
      callback(null, UPLOAD_DIR)
    },
    filename: (req, file, callback) => {
      const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      callback(null, filename)
    }
  })
  
  // Create an instance of the multer middleware
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10 // 10 MB
    },
    fileFilter: (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true)
      } else {
        callback(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'))
      }
    }
  })
  
  // Define the route handler for uploading files
  app.post('/upload', upload.single('file'), (req, res) => {
    try {
      // Get the file from the request body
      const file = req.file
  
      // Construct the URL of the uploaded file
      const fileUrl = `${process.env.VERCEL_URL}/${UPLOAD_DIR}/${file.filename}`
  
      // Return the URL of the uploaded file
      res.status(200).json({ url: fileUrl, file :  file })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error uploading file' })
    }
  })
  
  // Start the server
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`)
  })


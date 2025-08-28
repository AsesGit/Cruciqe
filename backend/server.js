require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://opwziwctjceszbuukscu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Generate ID card design
function generateIDCard(studentData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [158, 252] }); // Credit card size
      const filename = `id_card_${studentData.matricNumber}.pdf`;
      const filepath = path.join('uploads', filename);
      
      doc.pipe(fs.createWriteStream(filepath));
      
      // Card background and border
      doc.rect(5, 5, 148, 242).stroke('#0066cc');
      doc.rect(8, 8, 142, 236).stroke('#0066cc');
      
      // Header
      doc.image('logo.png', 5, 10, { width: 5, height: 5 }); // Add your logo image in the backend folder
      doc.fontSize(12).font('Helvetica-Bold')
          .text('STUDENT ID CARD', 10, 15, { align: 'center', width: 138 });
      
      // School/faculty name
      doc.fontSize(10).font('Helvetica')
          .text(studentData.faculty || 'University Name', 10, 32, { align: 'center', width: 138 });
      
      // Student photo placeholder (you can enhance this to handle actual photos)
      doc.rect(15, 50, 50, 65).stroke();
      doc.fontSize(7).text('PHOTO', 32, 78, { align: 'center' });
      
      // Student details
      doc.fontSize(8).font('Helvetica-Bold');
      doc.text('Name:', 15, 125);
      doc.text('Reg Number:', 15, 140);
      doc.text('Department:', 15, 155);
      
      doc.font('Helvetica');
      doc.text(studentData.fullName, 15, 135);
      doc.text(studentData.matricNumber, 65, 140);
      doc.text(studentData.department, 70, 155);
      
      // Footer
      doc.fontSize(6).font('Helvetica-Oblique')
        .text('Valid for Academic Session Only', 20, 185, { align: 'center', width: 310 });
      
      doc.end();
      
      doc.on('end', () => {
        resolve(filename);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

//register student
app.post('/api/register-student', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      department,
      level,
      session,
      matricNumber,
      faculty
    } = req.body;
    
    // Validate required fields
    if (!fullName || !matricNumber || !department || !level || !session) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Generate unique student ID
    //const matricNumber = `STD${Date.now()}`;
    
    // Save to Supabase database
    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone_number: phoneNumber,
          department: department,
          level: level,
          session: session,
          matric_number: matricNumber,
          faculty: faculty,
          created_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    // Generate ID card
    const cardFilename = await generateIDCard({
      matricNumber: data[0].matric_number,
      fullName,
      department,
      level,
      session,
      faculty
    });
    
    // Update database with card filename
    await supabase
      .from('students')
      .update({ id_card_file: cardFilename })
      .eq('matric_number', data[0].matric_number);
    
    res.json({
      success: true,
      message: 'Student registered successfully',
      data: {
        matricNumber: matricNumber,
        cardDownloadUrl: `/uploads/${cardFilename}`,
        student: data[0]
      }
    });
      
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

//Get all students
app.get('/api/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch students'
      });
    }
    
    res.json({
      success: true,
      data: data,
      message: 'Students fetched successfully'
    });
    
} catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
}
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`student check: http://localhost:${PORT}/api/students`);
    console.log("welcome to API")
    console.log("hello world")
});


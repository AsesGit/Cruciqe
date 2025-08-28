const form = document.getElementById('student-details')
const studentName = document.getElementById('fullname')
const regNumber = document.getElementById('regnumber')
const email = document.getElementById('email')
const phoneNumber = document.getElementById('phone-number')
const department = document.getElementById('department')
const faculty = document.getElementById('faculty')
const level = document.getElementById('level')
const session = document.getElementById('session')

form.addEventListener('submit', (e) => {
    // Submit form data to backend
    e.preventDefault(); // Prevent default form submission
    
    const formData = {
      fullName: studentName.value,
      matricNumber: regNumber.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      department: department.value,
      faculty: faculty.value,
      level: level.value,
      session: session.value
    };
    
    fetch('http://localhost:3000/api/register-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    
})

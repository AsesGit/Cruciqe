const form = document.getElementById('student-details')
const studentName = document.getElementById('fullname')
const regNumber = document.getElementById('regnumber')
const department = document.getElementById('department')
const studentPhoto = document.getElementById('student-photo')
const username = document.getElementById('username')
const password = document.getElementById('password')
const email = document.getElementById('email')
const phoneNumber = document.getElementById('phone-number')
const faculty = document.getElementById('faculty')
const level = document.getElementById('level')
const session = document.getElementById('session')

const displayError = document.getElementById('error-messages')

const previewImage = document.getElementById('preview-image')

const dragAndDrop = document.getElementById('drag-and-drop')

const changePhoto = document.getElementById('change-photo')

form.addEventListener('submit', (e) => {
  let errors = [];
  
  if(department){
    errors = getIdErrors(studentName.value, regNumber.value, department.value, studentPhoto.value)
  } else if (password) {
    error = getLoginError(username.value, password.value)
  } else if (level) {
    error = getRegistrationError(studentName.value, regNumber.value, department.value, studentPhoto.value, email.value, phoneNumber.value, faculty.value, level.value, session.value)
  }
  
  if(errors.length > 0){
    e.preventDefault()
    displayError.innerText = errors.join('. ')
  } 
  
})

function getIdErrors(student, reg, dept, picture) {
  
  let errors = [];
  
  if(student === '' || student === null){
    errors.push('Pls enter your full name ')
    studentName.classList.toggle('border-red-500')
    studentName.classList.add('dark:border-red-400')
  }
  
  if(reg.length < 10 || reg.length > 15){
    errors.push('Pls enter a valid registration number')
    regNumber.classList.add('border-red-500')
    regNumber.classList.add('dark:border-red-400')
  } 
  
  if(dept === '' || dept === null) {
    errors.push('Your department is required')
    department.classList.add('border-red-500')
    department.classList.add('dark:border-red-400')
  }
  
  if(picture === '' || picture === null){
    errors.push('No photo uploaded')
    dragAndDrop.classList.add('border-red-500')
    dragAndDrop.classList.add('dark:border-red-400')
  }
  
  return errors
}

function getLoginError(user, password) {
  
}

function getRegistrationError(student, reg, dept, email, phoneNumber, faculty, level, session){

  let errors = getIdErrors(student, reg, dept);

  if(email.value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email.value)){
      errors.push('Pls enter a valid email address')
      email.classList.add('border-red-500')
      email.classList.add('dark:border-red-400')
    }
  }
  
  if(phoneNumber.value) {
    const phonePattern = /^\+?[0-9]{7,15}$/; // Simple pattern for phone numbers
    if(!phonePattern.test(phoneNumber.value)){
      errors.push('Pls enter a valid phone number')
      phoneNumber.classList.add('border-red-500')
      phoneNumber.classList.add('dark:border-red-400')
    }
  }
  
  if(faculty.value === '' || faculty.value === null) {
    errors.push('Your faculty is required')
    faculty.classList.add('border-red-500')
    faculty.classList.add('dark:border-red-400')
  }
  
  if(level.value === '' || level.value === null) {
    errors.push('Your level is required')
    level.classList.add('border-red-500')
    level.classList.add('dark:border-red-400')
  }
  
  if(session.value === '' || session.value === null) {
    errors.push('Your session is required')
    session.classList.add('border-red-500')
    session.classList.add('dark:border-red-400')
  }

  return errors;
}

studentPhoto.addEventListener('change', () => {
  dragAndDrop.classList.add('hidden')
  changePhoto.classList.remove('hidden')
  previewImage.classList.remove('hidden')
  previewImage.src = URL.createObjectURL(studentPhoto.files[0])
})

const allInputs = [studentName, regNumber, department, studentPhoto]

allInputs.forEach((input) => {
  input.addEventListener('input',() => {
    if(input.classList.contains('border-red-500')){
      displayError.innerText = ''
    }
  })
})

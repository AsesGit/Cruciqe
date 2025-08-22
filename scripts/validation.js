const form = document.getElementById('student-details')
const studentName = document.getElementById('fullname')
const regNumber = document.getElementById('regnumber')
const department = document.getElementById('department')
const studentPhoto = document.getElementById('student-photo')
const username = document.getElementById('username')
const password = document.getElementById('password')

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
    studentName.classList.add('dark:border-red-500')
  }
  
  if(reg.length < 10 || reg.length > 15){
    errors.push('Pls enter a valid registration number')
    regNumber.classList.add('border-red-500')
    regNumber.classList.add('dark:border-red-500')
  } 
  
  if(dept === '' || dept === null) {
    errors.push('Your department is required')
    department.classList.add('border-red-500')
    department.classList.add('dark:border-red-500')
  }
  
  if(picture === '' || picture === null){
    errors.push('No photo uploaded')
    dragAndDrop.classList.add('border-red-500')
    dragAndDrop.classList.add('dark:border-red-500')
  }
  
  return errors
}

function getLoginError(user, password) {
  
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

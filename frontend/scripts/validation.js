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

form.addEventListener('submit', async (e) => {
  let errors = [];
  let studentData = {};
  
  if(department){
    errors = getIdErrors(studentName.value, regNumber.value, department.value, studentPhoto.value)
    studentData = {
      name: studentName.value,
      id: regNumber.value,
      dept: department.value,
      pic: studentPhoto.value
    }
  } else if (password) {
    error = getLoginError(username.value, password.value)
    studentData = {
      name: username.value,
      id: password.value
    }
  }
  
  if(errors.length > 0){
    e.preventDefault()
    displayError.innerText = errors.join('. ')
  } else {

    try {
        // Send POST request with Axios
      const response = await axios.post(
        'http://localhost:3000/api/register-student',
        formData, {
        headers: {
          'Content-Type': 'application/json' // Ensure JSON format
        }
      });

      console.log('Response from backend:', response.data);
      responseDiv.innerHTML = `<p>${response.data.message}</p><p>Echoed data: ${JSON.stringify(response.data.data)}</p>`;
    }catch(errors){
      console.log("failed");
      console.error('Error sending data:', error);
      responseDiv.innerHTML = `<p>Error: ${error.response?.data?.message || error.message}</p>`;
    }

    /*if(department){
      Swal.fire({
        title: "Success!",
        text: "You successfull generated a student ID!",
        icon: "success"
      });
    } else if(password){
      Swal.fire({
        title: "Welcome!",
        text: "Login successful",
        icon: "success"
      });
    }*/
  }

    //submitData()
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

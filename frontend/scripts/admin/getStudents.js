// Fetch all students for admin panel
export async function loadStudentList() {
  try {
    const response = await fetch('/api/students');
    const result = await response.json();
    
    if (result.success) {
        console.log(`Found ${result.data.length} students`);
        
        // Display in table
        result.data.forEach(student => {
            console.log(`${student.full_name} (${student.matric_number})`);
        });
    } else {
        console.error('Failed to load students:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}


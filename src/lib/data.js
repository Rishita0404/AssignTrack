export const INITIAL_USERS = [
  { id: 'teacher-1', name: 'Dr. Sarah Mitchell', email: 'teacher@demo.com', password: 'demo123', role: 'teacher' },
  { id: 'teacher-2', name: 'Prof. James Carter', email: 'james@demo.com', password: 'demo123', role: 'teacher' },
  { id: 'student-1', name: 'Alex Johnson', email: 'student@demo.com', password: 'demo123', role: 'student' },
  { id: 'student-2', name: 'Maria Garcia', email: 'maria@demo.com', password: 'demo123', role: 'student' },
];

export const INITIAL_COURSES = [
  { id: 'course-1', name: 'Introduction to Computer Science', code: 'CS101', teacherId: 'teacher-1', teacherName: 'Dr. Sarah Mitchell', description: 'Fundamentals of programming and computational thinking.', enrolledStudents: ['student-1', 'student-2'], color: 'blue', createdAt: '2024-01-15' },
  { id: 'course-2', name: 'Data Structures & Algorithms', code: 'CS201', teacherId: 'teacher-1', teacherName: 'Dr. Sarah Mitchell', description: 'Advanced data structures and algorithm design.', enrolledStudents: ['student-1'], color: 'purple', createdAt: '2024-01-15' },
  { id: 'course-3', name: 'Calculus I', code: 'MATH101', teacherId: 'teacher-2', teacherName: 'Prof. James Carter', description: 'Differential and integral calculus.', enrolledStudents: ['student-1', 'student-2'], color: 'green', createdAt: '2024-01-15' },
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asgn-1', courseId: 'course-1', courseName: 'Introduction to Computer Science', teacherId: 'teacher-1',
    title: 'Hello World Program', description: 'Write your first program that prints "Hello, World!" in Python.',
    instructions: 'Create a Python file that prints the message. Include comments explaining each line. Submit as a .py file zipped with a brief README.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), createdAt: '2024-06-01', status: 'active',
    attachments: [{ id: 'att-1', name: 'assignment_guide.pdf', size: '245 KB', type: 'pdf' }],
    totalSubmissions: 1, pendingReviews: 1,
  },
  {
    id: 'asgn-2', courseId: 'course-1', courseName: 'Introduction to Computer Science', teacherId: 'teacher-1',
    title: 'Variables & Data Types', description: 'Explore Python variables, data types, and basic operations.',
    instructions: 'Complete the exercises in the provided worksheet. Show all your work and add inline comments.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), createdAt: '2024-06-05', status: 'active',
    attachments: [{ id: 'att-2', name: 'worksheet.docx', size: '120 KB', type: 'docx' }],
    totalSubmissions: 0, pendingReviews: 0,
  },
  {
    id: 'asgn-3', courseId: 'course-2', courseName: 'Data Structures & Algorithms', teacherId: 'teacher-1',
    title: 'Linked List Implementation', description: 'Implement a doubly linked list with all standard operations.',
    instructions: 'Implement insert, delete, search, and display operations. Include time complexity analysis in comments.',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), createdAt: '2024-06-08', status: 'active',
    attachments: [], totalSubmissions: 0, pendingReviews: 0,
  },
  {
    id: 'asgn-4', courseId: 'course-3', courseName: 'Calculus I', teacherId: 'teacher-2',
    title: 'Derivatives Problem Set', description: 'Solve 20 derivative problems using differentiation rules.',
    instructions: 'Show all steps. Use proper mathematical notation. Submit as scanned PDF.',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: '2024-05-20', status: 'closed',
    attachments: [{ id: 'att-3', name: 'problem_set.pdf', size: '380 KB', type: 'pdf' }],
    totalSubmissions: 2, pendingReviews: 0,
  },
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-1', assignmentId: 'asgn-1', assignmentTitle: 'Hello World Program',
    courseId: 'course-1', courseName: 'Introduction to Computer Science',
    studentId: 'student-1', studentName: 'Alex Johnson', studentEmail: 'student@demo.com',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'submitted', fileName: 'hello_world.zip', fileSize: '12 KB',
  },
  {
    id: 'sub-2', assignmentId: 'asgn-4', assignmentTitle: 'Derivatives Problem Set',
    courseId: 'course-3', courseName: 'Calculus I',
    studentId: 'student-1', studentName: 'Alex Johnson', studentEmail: 'student@demo.com',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'graded', fileName: 'derivatives_solutions.pdf', fileSize: '1.2 MB',
    grade: 88, feedback: 'Excellent work on the chain rule problems. Review product rule application in problems 12-14.',
    gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-3', assignmentId: 'asgn-4', assignmentTitle: 'Derivatives Problem Set',
    courseId: 'course-3', courseName: 'Calculus I',
    studentId: 'student-2', studentName: 'Maria Garcia', studentEmail: 'maria@demo.com',
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'graded', fileName: 'calculus_hw4.pdf', fileSize: '890 KB',
    grade: 95, feedback: 'Outstanding work! Perfect application of all differentiation rules.',
    gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

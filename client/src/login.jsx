import React from 'react';

const StudentList = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      age: 20,
      grade: "A",
      course: "Computer Science",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 22,
      grade: "B",
      course: "Mathematics",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Student Details</h2>

      {/* Mapping for Student Names */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Student Names</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.map((student) => (
            <div
              key={student.id}
              className="bg-blue-100 text-blue-800 p-4 rounded-md shadow-md"
            >
              <h4 className="text-lg font-semibold">{student.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Mapping for Other Details (Age, Grade, Course) */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Student Details</h3>
        {data.map((student) => (
          <div
            key={student.id}
            className="bg-white p-4 rounded-md shadow-md mb-4 border border-gray-200"
          >
            <p><strong>Age:</strong> {student.age}</p>
            <p><strong>Grade:</strong> {student.grade}</p>
            <p><strong>Course:</strong> {student.course}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;

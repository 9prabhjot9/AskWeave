// This file generates placeholder static routes for the [id] dynamic route
// For a real project, you'd fetch these IDs from the database

export function generateStaticParams() {
  // Generate 10 placeholder question IDs 
  // In a production app, you would use actual question IDs from your API/database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
  ];
} 
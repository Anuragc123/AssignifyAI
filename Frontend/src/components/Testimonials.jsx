export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "AssignifyAI has transformed how I provide feedback to my students. I can now give detailed, personalized comments to each student in a fraction of the time it used to take.",
      author: "Dr. Sarah Johnson",
      role: "Professor of English, Stanford University",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "As a high school teacher with over 150 students, grading was consuming my weekends. With AssignifyAI, I've reclaimed my personal time while actually improving the quality of feedback I give.",
      author: "Michael Chen",
      role: "High School Science Teacher",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "The insights provided by AssignifyAI have helped me identify patterns in student understanding that I was missing before. It's like having a teaching assistant who never gets tired.",
      author: "Priya Patel",
      role: "Middle School Math Teacher",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Educators Are Saying
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of educators who are already saving time and
            improving student outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

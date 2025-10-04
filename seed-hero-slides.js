// Hero Slides Seed Data Script
// Run this after the server is running to populate initial hero slides

const API_BASE = 'http://localhost:3000';

// You'll need to get an admin token first by logging in
const ADMIN_TOKEN = 'your-admin-token-here'; // Replace with actual admin token

const heroSlides = [
  {
    title: "Computer Department",
    subtitle: "Vishweshwarayya Institute of Engineering & Technology",
    description: "Pioneering excellence in computer science education, research, and innovation. Shaping the future of technology through cutting-edge curriculum and world-class faculty.",
    type: "main",
    isActive: true,
    order: 1
  },
  {
    title: "Tech Symposium 2025",
    subtitle: "Join Us October 15-17",
    description: "Experience the biggest technology symposium featuring industry leaders, cutting-edge workshops, and exciting competitions. Registration now open for all students and professionals.",
    type: "events",
    isActive: true,
    order: 2
  },
  {
    title: "AI Research Lab Inaugurated",
    subtitle: "Latest News & Updates",
    description: "Our department proudly announces the opening of a state-of-the-art Artificial Intelligence Research Lab equipped with the latest hardware and software for advanced research.",
    type: "news",
    isActive: true,
    order: 3
  },
  {
    title: "National Coding Champions",
    subtitle: "Achievement Spotlight",
    description: "Our computer science students secured first place in the National Inter-College Coding Championship, competing against 200+ institutions across the country.",
    type: "achievement",
    isActive: true,
    order: 4
  },
  {
    title: "Industry Collaboration",
    subtitle: "Partnership with Tech Giants",
    description: "We've established partnerships with leading technology companies to provide internships, workshops, and placement opportunities for our students in cutting-edge domains.",
    type: "partnership",
    isActive: true,
    order: 5
  }
];

async function seedHeroSlides() {
  try {
    for (const slide of heroSlides) {
      const response = await fetch(`${API_BASE}/api/hero-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(slide)
      });

      if (response.ok) {
        const created = await response.json();
        console.log(`Created slide: ${created.title}`);
      } else {
        console.error(`Failed to create slide: ${slide.title}`);
        const error = await response.text();
        console.error(error);
      }
    }
  } catch (error) {
    console.error('Error seeding hero slides:', error);
  }
}

// Uncomment the line below to run the seeding
// seedHeroSlides();

console.log('Hero slides seed data ready. Update ADMIN_TOKEN and uncomment seedHeroSlides() to run.');
import dotenv from 'dotenv';
dotenv.config();

import { storage } from '../server/storage';

async function seedHeroSlides() {
  try {
    const slides = [
      {
        title: 'Computer Department',
        subtitle: 'Vishweshwarayya Institute of Engineering & Technology',
        description: 'Pioneering excellence in computer science education, research, and innovation. Shaping the future of technology through cutting-edge curriculum and world-class faculty.',
        backgroundImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080',
        ctaText: 'Explore Programs',
        ctaLink: '/about',
        order: 1,
        published: true
      },
      {
        title: 'Innovation Hub',
        subtitle: 'Research & Development',
        description: 'State-of-the-art laboratories and research facilities fostering innovation in artificial intelligence, machine learning, and emerging technologies.',
        backgroundImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        ctaText: 'View Research',
        ctaLink: '/research',
        order: 2,
        published: true
      },
      {
        title: 'Student Excellence',
        subtitle: 'Achievements & Placements',
        description: 'Our students consistently achieve excellence in academics, competitions, and secure placements in top technology companies worldwide.',
        backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        ctaText: 'View Placements',
        ctaLink: '/placements',
        order: 3,
        published: true
      }
    ];

    for (const slideData of slides) {
      try {
        const slide = await storage.createHeroSlide(slideData);
        console.log('Created slide:', slide.title);
      } catch (error: any) {
        if (error.message?.includes('duplicate')) {
          console.log('Slide already exists:', slideData.title);
        } else {
          console.error('Error creating slide:', slideData.title, error);
        }
      }
    }
    
    console.log('Hero slides seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hero slides:', error);
    process.exit(1);
  }
}

seedHeroSlides();
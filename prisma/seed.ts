import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return hash(password, saltRounds)
}

// Ethereum-style hash simulation for evidence
function generateEvidenceHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0')
}

// University slug mapping
const univSlugs = {
  universityOfKarachi: 'university-of-karachi',
  pucit: 'pucit',
  lums: 'lums',
  fast: 'fast',
  nust: 'nust',
}

async function main() {
  console.log('Starting seed script...')

  // Clean up existing data for idempotency
  console.log('Cleaning up existing seed data for idempotent re-run...')
  await prisma.reviewVote.deleteMany()
  await prisma.peerVerification.deleteMany()
  await prisma.universityResponse.deleteMany()
  await prisma.flagInstance.deleteMany()
  await prisma.courseReview.deleteMany()
  await prisma.departmentReview.deleteMany()
  await prisma.instructorReview.deleteMany()
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.instructor.deleteMany()
  await prisma.student.deleteMany()
  await prisma.department.deleteMany()
  await prisma.university.deleteMany()
  console.log('Cleanup complete.')

  // ============================================
  // 1. SEED UNIVERSITIES (5 Major Pakistani Universities)
  // ============================================

  const universities = await prisma.university.createMany({
    data: [
      {
        name: 'University of Karachi',
        slug: univSlugs.universityOfKarachi,
        location: 'University Road',
        city: 'Karachi',
        province: 'Sindh',
        type: 'Public',
        hECApproved: true,
        description: 'University of Karachi (UoK) is the first modern university in Pakistan, established in 1953. It has grown to become one of the most prestigious universities in the country with multiple campuses and departments.',
        website: 'https://www.uok.edu.pk',
        budgetTier: 'High',
        avgTuitionPKR: 150000,
        scholarshipAvailable: true,
        scholarshipAvgAmount: 50000,
        cityRankingScore: 8.5,
        provinceRankingScore: 7.8,
        nationalRankingScore: 8.2,
      },
      {
        name: 'Punjab University College of Information Technology',
        slug: univSlugs.pucit,
        location: 'University of the Punjab',
        city: 'Lahore',
        province: 'Punjab',
        type: 'Public',
        hECApproved: true,
        description: 'PUCIT is the premier institution for computer science and information technology education in Pakistan. Established in 1998, it has produced industry leaders and researchers.',
        website: 'https://www.pucit.pu.edu.pk',
        budgetTier: 'High',
        avgTuitionPKR: 180000,
        scholarshipAvailable: true,
        scholarshipAvgAmount: 60000,
        cityRankingScore: 9.0,
        provinceRankingScore: 9.2,
        nationalRankingScore: 8.8,
      },
      {
        name: 'Lahore University of Management Sciences',
        slug: univSlugs.lums,
        location: 'CH Road',
        city: 'Lahore',
        province: 'Punjab',
        type: 'Private',
        hECApproved: true,
        description: 'LUMS is one of Pakistan\'s top private universities, consistently ranked among the best in the country. Known for its rigorous academic programs and international faculty.',
        website: 'https://www.lums.edu.pk',
        budgetTier: 'High',
        avgTuitionPKR: 1500000,
        scholarshipAvailable: true,
        scholarshipAvgAmount: 300000,
        cityRankingScore: 9.5,
        provinceRankingScore: 9.0,
        nationalRankingScore: 9.3,
      },
      {
        name: 'FAST School of Computer Science',
        slug: univSlugs.fast,
        location: 'Nusrat Bhutta Road',
        city: 'Karachi',
        province: 'Sindh',
        type: 'Private',
        hECApproved: true,
        description: 'FAST provides a unique learning experience focused on technology and computer science with a strong emphasis on hands-on learning and industry connections.',
        website: 'https://fast.nu.edu.pk',
        budgetTier: 'Medium',
        avgTuitionPKR: 650000,
        scholarshipAvailable: true,
        scholarshipAvgAmount: 150000,
        cityRankingScore: 9.2,
        provinceRankingScore: 8.5,
        nationalRankingScore: 8.7,
      },
      {
        name: 'NED University of Engineering and Technology',
        slug: univSlugs.nust,
        location: 'University Road',
        city: 'Karachi',
        province: 'Sindh',
        type: 'Public',
        hECApproved: true,
        description: 'NED University is one of Pakistan\'s leading engineering institutions, known for its strong programs in civil, mechanical, electrical, and computer engineering.',
        website: 'https://www.neduet.edu.pk',
        budgetTier: 'Medium',
        avgTuitionPKR: 250000,
        scholarshipAvailable: true,
        scholarshipAvgAmount: 80000,
        cityRankingScore: 8.0,
        provinceRankingScore: 7.5,
        nationalRankingScore: 7.8,
      },
    ],
  })

  console.log(`Created ${universities.count} universities`)

  // ============================================
  // 2. SEED DEPARTMENTS
  // ============================================

  const departmentData = [
    {
      universitySlug: univSlugs.universityOfKarachi,
      name: 'Department of Computer Science',
      code: 'DCS',
      description: 'Leading department for CS education with research in AI, Data Science, and Software Engineering.',
    },
    {
      universitySlug: univSlugs.universityOfKarachi,
      name: 'Department of Electrical Engineering',
      code: 'DEE',
      description: 'Established in 1962, offering programs in Power Systems, Electronics, and Signal Processing.',
    },
    {
      universitySlug: univSlugs.universityOfKarachi,
      name: 'Department of Mechanical Engineering',
      code: 'DMME',
      description: 'Focus on Thermal Systems, Design, and Manufacturing with modern labs.',
    },
    {
      universitySlug: univSlugs.pucit,
      name: 'Department of Computer Science',
      code: 'DCS',
      description: 'Premier CS department offering BS, MS, and PhD programs with industry collaborations.',
    },
    {
      universitySlug: univSlugs.pucit,
      name: 'Department of Software Engineering',
      code: 'DSE',
      description: 'Dedicated department for software engineering with focus on agile methodologies and DevOps.',
    },
    {
      universitySlug: univSlugs.pucit,
      name: 'Department of Information Technology',
      code: 'DIT',
      description: 'Applied IT programs with emphasis on enterprise solutions and digital transformation.',
    },
    {
      universitySlug: univSlugs.pucit,
      name: 'Department of Electrical Engineering',
      code: 'DEE',
      description: 'Modern EE department with labs in Power Electronics and Renewable Energy.',
    },
    {
      universitySlug: univSlugs.lums,
      name: 'Department of Computer Science',
      code: 'CS',
      description: 'Interdisciplinary CS with AI, Cybersecurity, and Bioinformatics focus.',
    },
    {
      universitySlug: univSlugs.lums,
      name: 'Department of Electrical Engineering',
      code: 'EE',
      description: 'Research-focused EE department with NanoLab facilities.',
    },
    {
      universitySlug: univSlugs.lums,
      name: 'Department of Mathematics',
      code: 'MATH',
      description: 'Theoretical and Applied Mathematics with Actuarial Science option.',
    },
    {
      universitySlug: univSlugs.fast,
      name: 'Department of Computer Science',
      code: 'CS',
      description: 'Industry-aligned CS with strong emphasis on practical skills and internships.',
    },
    {
      universitySlug: univSlugs.fast,
      name: 'Department of Software Engineering',
      code: 'SE',
      description: 'Hands-on SE training with capstone projects for real clients.',
    },
    {
      universitySlug: univSlugs.fast,
      name: 'Department of Data Science',
      code: 'DS',
      description: 'Newest department focusing on Big Data, Machine Learning, and Analytics.',
    },
    {
      universitySlug: univSlugs.nust,
      name: 'Department of Computer Engineering',
      code: 'CE',
      description: 'Bridge between hardware and software with Embedded Systems focus.',
    },
    {
      universitySlug: univSlugs.nust,
      name: 'Department of Electrical Engineering',
      code: 'EE',
      description: 'Comprehensive EE programs with Power and Electronics specializations.',
    },
    {
      universitySlug: univSlugs.nust,
      name: 'Department of Mechanical Engineering',
      code: 'ME',
      description: 'Covering Thermodynamics, Fluid Mechanics, and CAD/CAM.',
    },
    {
      universitySlug: univSlugs.nust,
      name: 'Department of Civil Engineering',
      code: 'CE',
      description: 'Focus on Urban Infrastructure, Geotechnical, and Structural Engineering.',
    },
  ]

  for (const dept of departmentData) {
    const university = await prisma.university.findUnique({
      where: { slug: dept.universitySlug },
    })
    if (university) {
      const { universitySlug, ...deptData } = dept
      await prisma.department.create({
        data: {
          ...deptData,
          universityId: university.id,
        },
      })
    }
  }
  console.log('Created 16 departments')

  // ============================================
  // 3. SEED INSTRUCTORS
  // ============================================

  const instructorData = [
    {
      universitySlug: univSlugs.universityOfKarachi,
      departmentCode: 'DCS',
      name: 'Dr. Abdul Karim Siddiqi',
      email: 'dr.siddiqi@uok.edu.pk',
      designation: 'Professor',
      bio: 'PhD from MIT with 20+ years in algorithms research. Published 50+ papers in international journals.',
      photoUrl: 'https://uok.edu.pk/images/faculty/siddiqi.jpg',
      ratingsAvg: 4.7,
      reviewsCount: 128,
    },
    {
      universitySlug: univSlugs.universityOfKarachi,
      departmentCode: 'DEE',
      name: 'Dr. Naseer Ahmed Sheikh',
      email: 'dr.sheikh@uok.edu.pk',
      designation: 'Associate Professor',
      bio: 'Specialist in Power Systems and Renewable Energy Integration.',
      photoUrl: 'https://uok.edu.pk/images/faculty/sheikh.jpg',
      ratingsAvg: 4.5,
      reviewsCount: 95,
    },
    {
      universitySlug: univSlugs.pucit,
      departmentCode: 'DCS',
      name: 'Dr. Javeed Iqbal',
      email: 'dr.javeed@pucit.pu.edu.pk',
      designation: 'Professor and Head',
      bio: 'Former Microsoft Research engineer. Expert in distributed systems and cloud computing.',
      photoUrl: 'https://pucit.pu.edu.pk/images/faculty/javeed.jpg',
      ratingsAvg: 4.8,
      reviewsCount: 156,
    },
    {
      universitySlug: univSlugs.pucit,
      departmentCode: 'DSE',
      name: 'Dr. Zulfiqar Ali',
      email: 'dr.zulfiqar@pucit.pu.edu.pk',
      designation: 'Associate Professor',
      bio: 'Agile methodology expert with 15 years in software development and project management.',
      photoUrl: 'https://pucit.pu.edu.pk/images/faculty/zulfiqar.jpg',
      ratingsAvg: 4.6,
      reviewsCount: 89,
    },
    {
      universitySlug: univSlugs.lums,
      departmentCode: 'CS',
      name: 'Prof. Hassan Ahmed',
      email: 'prof.ahmed@lums.edu.pk',
      designation: 'Professor',
      bio: 'MIT PhD. Leading researcher in Machine Learning and AI. Former Google researcher.',
      photoUrl: 'https://lums.edu.pk/images/faculty/ahmed.jpg',
      ratingsAvg: 4.9,
      reviewsCount: 203,
    },
    {
      universitySlug: univSlugs.lums,
      departmentCode: 'EE',
      name: 'Dr. Farooq Khan',
      email: 'dr.khan@lums.edu.pk',
      designation: 'Professor',
      bio: 'Fellow of IEEE. Expert in RF and Microwave Engineering with industry partnerships.',
      photoUrl: 'https://lums.edu.pk/images/faculty/khan.jpg',
      ratingsAvg: 4.7,
      reviewsCount: 112,
    },
    {
      universitySlug: univSlugs.lums,
      departmentCode: 'MATH',
      name: 'Dr. Sanaullah Malik',
      email: 'dr.malik@lums.edu.pk',
      designation: 'Associate Professor',
      bio: 'Statistics and Applied Mathematics expert. Published author of three textbooks.',
      photoUrl: 'https://lums.edu.pk/images/faculty/malik.jpg',
      ratingsAvg: 4.6,
      reviewsCount: 78,
    },
    {
      universitySlug: univSlugs.fast,
      departmentCode: 'CS',
      name: 'Dr. Ali Farooqui',
      email: 'dr.ali@fast.nu.edu.pk',
      designation: 'Professor',
      bio: 'Industry veteran with 20+ years experience. Former CTO of major tech company.',
      photoUrl: 'https://fast.nu.edu.pk/images/faculty/ali.jpg',
      ratingsAvg: 4.5,
      reviewsCount: 167,
    },
    {
      universitySlug: univSlugs.fast,
      departmentCode: 'DS',
      name: 'Dr. Umer Siddiqui',
      email: 'dr.siddiqui@fast.nu.edu.pk',
      designation: 'Assistant Professor',
      bio: 'Data Science practitioner with focus on fintech applications and machine learning.',
      photoUrl: 'https://fast.nu.edu.pk/images/faculty/siddiqui.jpg',
      ratingsAvg: 4.4,
      reviewsCount: 64,
    },
    {
      universitySlug: univSlugs.nust,
      departmentCode: 'EE',
      name: 'Dr. Muhammad Shaikh',
      email: 'dr.shaikh@neduet.edu.pk',
      designation: 'Professor',
      bio: 'Power Systems expert with extensive industry consulting experience.',
      photoUrl: 'https://neduet.edu.pk/images/faculty/shaikh.jpg',
      ratingsAvg: 4.6,
      reviewsCount: 134,
    },
    {
      universitySlug: univSlugs.nust,
      departmentCode: 'ME',
      name: 'Dr. Rashid Siddiqi',
      email: 'dr.siddiqi@neduet.edu.pk',
      designation: 'Professor',
      bio: 'Thermodynamics and Heat Transfer specialist with research in energy efficiency.',
      photoUrl: 'https://neduet.edu.pk/images/faculty/rashid.jpg',
      ratingsAvg: 4.5,
      reviewsCount: 98,
    },
    {
      universitySlug: univSlugs.nust,
      departmentCode: 'CE',
      name: 'Dr. Imran Ali',
      email: 'dr.ali@neduet.edu.pk',
      designation: 'Professor',
      bio: 'Structural Engineering expert with focus on earthquake-resistant design.',
      photoUrl: 'https://neduet.edu.pk/images/faculty/imran.jpg',
      ratingsAvg: 4.7,
      reviewsCount: 87,
    },
  ]

  for (const instr of instructorData) {
    const university = await prisma.university.findUnique({
      where: { slug: instr.universitySlug },
    })
    const department = await prisma.department.findFirst({
      where: {
        universityId: university?.id,
        code: instr.departmentCode,
      },
    })
    if (university && department) {
      await prisma.instructor.create({
        data: {
          universityId: university.id,
          departmentId: department.id,
          name: instr.name,
          email: instr.email,
          designation: instr.designation,
          bio: instr.bio,
          photoUrl: instr.photoUrl,
          ratingsAvg: instr.ratingsAvg,
          reviewsCount: instr.reviewsCount,
        },
      })
    }
  }
  console.log('Created 12 instructors')

  // ============================================
  // 4. SEED COURSES WITH SYLLABI
  // ============================================

  const courseData = [
    {
      universitySlug: univSlugs.universityOfKarachi,
      departmentCode: 'DCS',
      instructorEmail: 'dr.siddiqi@uok.edu.pk',
      courseCode: 'CS-201',
      courseName: 'Data Structures and Algorithms',
      creditHours: 3,
      semester: 2,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'Introduction to Algorithms', weeks: 2, weight: 10 },
        { topic: 'Arrays and Strings', weeks: 1, weight: 5 },
        { topic: 'Linked Lists', weeks: 1, weight: 5 },
        { topic: 'Stacks and Queues', weeks: 1, weight: 5 },
        { topic: 'Trees and Binary Search Trees', weeks: 2, weight: 10 },
        { topic: 'Hash Tables', weeks: 1, weight: 5 },
        { topic: 'Sorting Algorithms', weeks: 2, weight: 10 },
        { topic: 'Graph Algorithms', weeks: 2, weight: 15 },
        { topic: 'Dynamic Programming', weeks: 1, weight: 10 },
        { topic: 'Complexity Analysis', weeks: 1, weight: 10 },
        { topic: 'Greedy Algorithms', weeks: 1, weight: 5 },
        { topic: 'NP-Completeness', weeks: 1, weight: 5 },
      ],
    },
    {
      universitySlug: univSlugs.universityOfKarachi,
      departmentCode: 'DCS',
      instructorEmail: 'dr.siddiqi@uok.edu.pk',
      courseCode: 'CS-301',
      courseName: 'Database Systems',
      creditHours: 3,
      semester: 3,
      year: 2024,
      semesterType: 'Spring',
      syllabus: [
        { topic: 'Database Fundamentals', weeks: 1, weight: 5 },
        { topic: 'Relational Model', weeks: 1, weight: 5 },
        { topic: 'SQL Fundamentals', weeks: 2, weight: 15 },
        { topic: 'ER Modeling', weeks: 1, weight: 5 },
        { topic: 'Normalization', weeks: 2, weight: 10 },
        { topic: 'Storage and Indexing', weeks: 1, weight: 10 },
        { topic: 'Transactions', weeks: 1, weight: 10 },
        { topic: 'Concurrency Control', weeks: 1, weight: 10 },
        { topic: 'Recovery Management', weeks: 1, weight: 10 },
        { topic: 'NoSQL Databases', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.pucit,
      departmentCode: 'DCS',
      instructorEmail: 'dr.javeed@pucit.pu.edu.pk',
      courseCode: 'CS-201',
      courseName: 'Data Structures and Algorithms',
      creditHours: 3,
      semester: 2,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'Algorithmic Thinking', weeks: 1, weight: 5 },
        { topic: 'Complexity Analysis', weeks: 1, weight: 5 },
        { topic: 'Lists, Stacks, Queues', weeks: 1, weight: 5 },
        { topic: 'Trees - BST, AVL, RBT', weeks: 2, weight: 10 },
        { topic: 'Hashing Techniques', weeks: 1, weight: 5 },
        { topic: 'Sorting Algorithms', weeks: 2, weight: 10 },
        { topic: 'Graph Traversals', weeks: 1, weight: 5 },
        { topic: 'Shortest Path Algorithms', weeks: 1, weight: 5 },
        { topic: 'Minimum Spanning Tree', weeks: 1, weight: 5 },
        { topic: 'Dynamic Programming', weeks: 2, weight: 15 },
        { topic: 'Greedy Algorithms', weeks: 1, weight: 5 },
        { topic: 'NP-Hard Problems', weeks: 1, weight: 5 },
      ],
    },
    {
      universitySlug: univSlugs.pucit,
      departmentCode: 'DSE',
      instructorEmail: 'dr.zulfiqar@pucit.pu.edu.pk',
      courseCode: 'SE-301',
      courseName: 'Software Engineering',
      creditHours: 3,
      semester: 3,
      year: 2024,
      semesterType: 'Spring',
      syllabus: [
        { topic: 'Software Development Life Cycle', weeks: 1, weight: 10 },
        { topic: 'Requirements Engineering', weeks: 2, weight: 15 },
        { topic: 'Software Architecture', weeks: 2, weight: 15 },
        { topic: 'Design Patterns', weeks: 1, weight: 10 },
        { topic: 'UML Modelling', weeks: 2, weight: 15 },
        { topic: 'Testing Strategies', weeks: 1, weight: 10 },
        { topic: 'Project Management', weeks: 1, weight: 10 },
        { topic: 'Agile Methodologies', weeks: 1, weight: 10 },
        { topic: 'Quality Assurance', weeks: 1, weight: 5 },
      ],
    },
    {
      universitySlug: univSlugs.pucit,
      departmentCode: 'DCS',
      instructorEmail: 'dr.javeed@pucit.pu.edu.pk',
      courseCode: 'CS-402',
      courseName: 'Theory of Computation',
      creditHours: 3,
      semester: 4,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'Regular Languages', weeks: 2, weight: 15 },
        { topic: 'Finite Automata', weeks: 2, weight: 15 },
        { topic: 'Context-Free Grammars', weeks: 1, weight: 10 },
        { topic: 'Pushdown Automata', weeks: 1, weight: 10 },
        { topic: 'Turing Machines', weeks: 1, weight: 10 },
        { topic: 'Undecidability', weeks: 1, weight: 10 },
        { topic: 'Complexity Classes', weeks: 1, weight: 10 },
        { topic: 'Intractable Problems', weeks: 1, weight: 10 },
        { topic: 'NP-Completeness Proofs', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.lums,
      departmentCode: 'CS',
      instructorEmail: 'prof.ahmed@lums.edu.pk',
      courseCode: 'CS-301',
      courseName: 'Algorithms',
      creditHours: 3,
      semester: 3,
      year: 2024,
      semesterType: 'Spring',
      syllabus: [
        { topic: 'Algorithm Design Paradigms', weeks: 1, weight: 10 },
        { topic: 'Divide and Conquer', weeks: 1, weight: 10 },
        { topic: 'Dynamic Programming', weeks: 2, weight: 20 },
        { topic: 'Greedy Algorithms', weeks: 1, weight: 10 },
        { topic: 'Graph Algorithms', weeks: 2, weight: 20 },
        { topic: 'NP-Completeness', weeks: 1, weight: 10 },
        { topic: 'Approximation Algorithms', weeks: 1, weight: 10 },
        { topic: 'Randomized Algorithms', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.lums,
      departmentCode: 'CS',
      instructorEmail: 'prof.ahmed@lums.edu.pk',
      courseCode: 'CS-402',
      courseName: 'Machine Learning',
      creditHours: 3,
      semester: 4,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'Introduction to ML', weeks: 1, weight: 10 },
        { topic: 'Linear Regression', weeks: 1, weight: 10 },
        { topic: 'Logistic Regression', weeks: 1, weight: 10 },
        { topic: 'Decision Trees', weeks: 1, weight: 10 },
        { topic: 'Support Vector Machines', weeks: 1, weight: 10 },
        { topic: 'Ensemble Methods', weeks: 1, weight: 10 },
        { topic: 'Neural Networks', weeks: 2, weight: 20 },
        { topic: 'Deep Learning', weeks: 1, weight: 10 },
        { topic: 'Unsupervised Learning', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.lums,
      departmentCode: 'EE',
      instructorEmail: 'dr.khan@lums.edu.pk',
      courseCode: 'EE-301',
      courseName: 'Circuit Analysis',
      creditHours: 4,
      semester: 3,
      year: 2024,
      semesterType: 'Spring',
      syllabus: [
        { topic: 'Basic Circuit Elements', weeks: 1, weight: 10 },
        { topic: 'Ohm and Kirchhoff Laws', weeks: 1, weight: 10 },
        { topic: 'Nodal and Mesh Analysis', weeks: 2, weight: 20 },
        { topic: 'Phasor Analysis', weeks: 1, weight: 10 },
        { topic: 'Impedance and Admittance', weeks: 1, weight: 10 },
        { topic: 'Circuit Theorems', weeks: 1, weight: 10 },
        { topic: 'AC Power Analysis', weeks: 1, weight: 10 },
        { topic: 'Two-Port Networks', weeks: 1, weight: 10 },
        { topic: 'Frequency Response', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.fast,
      departmentCode: 'CS',
      instructorEmail: 'dr.ali@fast.nu.edu.pk',
      courseCode: 'CS-202',
      courseName: 'Object Oriented Programming',
      creditHours: 3,
      semester: 2,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'OOP Fundamentals', weeks: 1, weight: 10 },
        { topic: 'Classes and Objects', weeks: 1, weight: 10 },
        { topic: 'Inheritance and Polymorphism', weeks: 1, weight: 10 },
        { topic: 'Encapsulation and Abstraction', weeks: 1, weight: 10 },
        { topic: 'Exception Handling', weeks: 1, weight: 5 },
        { topic: 'File I/O', weeks: 1, weight: 5 },
        { topic: 'Templates and STL', weeks: 1, weight: 10 },
        { topic: 'Design Principles', weeks: 1, weight: 10 },
        { topic: 'Design Patterns (Overview)', weeks: 1, weight: 10 },
        { topic: 'Project Development', weeks: 2, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.fast,
      departmentCode: 'DS',
      instructorEmail: 'dr.siddiqui@fast.nu.edu.pk',
      courseCode: 'DS-401',
      courseName: 'Machine Learning Applications',
      creditHours: 3,
      semester: 4,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'ML Pipeline Overview', weeks: 1, weight: 10 },
        { topic: 'Scikit-learn Basics', weeks: 1, weight: 10 },
        { topic: 'Feature Engineering', weeks: 1, weight: 10 },
        { topic: 'Model Evaluation', weeks: 1, weight: 10 },
        { topic: 'Deep Learning with TensorFlow', weeks: 2, weight: 20 },
        { topic: 'NLP Applications', weeks: 1, weight: 10 },
        { topic: 'Computer Vision', weeks: 1, weight: 10 },
        { topic: 'Big Data ML', weeks: 1, weight: 10 },
        { topic: 'Deployment and MLOps', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.nust,
      departmentCode: 'EE',
      instructorEmail: 'dr.shaikh@neduet.edu.pk',
      courseCode: 'EE-302',
      courseName: 'Electric Circuits',
      creditHours: 3,
      semester: 2,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'Basic Electrical Concepts', weeks: 1, weight: 10 },
        { topic: 'Network Elements', weeks: 1, weight: 10 },
        { topic: 'Network Theorems', weeks: 1, weight: 10 },
        { topic: 'Magnetic Circuits', weeks: 1, weight: 10 },
        { topic: 'AC Fundamentals', weeks: 1, weight: 10 },
        { topic: 'Phasor Algebra', weeks: 1, weight: 10 },
        { topic: 'Impedance and Admittance', weeks: 1, weight: 10 },
        { topic: 'RLC Circuits', weeks: 2, weight: 20 },
        { topic: 'Resonance', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.nust,
      departmentCode: 'ME',
      instructorEmail: 'dr.siddiqi@neduet.edu.pk',
      courseCode: 'ME-301',
      courseName: 'Thermodynamics',
      creditHours: 3,
      semester: 2,
      year: 2024,
      semesterType: 'Fall',
      syllabus: [
        { topic: 'Basic Concepts', weeks: 1, weight: 10 },
        { topic: 'Properties of Pure Substances', weeks: 2, weight: 20 },
        { topic: 'First Law of Thermodynamics', weeks: 1, weight: 10 },
        { topic: 'Second Law of Thermodynamics', weeks: 1, weight: 10 },
        { topic: 'Entropy Analysis', weeks: 1, weight: 10 },
        { topic: 'Power Cycles', weeks: 1, weight: 10 },
        { topic: 'Refrigeration Cycles', weeks: 1, weight: 10 },
        { topic: 'Combustion Processes', weeks: 1, weight: 10 },
        { topic: 'Rankine Cycle', weeks: 1, weight: 10 },
      ],
    },
    {
      universitySlug: univSlugs.nust,
      departmentCode: 'CE',
      instructorEmail: 'dr.ali@neduet.edu.pk',
      courseCode: 'CE-301',
      courseName: 'Structural Analysis',
      creditHours: 3,
      semester: 3,
      year: 2024,
      semesterType: 'Spring',
      syllabus: [
        { topic: 'Determinacy and Stability', weeks: 1, weight: 10 },
        { topic: 'Load Types and Support Conditions', weeks: 1, weight: 10 },
        { topic: 'Equilibrium Equations', weeks: 1, weight: 10 },
        { topic: 'Shear Force and Bending Moment', weeks: 1, weight: 10 },
        { topic: 'Bending Stress Formula', weeks: 1, weight: 10 },
        { topic: 'Moment Distribution Method', weeks: 1, weight: 10 },
        { topic: 'Slope Deflection Method', weeks: 1, weight: 10 },
        { topic: 'Influence Lines', weeks: 1, weight: 10 },
        { topic: 'Indeterminate Beams', weeks: 2, weight: 20 },
        { topic: 'Introduction to Matrix Methods', weeks: 1, weight: 10 },
      ],
    },
  ]

  for (const course of courseData) {
    const university = await prisma.university.findUnique({
      where: { slug: course.universitySlug },
    })
    const department = await prisma.department.findFirst({
      where: {
        universityId: university?.id,
        code: course.departmentCode,
      },
    })
    const instructor = await prisma.instructor.findFirst({
      where: { email: course.instructorEmail },
    })

    if (department && university) {
      await prisma.course.create({
        data: {
          universityId: university.id,
          departmentId: department.id,
          instructorId: instructor?.id,
          courseCode: course.courseCode,
          courseName: course.courseName,
          creditHours: course.creditHours,
          semester: course.semester,
          year: course.year,
          semesterType: course.semesterType,
          syllabus: course.syllabus,
        },
      })
    }
  }
  console.log('Created 16 courses')

  // Store IDs for later use
  const nedUniv = await prisma.university.findUnique({ where: { slug: univSlugs.nust } })
  const pucitUniv = await prisma.university.findUnique({ where: { slug: univSlugs.pucit } })
  const uokUniv = await prisma.university.findUnique({ where: { slug: univSlugs.universityOfKarachi } })
  const fastUniv = await prisma.university.findUnique({ where: { slug: univSlugs.fast } })
  const lumsUniv = await prisma.university.findUnique({ where: { slug: univSlugs.lums } })

  // ============================================
  // 5. CREATE STUDENT USERS WITH VERIFICATION
  // ============================================

  const studentData = [
    {
      email: 'hammad.khan@gmail.com',
      name: 'Hammad Khan',
      studentId: 'PUCIT-2023-CS-001',
      universitySlug: univSlugs.pucit,
    },
    {
      email: 'fatima.sohail@student.uok.edu.pk',
      name: 'Fatima Sohail',
      studentId: 'UoK-2023-CS-045',
      universitySlug: univSlugs.universityOfKarachi,
    },
    {
      email: 'umar.rashid@gmail.com',
      name: 'Umar Rashid',
      studentId: 'LUMS-2023-CS-012',
      universitySlug: univSlugs.lums,
    },
    {
      email: 'sana.hassan@fast.nu.edu.pk',
      name: 'Sana Hassan',
      studentId: 'FAST-2023-CS-078',
      universitySlug: univSlugs.fast,
    },
    {
      email: 'ali.nazir@gmail.com',
      name: 'Ali Nazir',
      studentId: 'NUST-2023-EE-034',
      universitySlug: univSlugs.nust,
    },
    {
      email: 'zara.chaudhry@student.uok.edu.pk',
      name: 'Zara Chaudhry',
      studentId: 'UoK-2023-EE-067',
      universitySlug: univSlugs.universityOfKarachi,
    },
    {
      email: 'bilal.wagan@student.pucit.pu.edu.pk',
      name: 'Bilal Wagan',
      studentId: 'PUCIT-2023-SE-023',
      universitySlug: univSlugs.pucit,
    },
    {
      email: 'nimra.shaikh@gmail.com',
      name: 'Nimra Shaikh',
      studentId: 'LUMS-2023-MATH-009',
      universitySlug: univSlugs.lums,
    },
    {
      email: 'waqar.hussain@fast.nu.edu.pk',
      name: 'Waqar Hussain',
      studentId: 'FAST-2023-DS-045',
      universitySlug: univSlugs.fast,
    },
    {
      email: 'sarmad.khan@student.neduet.edu.pk',
      name: 'Sarmad Khan',
      studentId: 'NUST-2023-ME-018',
      universitySlug: univSlugs.nust,
    },
    {
      email: 'kulsoom.farooq@gmail.com',
      name: 'Kulsoom Farooq',
      studentId: 'UoK-2023-ME-089',
      universitySlug: univSlugs.universityOfKarachi,
    },
    {
      email: 'taha.ali.zia@student.lums.edu.pk',
      name: 'Taha Ali Zia',
      studentId: 'LUMS-2023-CS-056',
      universitySlug: univSlugs.lums,
    },
  ]

  const createdStudents = []
  for (const student of studentData) {
    const university = await prisma.university.findUnique({
      where: { slug: student.universitySlug },
    })

    if (university) {
      const createdStudent = await prisma.student.create({
        data: {
          email: student.email,
          studentIdHash: student.studentId,
          universityId: university.id,
          verificationStatus: 'verified',
          credibilityScore: Math.floor(Math.random() * 20 + 80) / 100,
          canRate: true,
          peerRatingsMade: Math.floor(Math.random() * 50),
          peerVerificationsMade: Math.floor(Math.random() * 30),
        },
      })
      createdStudents.push(createdStudent)
    }
  }
  console.log(`Created ${createdStudents.length} student users (all verified)`)

  // ============================================
  // 6. CREATE SAMPLE REVIEWS (Budget-Friendly University Examples)
  // ============================================

  // Reviews for NED University (budget-friendly example)
  await prisma.review.createMany({
    data: [
      {
        type: 'university',
        universityId: nedUniv!.id,
        targetId: nedUniv!.id,
        studentId: createdStudents[4].id, // Ali Nazir
        content:
          'NED University offers great value for money. Tuition fees are affordable compared to other top universities. The campus infrastructure could be better, especially the classroom facilities. Professors are knowledgeable but some need better teaching skills. Scholarships are available for meritorious students.',
        rating: 4.2,
        overall: 4.0,
        teaching: 3.8,
        clarity: 4.0,
        engagement: 3.5,
        workload: 4.1,
        difficulty: 3.7,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('ned-budget-review-ali-2024-10-15-001'),
        isAnonymous: false,
        verifiedBy: 3,
        status: 'verified',
      },
      {
        type: 'university',
        universityId: nedUniv!.id,
        targetId: nedUniv!.id,
        studentId: createdStudents[9].id, // Sarmad Khan
        content:
          'As a mechanical engineering student, I find NED provides quality education at a reasonable cost. Labs are well-equipped but could use modernization. Faculty members are mostly PhD holders. The university offers good placement opportunities with local industries.',
        rating: 4.0,
        overall: 4.1,
        teaching: 3.9,
        clarity: 4.2,
        engagement: 3.7,
        workload: 4.0,
        difficulty: 3.8,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('ned-mech-review-sarmad-2024-10-16-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
      {
        type: 'university',
        universityId: nedUniv!.id,
        targetId: nedUniv!.id,
        studentId: createdStudents[11].id, // Taha Ali Zia
        content:
          'NED is a solid choice for students on a budget. The faculty is experienced and the courses are well-structured. However, the overall university reputation is not as strong as LUMS or NUST. Campus life is basic with limited extracurricular activities.',
        rating: 3.8,
        overall: 3.9,
        teaching: 4.0,
        clarity: 3.8,
        engagement: 3.5,
        workload: 3.9,
        difficulty: 3.6,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('ned-budget-review-sarmad-2024-10-17-001'),
        isAnonymous: true,
        verifiedBy: 1,
        status: 'verified',
      },
    ],
  })

  console.log('Created NED University reviews (budget-friendly examples)')

  // Create department reviews
  const nedDept = await prisma.department.findFirst({
    where: { universityId: nedUniv!.id, code: 'EE' },
  })
  const uokDept = await prisma.department.findFirst({
    where: { universityId: uokUniv!.id, code: 'DEE' },
  })

  await prisma.departmentReview.createMany({
    data: [
      {
        departmentId: nedDept!.id,
        universityId: nedUniv!.id,
        studentId: createdStudents[4].id,
        content:
          'The Electrical Engineering department at NED provides practical knowledge that is directly applicable in the industry. Lab facilities are good but could be updated more frequently. Faculty is experienced but some courses lack updated syllabus.',
        overall: 4.2,
        facilities: 3.8,
        faculty: 4.3,
        infrastructure: 3.7,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('ned-ee-review-ali-2024-10-18-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
      {
        departmentId: uokDept!.id,
        universityId: uokUniv!.id,
        studentId: createdStudents[5].id,
        content:
          'Good value for a public university. Professors are mostly qualified and provide quality education. The EE department could improve its software lab equipment. Overall, UoK is a decent choice for students from lower-middle class families.',
        overall: 3.9,
        facilities: 3.7,
        faculty: 4.0,
        infrastructure: 3.8,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('uok-ee-review-zara-2024-10-21-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
    ],
  })

  // Create course reviews
  const nedCourse = await prisma.course.findFirst({
    where: { university: { slug: univSlugs.nust }, courseCode: 'EE-302' },
  })
  const uokCourse = await prisma.course.findFirst({
    where: { university: { slug: univSlugs.universityOfKarachi }, courseCode: 'CS-201' },
  })

  await prisma.courseReview.createMany({
    data: [
      {
        courseId: nedCourse!.id,
        universityId: nedUniv!.id,
        departmentId: nedDept!.id,
        studentId: createdStudents[4].id,
        workloadRating: 3.8,
        difficultyRating: 4.1,
        contentQuality: 4.0,
        commentText:
          'Professor Shaikh explains concepts well but assignments are too lengthy. Course materials are comprehensive.',
        evidenceHash: generateEvidenceHash('ned-ee302-review-ali-2024-10-19-001'),
        isAnonymous: true,
        verifiedBy: 1,
        status: 'verified',
      },
      {
        courseId: uokCourse!.id,
        universityId: uokUniv!.id,
        departmentId: uokDept!.id,
        studentId: createdStudents[5].id,
        workloadRating: 4.0,
        difficultyRating: 3.9,
        contentQuality: 4.1,
        commentText:
          'Dr. Siddiqi is a great professor. Concepts are explained clearly with practical examples.',
        evidenceHash: generateEvidenceHash('uok-cs201-review-zara-2024-10-20-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
    ],
  })

  // Reviews for University of Karachi (public, mid-range budget)
  await prisma.review.createMany({
    data: [
      {
        type: 'university',
        universityId: uokUniv!.id,
        targetId: uokUniv!.id,
        studentId: createdStudents[1].id, // Fatima Sohail
        content:
          'UoK is a well-established public university with affordable fees. The campus is large and beautiful. However, bureaucracy in administrative work is still a major issue. Facilities vary between departments - some labs are outdated while others are modern.',
        rating: 4.1,
        overall: 4.0,
        teaching: 4.0,
        clarity: 3.8,
        engagement: 3.9,
        workload: 4.1,
        difficulty: 3.9,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('uok-review-fatima-2024-10-20-001'),
        isAnonymous: true,
        verifiedBy: 3,
        status: 'verified',
      },
      {
        type: 'university',
        universityId: uokUniv!.id,
        targetId: uokUniv!.id,
        studentId: createdStudents[5].id, // Zara Chaudhry
        content:
          'Good value for a public university. Professors are mostly qualified and provide quality education. The EE department could improve its software lab equipment. Overall, UoK is a decent choice for students from lower-middle class families.',
        rating: 3.9,
        overall: 3.8,
        teaching: 3.9,
        clarity: 3.7,
        engagement: 3.8,
        workload: 3.7,
        difficulty: 3.6,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('uok-ee-review-zara-2024-10-21-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
    ],
  })

  console.log('Created University of Karachi reviews')

  // Reviews for PUCIT (high-tier but some budget options)
  await prisma.review.createMany({
    data: [
      {
        type: 'university',
        universityId: pucitUniv!.id,
        targetId: pucitUniv!.id,
        studentId: createdStudents[6].id, // Bilal Wagan
        content:
          'PUCIT is excellent for CS students. The reputation and infrastructure are top-notch. Faculty includes industry veterans and academia legends. However, tuition fees are high. The merit-based scholarships help, but not all students can afford it. Still, the education quality justifies the cost for those who can.',
        rating: 4.7,
        overall: 4.8,
        teaching: 4.8,
        clarity: 4.7,
        engagement: 4.6,
        workload: 4.5,
        difficulty: 4.7,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('pucit-review-bilal-2024-10-22-001'),
        isAnonymous: false,
        verifiedBy: 4,
        status: 'verified',
      },
    ],
  })

  console.log('Created PUCIT review')

  // Reviews for FAST (budget-friendly private option)
  await prisma.review.createMany({
    data: [
      {
        type: 'university',
        universityId: fastUniv!.id,
        targetId: fastUniv!.id,
        studentId: createdStudents[8].id, // Waqar Hussain
        content:
          'FAST provides industry-aligned education at a moderate price point. Labs are well-equipped with latest software. The curriculum is practical and internship opportunities are good. Some professors focus too much on assignments rather than theory. Great option for budget-conscious students who want quality tech education.',
        rating: 4.3,
        overall: 4.2,
        teaching: 4.1,
        clarity: 4.0,
        engagement: 4.2,
        workload: 4.3,
        difficulty: 4.1,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('fast-review-waqar-2024-10-23-001'),
        isAnonymous: true,
        verifiedBy: 3,
        status: 'verified',
      },
    ],
  })

  console.log('Created FAST review')

  // Reviews for LUMS (high budget requirement)
  await prisma.review.createMany({
    data: [
      {
        type: 'university',
        universityId: lumsUniv!.id,
        targetId: lumsUniv!.id,
        studentId: createdStudents[10].id, // Taha Ali Zia
        content:
          'LUMS is elite but extremely expensive - fees exceed PKR 1.5 million annually. The education quality is exceptional, with world-class faculty and facilities. International exposure is excellent. However, this university is accessible only to upper-class families. Scholarships exist but they don\'t cover the full cost. A great university for those who can afford it.',
        rating: 4.6,
        overall: 4.8,
        teaching: 4.8,
        clarity: 4.7,
        engagement: 4.8,
        workload: 4.5,
        difficulty: 4.7,
        wouldRecommend: true,
        evidenceHash: generateEvidenceHash('lums-review-taha-2024-10-24-001'),
        isAnonymous: true,
        verifiedBy: 4,
        status: 'verified',
      },
    ],
  })

  console.log('Created LUMS review')

  // Create instructor reviews
  const drJaveed = await prisma.instructor.findFirst({
    where: { name: 'Dr. Javeed Iqbal' },
  })
  const profAhmed = await prisma.instructor.findFirst({
    where: { name: 'Prof. Hassan Ahmed' },
  })
  const drAli = await prisma.instructor.findFirst({
    where: { name: 'Dr. Ali Farooqui' },
  })

  await prisma.instructorReview.createMany({
    data: [
      {
        instructorId: drJaveed!.id,
        universityId: pucitUniv!.id,
        studentId: createdStudents[0].id, // Hammad Khan
        overall: 4.9,
        teaching: 4.9,
        clarity: 4.8,
        engagement: 4.9,
        workload: 4.7,
        wouldRecommend: true,
        comment:
          'Dr. Javeed is simply amazing. He makes complex algorithms understandable and assigns relevant projects. His industry experience truly helps students. Best professor I have ever had.',
        evidenceHash: generateEvidenceHash('pucit-instructor-review-hammad-2024-10-10-001'),
        isAnonymous: false,
        verifiedBy: 3,
        status: 'verified',
      },
      {
        instructorId: profAhmed!.id,
        universityId: lumsUniv!.id,
        studentId: createdStudents[2].id, // Umar Rashid
        overall: 4.8,
        teaching: 4.8,
        clarity: 4.7,
        engagement: 4.7,
        workload: 4.6,
        wouldRecommend: true,
        comment:
          'Professor Ahmed is a lecturer from MIT. Assignments are challenging but well-designed. Research opportunities are available for MS/PhD students.',
        evidenceHash: generateEvidenceHash('lums-instructor-review-umar-2024-10-11-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
      {
        instructorId: drAli!.id,
        universityId: fastUniv!.id,
        studentId: createdStudents[3].id, // Sana Hassan
        overall: 4.4,
        teaching: 4.3,
        clarity: 4.5,
        engagement: 4.2,
        workload: 4.4,
        wouldRecommend: true,
        comment:
          'Dr. Ali has vast industry experience. He teaches practical programming and shares real-world examples. Some theoretical concepts could be explained better.',
        evidenceHash: generateEvidenceHash('fast-instructor-review-sana-2024-10-12-001'),
        isAnonymous: true,
        verifiedBy: 2,
        status: 'verified',
      },
    ],
  })

  console.log('Created instructor reviews')

  // Create peer verifications
  const nedReviews = await prisma.review.findMany({
    where: { university: { slug: univSlugs.nust } },
  })
  const pucitReviews = await prisma.review.findMany({
    where: { university: { slug: univSlugs.pucit } },
  })

  await prisma.peerVerification.createMany({
    data: [
      {
        reviewId: nedReviews[0].id,
        reviewerId: createdStudents[5].id, // Zara Chaudhry
        vote: 'approve',
        evidence: 'Student verified based on university response and content authenticity',
      },
      {
        reviewId: pucitReviews[0].id,
        reviewerId: createdStudents[7].id, // Nimra Shaikh
        vote: 'approve',
        evidence: 'Review matches student experience at PUCIT',
      },
    ],
  })

  console.log('Created peer verifications')

  console.log('Seed completed successfully!')
  console.log('---')
  console.log('Summary:')
  console.log('- 5 Pakistani universities seeded')
  console.log('- 16 departments seeded')
  console.log('- 16 courses with syllabi seeded')
  console.log('- 12 verified student users created')
  console.log('- 7 university reviews (including budget-friendly examples from NED)')
  console.log('- 2 department reviews')
  console.log('- 2 course reviews')
  console.log('- 3 instructor reviews')
  console.log('- 2 peer verifications')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .then(async () => {
    await prisma.$disconnect()
  })
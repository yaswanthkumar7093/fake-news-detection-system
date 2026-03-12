// ===== COLLEGE CHATBOT KNOWLEDGE BASE =====
const knowledgeBase = {
  greetings: {
    triggers: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greet', 'start'],
    response: `👋 <strong>Hello! Welcome to EduBot!</strong><br><br>
I'm your dedicated college enquiry assistant, ready to help you with any questions about:<br><br>
• 📋 <strong>Admissions</strong> – eligibility, process, documents<br>
• 📚 <strong>Courses</strong> – UG, PG, diploma programs<br>
• 💰 <strong>Fees & Scholarships</strong> – complete fee structure<br>
• 🏠 <strong>Campus & Hostel</strong> – facilities and accommodation<br>
• 💼 <strong>Placements</strong> – career opportunities<br><br>
What would you like to know? 😊`
  },

  admissions: {
    triggers: ['admission', 'apply', 'application', 'how to join', 'enroll', 'enrollment', 'join', 'intake', 'register', 'registration'],
    response: `📋 <strong>Admission Process</strong><br><br>
<strong>Step-by-Step Guide:</strong><br>
1️⃣ Fill out the <strong>Online Application Form</strong> on our website<br>
2️⃣ Upload required documents<br>
3️⃣ Pay the application fee (₹500)<br>
4️⃣ Appear for Entrance Test / Merit Evaluation<br>
5️⃣ Attend counselling session<br>
6️⃣ Confirm seat by paying admission fee<br><br>
<strong>Application Portal:</strong> admissions.edu.ac.in<br>
<strong>Helpline:</strong> +91-9876543210<br><br>
Would you like to know about <em>eligibility criteria</em> or <em>required documents</em>?`
  },

  eligibility: {
    triggers: ['eligibility', 'eligible', 'criteria', 'requirement', 'qualify', 'qualification', 'marks required', 'percentage required', 'cutoff', 'cut-off'],
    response: `✅ <strong>Eligibility Criteria</strong><br><br>
<strong>🎓 B. Tech / BE:</strong><br>
• 10+2 with Physics, Chemistry & Maths<br>
• Minimum 60% aggregate (55% for SC/ST)<br>
• Valid JEE / State CET score<br><br>
<strong>🎓 BCA / BBA / B.Sc:</strong><br>
• 10+2 in any stream<br>
• Minimum 50% aggregate<br><br>
<strong>🎓 MBA / M.Tech (PG):</strong><br>
• Relevant bachelor's degree<br>
• Minimum 55% aggregate<br>
• Valid CAT / MAT / GATE score<br><br>
<strong>🎓 PhD:</strong><br>
• Master's degree with 55%+<br>
• NET / JRF qualification preferred`
  },

  courses: {
    triggers: ['course', 'program', 'programme', 'degree', 'branch', 'department', 'stream', 'specialization', 'available courses', 'what courses'],
    response: `📚 <strong>Available Programs</strong><br><br>
<strong>🔵 Undergraduate (UG):</strong><br>
• B.Tech – CSE, ECE, EEE, Civil, Mechanical, AI & ML, Data Science<br>
• BCA – Computer Applications<br>
• BBA – Business Administration<br>
• B.Sc – Physics, Chemistry, Mathematics, Statistics<br>
• B.Com – General, Honours<br><br>
<strong>🟣 Postgraduate (PG):</strong><br>
• M.Tech – CSE, AI, VLSI, Structural Engineering<br>
• MBA – Finance, HR, Marketing, Operations<br>
• MCA – Computer Applications<br>
• M.Sc – Data Science, Mathematics<br><br>
<strong>🟢 Diploma & Certificate:</strong><br>
• Various 6-month & 1-year programs in Tech & Management<br><br>
Which program interests you most?`
  },

  fees: {
    triggers: ['fee', 'fees', 'fee structure', 'cost', 'tuition', 'how much', 'price', 'charges', 'payment', 'expenses', 'annual fee'],
    response: `💰 <strong>Fee Structure (Annual)</strong><br><br>
<strong>🔵 B.Tech / BE:</strong><br>
• Tuition Fee: ₹85,000/year<br>
• Development Fee: ₹10,000/year<br>
• Lab & Library: ₹8,000/year<br>
• <strong>Total: ~₹1,03,000/year</strong><br><br>
<strong>🟣 MBA:</strong><br>
• Tuition Fee: ₹75,000/year<br>
• Total: ~₹90,000/year<br><br>
<strong>🔵 BCA / BBA:</strong><br>
• Tuition Fee: ₹45,000/year<br>
• Total: ~₹58,000/year<br><br>
<strong>🏠 Hostel (Optional):</strong><br>
• Boys Hostel: ₹65,000/year (Room + Meals)<br>
• Girls Hostel: ₹68,000/year (Room + Meals)<br><br>
<em>💡 Scholarships available for meritorious students. Ask me about scholarships!</em>`
  },

  scholarships: {
    triggers: ['scholarship', 'financial aid', 'bursary', 'stipend', 'waiver', 'discount', 'merit', 'free seat', 'fund', 'grant'],
    response: `🏆 <strong>Scholarships & Financial Aid</strong><br><br>
<strong>🌟 Merit Scholarships:</strong><br>
• Top 5% scorers – 100% tuition waiver<br>
• 90%+ in 12th – 50% tuition waiver<br>
• 80–90% in 12th – 25% tuition waiver<br><br>
<strong>🎯 Government Schemes:</strong><br>
• PM Vidyalakshmi Education Loan<br>
• SC/ST/OBC Fee Reimbursement<br>
• e-PASS Scholarship (Telangana)<br>
• National Means-cum-Merit Scholarship<br><br>
<strong>🤝 Sports & Cultural:</strong><br>
• State/National level athletes – up to 75% waiver<br>
• Cultural achievers – special consideration<br><br>
<strong>💼 Special:</strong><br>
• Girls Education Scholarship<br>
• Differently-abled students – 30% waiver<br><br>
Contact financial aid office for personalized guidance!`
  },

  hostel: {
    triggers: ['hostel', 'accommodation', 'dorm', 'dormitory', 'stay', 'boarding', 'room', 'residential', 'pg', 'lodge', 'housing'],
    response: `🏠 <strong>Hostel & Accommodation</strong><br><br>
<strong>Boys Hostel:</strong><br>
• Capacity: 800 students<br>
• Room Types: Single (₹90K), Double (₹65K), Triple (₹50K)/year<br>
• Wi-Fi, AC, 24-hour security<br>
• Mess: Breakfast + Lunch + Dinner included<br><br>
<strong>Girls Hostel:</strong><br>
• Capacity: 600 students<br>
• Separate secured campus<br>
• Ladies warden & CCTV surveillance<br>
• Mess + Laundry facilities<br><br>
<strong>🍽️ Mess Facilities:</strong><br>
• Hygienic cafeteria with vegetarian & non-veg options<br>
• RO water, nutritious meals<br><br>
<strong>🛠️ Amenities:</strong><br>
• Power backup, CCTV, Gym, Indoor games, Reading room`
  },

  campus: {
    triggers: ['campus', 'infrastructure', 'facility', 'facilities', 'lab', 'library', 'sports', 'gym', 'canteen', 'internet', 'wifi'],
    response: `🏫 <strong>Campus Facilities</strong><br><br>
<strong>🔬 Academic:</strong><br>
• 50+ state-of-the-art laboratories<br>
• Central Library with 1,00,000+ books & e-journals<br>
• Smart classrooms with digital boards<br>
• Innovation & Research Center<br><br>
<strong>🏅 Sports & Fitness:</strong><br>
• Cricket ground, Football field, Basketball & Tennis courts<br>
• Indoor sports hall – Badminton, TT, Chess<br>
• Fully-equipped Gymnasium<br>
• Olympic-size Swimming Pool<br><br>
<strong>💻 Tech Infrastructure:</strong><br>
• 1 Gbps campus-wide Wi-Fi<br>
• 2000+ computer systems in labs<br><br>
<strong>🍽️ Other Amenities:</strong><br>
• Food Court & Multi-cuisine Cafeteria<br>
• Medical Center & Counselling Cell<br>
• ATM, Transport, Auditorium (2500 seating)`
  },

  placements: {
    triggers: ['placement', 'job', 'career', 'recruit', 'recruiter', 'package', 'salary', 'company', 'hire', 'internship', 'campus placement'],
    response: `💼 <strong>Placement & Career Services</strong><br><br>
<strong>📊 Placement Statistics 2024:</strong><br>
• Overall Placement Rate: <strong>92%</strong><br>
• Highest Package: <strong>₹42 LPA</strong> (Google)<br>
• Average Package: <strong>₹8.5 LPA</strong><br>
• Students placed: <strong>1,200+</strong><br><br>
<strong>🏢 Top Recruiters:</strong><br>
TCS • Infosys • Wipro • Google • Amazon • Microsoft • Accenture • Cognizant • HCL • Capgemini • Deloitte • KPMG • Goldman Sachs<br><br>
<strong>🎯 Career Support:</strong><br>
• Dedicated Training & Placement Cell<br>
• Aptitude & Technical Training (from Sem 3)<br>
• Mock Interviews & Resume Building<br>
• On-campus recruitment drives<br>
• Industry-Academia partnerships`
  },

  exams: {
    triggers: ['entrance', 'exam', 'test', 'jee', 'neet', 'gate', 'cat', 'mat', 'cet', 'accepted exam', 'entrance exam'],
    response: `📝 <strong>Accepted Entrance Exams</strong><br><br>
<strong>🔵 Engineering (B.Tech):</strong><br>
• JEE Main / JEE Advanced<br>
• State-level CET (TS EAMCET, AP EAMCET, MH CET, etc.)<br>
• College Entrance Test (own)<br><br>
<strong>🟣 Management (MBA):</strong><br>
• CAT / MAT / XAT / CMAT<br>
• GMAT (for international students)<br>
• ICET (Telangana / AP)<br><br>
<strong>🟢 PG Engineering (M.Tech):</strong><br>
• GATE Score<br>
• TS/AP PGECET<br><br>
<strong>🔵 Science & Commerce (UG):</strong><br>
• 10+2 merit-based<br>
• No entrance required for most programs<br><br>
<em>💡 Students with high JEE/GATE scores may get direct admission + scholarship!</em>`
  },

  deadlines: {
    triggers: ['deadline', 'last date', 'date', 'schedule', 'when', 'timeline', 'application date', 'open', 'closing'],
    response: `📅 <strong>Important Dates & Deadlines 2025–26</strong><br><br>
<strong>🟢 Phase 1 (UG):</strong><br>
• Applications Open: <strong>March 1, 2025</strong><br>
• Last Date to Apply: <strong>May 31, 2025</strong><br>
• Entrance Exam: <strong>June 15, 2025</strong><br>
• Results: <strong>June 22, 2025</strong><br>
• Counselling: <strong>July 1–10, 2025</strong><br>
• Classes Begin: <strong>August 1, 2025</strong><br><br>
<strong>🟣 Phase 2 (PG):</strong><br>
• Applications Open: <strong>April 1, 2025</strong><br>
• Last Date: <strong>June 30, 2025</strong><br>
• Admission Calls: <strong>July 15, 2025</strong><br>
• Classes Begin: <strong>September 1, 2025</strong><br><br>
<em>⚠️ Apply early! Seats are limited and filled on merit basis.</em>`
  },

  documents: {
    triggers: ['document', 'certificate', 'required documents', 'marksheet', 'original', 'proof', 'id', 'photo', 'transcript'],
    response: `📁 <strong>Required Documents for Admission</strong><br><br>
<strong>Academic Documents:</strong><br>
• 10th Mark Sheet & Certificate<br>
• 12th Mark Sheet & Certificate (for UG)<br>
• Bachelor's Degree & Transcripts (for PG)<br>
• Transfer Certificate (TC)<br>
• Migration Certificate (if applicable)<br><br>
<strong>Identity Proof:</strong><br>
• Aadhaar Card (mandatory)<br>
• Passport / Voter ID / PAN Card<br><br>
<strong>Other Documents:</strong><br>
• 6 Passport-size photographs<br>
• Character Certificate from previous institution<br>
• Caste Certificate (for SC/ST/OBC)<br>
• Income Certificate (for scholarship)<br>
• Entrance Exam Scorecard / Rank Card<br><br>
<em>💡 All originals + 2 self-attested photocopies required at counselling.</em>`
  },

  ranking: {
    triggers: ['ranking', 'rank', 'nirf', 'rating', 'accreditation', 'naac', 'nba', 'recognition', 'award', 'top college', 'best college'],
    response: `🏅 <strong>College Rankings & Accreditations</strong><br><br>
<strong>🌟 National Rankings:</strong><br>
• NIRF Ranking 2024: <strong>Top 150</strong> Engineering Colleges<br>
• India Today: <strong>#38</strong> Best Engineering College<br>
• QS India Rankings: <strong>Band 151–200</strong><br><br>
<strong>✅ Accreditations:</strong><br>
• <strong>NAAC Grade A+</strong> (National Assessment & Accreditation)<br>
• <strong>NBA Accredited</strong> – 8 Engineering Programs<br>
• Recognized by <strong>UGC & AICTE</strong><br>
• Affiliated to <strong>Osmania University</strong><br><br>
<strong>🏆 Achievements:</strong><br>
• ISO 9001:2015 Certified<br>
• Best Placement College Award 2023<br>
• 3 Patents filed by students in 2024`
  },

  faculty: {
    triggers: ['faculty', 'professor', 'teacher', 'staff', 'phd faculty', 'teaching', 'lecturer', 'expert'],
    response: `👩‍🏫 <strong>Faculty & Academic Excellence</strong><br><br>
<strong>Faculty Strength:</strong><br>
• Total Faculty: <strong>350+</strong><br>
• PhD Holders: <strong>68%</strong> of faculty<br>
• Industry Experts as Guest Lecturers: <strong>50+/year</strong><br><br>
<strong>✨ Faculty Highlights:</strong><br>
• Average Teaching Experience: <strong>15+ years</strong><br>
• Published Research Papers: <strong>500+ annually</strong><br>
• Faculty trained at IIT, IIM, and international universities<br>
• Members of IEEE, ACM, ASCE professional bodies<br><br>
<strong>Research & Publications:</strong><br>
• Active research in AI, IoT, Biomedical Engineering, Renewable Energy<br>
• 20+ funded research projects<br>
• Industry collaboration with TCS, Microsoft, Google Research`
  },

  contact: {
    triggers: ['contact', 'phone', 'email', 'address', 'location', 'office', 'reach', 'helpline', 'toll free', 'whatsapp'],
    response: `📞 <strong>Contact Information</strong><br><br>
<strong>📍 Address:</strong><br>
123, Education Nagar, University Road,<br>
Hyderabad – 500001, Telangana, India<br><br>
<strong>📞 Phone Numbers:</strong><br>
• Admissions Helpline: <strong>+91-9876543210</strong><br>
• General Enquiry: <strong>+91-8765432109</strong><br>
• WhatsApp: <strong>+91-9876543210</strong><br><br>
<strong>✉️ Email:</strong><br>
• Admissions: admissions@edu.ac.in<br>
• General: info@edu.ac.in<br>
• Placements: placements@edu.ac.in<br><br>
<strong>🕐 Office Hours:</strong><br>
Monday – Saturday: 9:00 AM – 5:00 PM<br>
Sunday: Closed (Emergency only)`
  },

  transport: {
    triggers: ['transport', 'bus', 'travel', 'commute', 'vehicle', 'pick up', 'drop', 'route', 'distance'],
    response: `🚌 <strong>College Transportation</strong><br><br>
<strong>Bus Routes Available:</strong><br>
• <strong>35+ Bus Routes</strong> covering all major areas of Hyderabad<br>
• Secunderabad, Mehdipatnam, Kukatpally, LB Nagar, Dilsukhnagar, Miyapur<br><br>
<strong>Bus Pass Details:</strong><br>
• Annual Pass: ₹18,000<br>
• Semester Pass: ₹10,000<br>
• Monthly Pass: ₹2,200<br><br>
<strong>🚍 Features:</strong><br>
• GPS-tracked buses<br>
• Dedicated pick-up & drop timings<br>
• Safe & comfortable AC buses available<br>
• Mobile app for live bus tracking`
  },

  default: `🤔 <strong>I'm not sure I understood that.</strong><br><br>
Here are some topics I can help you with:<br><br>
💡 Try asking about:<br>
• "<strong>What are the admission requirements?</strong>"<br>
• "<strong>Tell me about fee structure</strong>"<br>
• "<strong>What courses are available?</strong>"<br>
• "<strong>Tell me about scholarships</strong>"<br>
• "<strong>What is the placement record?</strong>"<br>
• "<strong>How can I contact the college?</strong>"<br><br>
Or click any <em>Quick Topic</em> button to get instant answers! 😊`
};

// ===== STATE =====
let isTyping = false;
let messageCount = 0;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  initNavbar();
  initEnterKey();
  observeFeatureCards();
});

function initChat() {
  const welcomeMsg = `🎓 <strong>Welcome to EduBot – Your College Enquiry Assistant!</strong><br><br>
I'm here to help you with all questions about our college. You can ask me about:<br><br>
📋 Admissions &amp; Eligibility &nbsp;|&nbsp; 📚 Courses &amp; Programs<br>
💰 Fee Structure &nbsp;|&nbsp; 🏆 Scholarships<br>
🏠 Hostel &amp; Campus &nbsp;|&nbsp; 💼 Placements<br>
📝 Entrance Exams &nbsp;|&nbsp; 📞 Contact Info<br><br>
<em>What would you like to know today?</em> 👇`;
  appendMessage('bot', welcomeMsg);
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Active nav link tracking
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

function initEnterKey() {
  const input = document.getElementById('userInput');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

function observeFeatureCards() {
  const cards = document.querySelectorAll('.feature-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// ===== CHAT FUNCTIONS =====
function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text || isTyping) return;

  input.value = '';
  appendMessage('user', text);
  showTyping();

  const delay = Math.random() * 800 + 600; // 600–1400ms
  setTimeout(() => {
    hideTyping();
    const response = getBotResponse(text);
    appendMessage('bot', response);
    messageCount++;
    if (messageCount % 4 === 0) {
      setTimeout(() => appendFollowUp(), 800);
    }
  }, delay);
}

function askQuickQuestion(question) {
  const input = document.getElementById('userInput');
  input.value = question;
  // Scroll to chatbot section
  document.getElementById('chatbot').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => sendMessage(), 400);
}

function getBotResponse(text) {
  const lower = text.toLowerCase();
  for (const [key, entry] of Object.entries(knowledgeBase)) {
    if (key === 'default') continue;
    if (entry.triggers && entry.triggers.some(t => lower.includes(t))) {
      return entry.response;
    }
  }
  return knowledgeBase.default;
}

function appendMessage(sender, content) {
  const container = document.getElementById('chatMessages');
  const row = document.createElement('div');
  row.className = `message-row ${sender === 'user' ? 'user' : ''}`;

  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (sender === 'bot') {
    row.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div>
        <div class="message-bubble bot-bubble">${content}</div>
        <div class="msg-time">${time}</div>
      </div>`;
  } else {
    row.innerHTML = `
      <div class="msg-avatar user-av">👤</div>
      <div>
        <div class="message-bubble user-bubble">${escapeHtml(content)}</div>
        <div class="msg-time">${time}</div>
      </div>`;
  }

  container.appendChild(row);
  scrollToBottom();
}

function appendFollowUp() {
  const followUps = [
    "💡 <em>You might also want to ask about <strong>scholarships</strong> or <strong>hostel facilities</strong>!</em>",
    "📌 <em>Need more help? Ask about <strong>placements</strong> or <strong>campus facilities</strong>!</em>",
    "🎯 <em>Tip: You can ask me about <strong>entrance exams</strong> or <strong>application deadlines</strong>!</em>"
  ];
  const msg = followUps[Math.floor(Math.random() * followUps.length)];
  appendMessage('bot', msg);
}

function showTyping() {
  isTyping = true;
  document.getElementById('typingIndicator').classList.add('visible');
  document.getElementById('sendBtn').disabled = true;
  scrollToBottom();
}

function hideTyping() {
  isTyping = false;
  document.getElementById('typingIndicator').classList.remove('visible');
  document.getElementById('sendBtn').disabled = false;
}

function scrollToBottom() {
  const container = document.getElementById('chatMessages');
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

function clearChat() {
  if (!confirm('Clear all chat messages?')) return;
  document.getElementById('chatMessages').innerHTML = '';
  messageCount = 0;
  setTimeout(() => initChat(), 100);
}

function scrollToChat() {
  document.getElementById('chatbot').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('userInput').focus(), 600);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">About ShopFlow</h1>
        <p className="text-lg text-muted-foreground">Revolutionizing the way you shop online.</p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">⚡</span>
          <h2 className="font-bold text-xl mb-1">Lightning Fast</h2>
          <p className="text-muted-foreground text-center">Built with Vite & React for instant page loads and smooth navigation.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🎨</span>
          <h2 className="font-bold text-xl mb-1">Stunning UI</h2>
          <p className="text-muted-foreground text-center">Modern design powered by Tailwind CSS and custom components.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🔒</span>
          <h2 className="font-bold text-xl mb-1">Secure & Reliable</h2>
          <p className="text-muted-foreground text-center">Supabase integration for secure authentication and data management.</p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Jane Doe", role: "Frontend Lead", img: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "John Smith", role: "Backend Guru", img: "https://randomuser.me/api/portraits/men/46.jpg" },
            { name: "Alex Kim", role: "UI/UX Designer", img: "https://randomuser.me/api/portraits/men/47.jpg" },
          ].map((member) => (
            <div key={member.name} className="bg-white rounded-lg shadow p-4 flex flex-col items-center w-48">
              <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mb-2 object-cover" />
              <div className="font-semibold text-lg">{member.name}</div>
              <div className="text-muted-foreground text-sm">{member.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Journey</h2>
        <ol className="relative border-l-2 border-primary pl-6">
          <li className="mb-8">
            <div className="absolute -left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div className="ml-8">
              <h3 className="font-bold">2024: Idea Born</h3>
              <p className="text-muted-foreground">ShopFlow started as a vision to make online shopping delightful.</p>
            </div>
          </li>
          <li className="mb-8">
            <div className="absolute -left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div className="ml-8">
              <h3 className="font-bold">2025: MVP Launch</h3>
              <p className="text-muted-foreground">Our first version went live, featuring blazing speed and beautiful UI.</p>
            </div>
          </li>
          <li>
            <div className="absolute -left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div className="ml-8">
              <h3 className="font-bold">2025+: Growing Fast</h3>
              <p className="text-muted-foreground">Thousands of happy users and new features every month!</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Testimonials Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="italic mb-2">“ShopFlow is the fastest and most beautiful shopping site I’ve ever used!”</p>
            <div className="font-semibold">— Emily R.</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="italic mb-2">“The UI is just crazy good. I love browsing products here!”</p>
            <div className="font-semibold">— Michael T.</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-extrabold mb-2">Ready to experience ShopFlow?</h2>
        <Link to="/products" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-purple-400 text-white font-bold text-lg shadow hover:scale-105 transition-transform">Shop Now</Link>
      </div>
    </div>
  );
};

export default About;

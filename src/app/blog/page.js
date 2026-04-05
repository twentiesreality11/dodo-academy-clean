'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'The State of Cybersecurity in Nigeria: 2024 Report',
      excerpt: 'An in-depth look at the current cybersecurity landscape in Nigeria, including emerging threats and opportunities for professionals.',
      content: 'Full content here...',
      category: 'Industry News',
      author: 'Dr. Adebayo Ogunlesi',
      date: 'March 15, 2024',
      readTime: '8 min read',
      image: '/images/blog/cybersecurity-nigeria.jpg',
      featured: true
    },
    {
      id: 2,
      title: '5 Critical Infrastructure Vulnerabilities in Nigerian Banks',
      excerpt: 'Discover the most common security gaps in Nigerian banking systems and how to address them effectively.',
      content: 'Full content here...',
      category: 'Critical Infrastructure',
      author: 'Chioma Eze',
      date: 'March 10, 2024',
      readTime: '6 min read',
      image: '/images/blog/bank-security.jpg',
      featured: false
    },
    {
      id: 3,
      title: 'How to Start Your Career in Ethical Hacking',
      excerpt: 'A comprehensive guide for beginners looking to enter the exciting field of ethical hacking and penetration testing.',
      content: 'Full content here...',
      category: 'Career Guide',
      author: 'Samuel Okonkwo',
      date: 'March 5, 2024',
      readTime: '10 min read',
      image: '/images/blog/ethical-hacking.jpg',
      featured: true
    },
    {
      id: 4,
      title: 'Understanding NIST Cybersecurity Framework for Nigerian Organizations',
      excerpt: 'Learn how to implement the NIST framework to protect your organization from cyber threats.',
      content: 'Full content here...',
      category: 'Compliance',
      author: 'Dr. Adebayo Ogunlesi',
      date: 'February 28, 2024',
      readTime: '7 min read',
      image: '/images/blog/nist-framework.jpg',
      featured: false
    },
    {
      id: 5,
      title: 'The Rise of Ransomware Attacks in Nigeria: Prevention Strategies',
      excerpt: 'How Nigerian businesses can protect themselves from the growing threat of ransomware attacks.',
      content: 'Full content here...',
      category: 'Threat Intelligence',
      author: 'Chioma Eze',
      date: 'February 20, 2024',
      readTime: '9 min read',
      image: '/images/blog/ransomware.jpg',
      featured: false
    },
    {
      id: 6,
      title: 'Building a Security Operations Center (SOC) on a Budget',
      excerpt: 'Practical tips for Nigerian organizations to establish effective security monitoring without breaking the bank.',
      content: 'Full content here...',
      category: 'Security Operations',
      author: 'Samuel Okonkwo',
      date: 'February 15, 2024',
      readTime: '12 min read',
      image: '/images/blog/soc-budget.jpg',
      featured: false
    }
  ];

  const categories = ['all', 'Industry News', 'Critical Infrastructure', 'Career Guide', 'Compliance', 'Threat Intelligence', 'Security Operations'];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Dodo Academy Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Insights, news, and expert perspectives on cybersecurity in Nigeria and beyond.
        </p>
      </div>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && searchTerm === '' && selectedCategory === 'all' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.slice(0, 2).map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] h-48 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="bg-[#FFB347] text-[#0B1E33] px-2 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1E33] mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="text-[#FFB347] font-semibold hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-[#0B1E33] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100">
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="bg-[#FFB347] text-[#0B1E33] px-2 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-bold text-lg text-[#0B1E33] mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">By {post.author}</span>
                <Link href={`/blog/${post.id}`} className="text-[#FFB347] text-sm font-semibold hover:underline">
                  Read →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found. Try a different search term.</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-12 bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="mb-4">Get the latest cybersecurity insights delivered to your inbox.</p>
        <form className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-2 rounded-full text-gray-900"
          />
          <button type="submit" className="bg-[#FFB347] text-[#0B1E33] px-6 py-2 rounded-full font-semibold hover:bg-[#FFC97A] transition">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
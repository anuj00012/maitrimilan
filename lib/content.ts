export const testimonials = [
  {
    names: "Ananya & Rohan",
    location: "Pune and Bengaluru",
    community: "Marathi - Kannada families",
    quote:
      "The verified profile flow helped both families feel comfortable before we spoke. The request-first chat made the first conversation respectful and intentional.",
    note: "Sample anonymized story. Replace with a real customer review after written consent."
  },
  {
    names: "Meera & Arjun",
    location: "Delhi and Jaipur",
    community: "North Indian families",
    quote:
      "We liked that MaitriMilan did not rush contact sharing. Our parents could review the profile, and we connected only after both sides accepted interest.",
    note: "Sample anonymized story. Replace with a real customer review after written consent."
  },
  {
    names: "Sara & Ayaan",
    location: "Hyderabad",
    community: "Muslim families",
    quote:
      "The platform felt private and simple. Verification and limited communication made the search more serious than casual social media introductions.",
    note: "Sample anonymized story. Replace with a real customer review after written consent."
  }
];

export const blogPosts = [
  {
    slug: "indian-marriage-traditions-diversity",
    title: "Indian Marriage Traditions: One Country, Many Beautiful Customs",
    excerpt:
      "A respectful overview of how Indian weddings vary across regions, languages, families, and communities.",
    readTime: "4 min read",
    sections: [
      {
        heading: "A Shared Idea With Many Expressions",
        body:
          "Indian marriages often bring together family blessings, community customs, food, music, rituals, and personal values. The exact traditions can change widely from one region to another, but the central idea is usually similar: two people and two families beginning a new relationship with respect."
      },
      {
        heading: "Regional Richness",
        body:
          "A Maharashtrian wedding may include a simple antarpat moment, a Punjabi wedding may be full of energetic sangeet celebrations, a Tamil wedding may highlight traditional temple-inspired rituals, and a Bengali wedding may include graceful customs such as shubho drishti. Each tradition carries its own warmth."
      },
      {
        heading: "Modern Choices",
        body:
          "Many couples today blend traditional ceremonies with modern preferences. Some choose intimate family events, some prefer large celebrations, and some keep rituals simple while focusing on compatibility, consent, education, profession, and shared values."
      }
    ]
  },
  {
    slug: "respecting-religious-diversity-in-matrimony",
    title: "Respecting Religious Diversity In Indian Matrimony",
    excerpt:
      "How a matrimonial platform can support Hindu, Muslim, Sikh, Christian, Buddhist, Jain, and inter-community families with care.",
    readTime: "5 min read",
    sections: [
      {
        heading: "Respect Comes First",
        body:
          "India's matrimonial culture includes many religions, sects, languages, and family expectations. A good platform should never reduce people to labels. Religion and community preferences may matter to families, but respectful communication and honest information matter just as much."
      },
      {
        heading: "Privacy And Choice",
        body:
          "Some members want to mention religion, community, or caste; others prefer to keep details optional. MaitriMilan treats these as profile preferences, not judgments. The goal is to help people search clearly while keeping dignity intact."
      },
      {
        heading: "Inter-Community Conversations",
        body:
          "Inter-community matches need extra sensitivity. Families may need time, context, and respectful conversations. Request-based chat and verified profiles can make these conversations safer and more intentional."
      }
    ]
  },
  {
    slug: "safe-online-matrimony-tips",
    title: "Safe Online Matrimony: Practical Tips For Families",
    excerpt:
      "Simple safety practices for profile verification, first conversations, document privacy, and meeting decisions.",
    readTime: "3 min read",
    sections: [
      {
        heading: "Verify Before Trusting",
        body:
          "A profile should be reviewed before it becomes visible. ID proof must stay private and should never be shown publicly. Families should also ask clear questions about education, profession, city, and expectations."
      },
      {
        heading: "Do Not Share Contact Too Early",
        body:
          "It is safer to begin with platform-based interest requests. Direct phone numbers, addresses, and sensitive details should be shared only when both sides are comfortable."
      },
      {
        heading: "Use Reports And Blocks",
        body:
          "If a user behaves suspiciously, asks for money, gives inconsistent details, or pressures communication, report the profile and stop the conversation. Safety tools are an important part of serious matchmaking."
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

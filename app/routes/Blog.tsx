import type { Route } from ".react-router/types/app/routes/+types/Blog";
import type { Article } from "@/types/blog";
import { getBlogPosts } from "@/lib/strapi";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  // In a real app, we might parse locale from URL or cookies
  const posts = await getBlogPosts(params.lang);
  return { posts, language: params.lang };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;
  const { posts, language } = loaderData as {
    posts: Article[];
    language: string | undefined;
  };

  // Separate featured post (first one) from the rest
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Our <span className="text-blue-400">Journal</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the latest news, guides, and stories from the Aiyu Japan
            team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-blue-500 mr-3 rounded-full"></span>
              Featured Story
            </h2>
            <Link
              to={`/${language}/blog/${featuredPost.slug}`}
              className="group block relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  {featuredPost.cover && (
                    <img
                      src={`${import.meta.env.VITE_STRAPI_URL}${featuredPost.cover.url}`}
                      alt={
                        featuredPost.cover.alternativeText || featuredPost.title
                      }
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-blue-600 font-semibold mb-4">
                    {featuredPost.category && (
                      <span className="bg-blue-50 px-3 py-1 rounded-full">
                        {featuredPost.category.name}
                      </span>
                    )}
                    <span className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Read Article <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="w-2 h-8 bg-gray-300 mr-3 rounded-full"></span>
              Recent Posts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/${language}/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    {post.cover ? (
                      <img
                        src={`${import.meta.env.VITE_STRAPI_URL}${post.cover.url}`}
                        alt={post.cover.alternativeText || post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                        {post.category.name}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      {post.author && (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                      {post.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-blue-600 text-sm font-semibold">
                      Read More{" "}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

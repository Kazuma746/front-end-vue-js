import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPosts } from "~/services/api";
import { StrapiResponse, Post } from "~/types";
import * as React from "react";

export const meta: MetaFunction = () => {
  return [
    { Title: "BlogIt - Accueil" },
    { name: "description", Content: "Bienvenue sur BlogIt!" },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const postsData = await getPosts();
    return json({ posts: postsData });
  } catch (error) {
    console.error("Erreur lors du chargement des articles:", error);
    return json({ posts: { data: [], meta: { pagination: { total: 0 } } } });
  }
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: StrapiResponse<Post> }>();
  const recentPosts = posts.data.slice(0, 6);
  console.log(recentPosts); 

  return (
    <div className="flex flex-col gap-0">
      {/* Bannière principale */}
      <div className="w-full bg-gradient-to-r from-[#BCF4DE] to-[#CDE5D7] py-20 px-4 mb-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">Bienvenue sur BlogIt</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Découvrez des articles inspirants et partagez vos idées avec notre communauté grandissante.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/posts" 
              className="bg-[#DED6D1] hover:bg-[#D0C8C3] text-gray-800 px-8 py-3 rounded-lg font-medium transition shadow-md"
            >
              Explorer les articles
            </Link>
            <Link 
              to="/contact" 
              className="border border-gray-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition text-gray-800"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

      {/* Section des articles récents */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Articles récents</h2>
            {posts.data.length > 6 && (
              <Link 
                to="/posts" 
                className="text-gray-700 hover:underline font-medium"
              >
                Voir tous les articles →
              </Link>
            )}
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts?.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    {post.category && (
                      <span className="bg-[#BCF4DE] px-3 py-1 rounded-full text-sm font-medium text-gray-700 inline-block mb-3 w-fit">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-gray-800">
                      {post.Title}
                    </h3>
                    <div className="text-gray-600 mb-4 flex-grow">
                      {/* Afficher un aperçu du contenu (enlever les balises HTML et limiter) */}
                      {post.content && 
                        post.content
                          .replace(/<[^>]*>/g, '')
                          .slice(0, 120)}
                      {post.attributes?.Content && post.attributes.Content.length > 120 ? '...' : ''}
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-gray-500 text-sm">
                        {new Date(post.PostedAt).toLocaleDateString('fr-FR')}
                      </p>
                      <Link 
                        to={`/posts/${post.id}`}
                        className="text-[#2C7A7B] font-medium hover:underline"
                      >
                        Lire la suite →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun article disponible pour le moment.</p>
              <p className="mt-2 text-gray-500">Revenez bientôt pour découvrir nos nouveaux contenus!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPosts } from "~/services/api";
import { StrapiResponse, Post } from "~/types";
import * as React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tous les articles - BlogIt" },
    { name: "description", content: "Consultez tous nos articles." },
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

export default function Posts() {
  const { posts } = useLoaderData<{ posts: StrapiResponse<Post> }>();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-[#BCF4DE] py-10 px-6 rounded-xl mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Tous les articles</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Explorez notre collection d'articles et découvrez des contenus inspirants sur différents sujets.
        </p>
      </div>
      
      {posts.data.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {posts.data.map((post) => (
            <div 
              key={post.id} 
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition p-6"
            >
              {post.attributes.category && (
                <span className="bg-[#BCF4DE] px-3 py-1 rounded-full text-sm font-medium text-gray-700 inline-block mb-3">
                  {post.attributes.category}
                </span>
              )}
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                <Link 
                  to={`/posts/${post.id}`}
                  className="hover:text-[#2C7A7B] transition"
                >
                  {post.attributes.title}
                </Link>
              </h2>
              
              <div className="text-gray-600 mb-4">
                {/* Afficher un aperçu du contenu (enlever les balises HTML et limiter) */}
                {post.attributes.content && 
                  post.attributes.content
                    .replace(/<[^>]*>/g, '')
                    .slice(0, 150)}
                {post.attributes.content && post.attributes.content.length > 150 ? '...' : ''}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm">
                  Publié le {new Date(post.attributes.postedAt).toLocaleDateString('fr-FR')}
                </p>
                <Link 
                  to={`/posts/${post.id}`}
                  className="text-[#2C7A7B] font-medium hover:underline"
                >
                  Lire l'article complet →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun article disponible pour le moment.</p>
          <p className="mt-2 text-gray-500">Revenez bientôt pour découvrir nos nouveaux contenus!</p>
        </div>
      )}
      
      <div className="mt-10">
        <Link to="/" className="text-[#2C7A7B] hover:underline flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
} 
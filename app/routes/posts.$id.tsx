import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, useParams } from "@remix-run/react";
import { getPost } from "~/services/api";
import { SingleStrapiResponse, Post } from "~/types";
import * as React from "react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.post.data) {
    return [
      { title: "Article non trouvé - Mon Blog" },
      { name: "description", content: "L'article demandé n'existe pas." },
    ];
  }
  return [
    { title: `${data.post.data.attributes.title} - Mon Blog` },
    { name: "description", content: `Lisez notre article: ${data.post.data.attributes.title}` },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  
  if (!id) {
    throw new Response("ID de l'article manquant", { status: 400 });
  }
  
  try {
    const postData = await getPost(id);
    return json({ post: postData });
  } catch (error) {
    console.error(`Erreur lors du chargement de l'article ${id}:`, error);
    throw new Response("Article non trouvé", { status: 404 });
  }
};

export default function PostDetail() {
  const { post } = useLoaderData<{ post: SingleStrapiResponse<Post> }>();

  if (!post.data) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
        <p className="mb-8">L'article que vous cherchez n'existe pas ou a été supprimé.</p>
        <Link to="/posts" className="text-blue-600 hover:underline">
          Retour à la liste des articles
        </Link>
      </div>
    );
  }

  const { title, content, postedAt } = post.data.attributes;
  
  return (
    <article className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">
        Publié le {new Date(postedAt).toLocaleDateString('fr-FR')}
      </p>
      
      <div 
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <div className="border-t pt-6 mt-8">
        <Link to="/posts" className="text-blue-600 hover:underline">
          ← Retour à la liste des articles
        </Link>
      </div>
    </article>
  );
}
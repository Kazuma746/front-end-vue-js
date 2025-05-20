import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMe } from "~/services/api";
import { useContext } from "react";
import { AuthContext } from "~/root";
import * as React from "react";
import { User } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Mon Profil - Mon Blog" },
    { name: "description", content: "Gérez votre profil utilisateur." },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // Cette fonction s'exécute côté serveur, nous devons récupérer le token
  // depuis les cookies car localStorage n'est pas disponible côté serveur
  
  // Puisque nous utilisons localStorage côté client pour gérer l'authentification,
  // nous allons simplement rediriger vers la page de login si le token n'est pas disponible
  // Une vraie application utiliserait des cookies pour conserver l'authentification entre le client et le serveur
  
  return json({ message: "Authentification gérée côté client" });
};

export default function Profile() {
  const { user } = useContext(AuthContext);

  // Vérifier si l'utilisateur est connecté côté client
  React.useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);
  
  // Afficher un message de chargement si l'utilisateur n'est pas encore disponible
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vos informations personnelles telles qu'elles apparaissent sur notre plateforme.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <dl className="divide-y divide-gray-200">
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
                <dd className="text-sm text-gray-900 col-span-2">{user.username}</dd>
              </div>
              
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900 col-span-2">{user.email}</dd>
              </div>
              
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Date d'inscription</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres du compte</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Options de gestion de votre compte.
          </p>
          
          <div className="pt-2">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
                  // Récupérer la fonction logout du contexte d'authentification
                  const { logout } = useContext(AuthContext);
                  logout();
                  window.location.href = "/";
                }
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
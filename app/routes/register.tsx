import { json } from "@remix-run/node";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useActionData, Form, useNavigation, Link } from "@remix-run/react";
import { register } from "~/services/api";
import { useContext } from "react";
import { AuthContext } from "~/root";
import * as React from "react";
import { AuthResponse } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Inscription - Mon Blog" },
    { name: "description", content: "Créez un compte pour participer à notre communauté." },
  ];
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username?: string;
    email?: string;
    password?: string;
  };
  fields?: {
    username: string;
    email: string;
    password: string;
  };
  userData?: AuthResponse;
};

// Validation des données du formulaire
const validateUsername = (username: string) => {
  if (username.length < 3) {
    return "Le nom d'utilisateur doit comporter au moins 3 caractères";
  }
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Veuillez entrer une adresse email valide";
  }
};

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Le mot de passe doit comporter au moins 6 caractères";
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fields = { username, email, password };
  const fieldErrors = {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  try {
    const userData = await register(username, email, password);
    return json({ userData });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return json(
      {
        formError: "Une erreur est survenue lors de l'inscription. Cet email ou nom d'utilisateur est peut-être déjà utilisé.",
        fields,
      },
      { status: 400 }
    );
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { login } = useContext(AuthContext);

  React.useEffect(() => {
    if (actionData?.userData) {
      login(actionData.userData);
      // Rediriger vers la page d'accueil après inscription
      window.location.href = "/";
    }
  }, [actionData, login]);

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Créer un compte</h1>
      
      <Form method="post" className="space-y-6">
        {actionData?.formError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{actionData.formError}</p>
          </div>
        ) : null}
        
        <div>
          <label htmlFor="username" className="block mb-2 font-medium">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={actionData?.fields?.username}
            aria-invalid={Boolean(actionData?.fieldErrors?.username)}
            aria-errormessage={actionData?.fieldErrors?.username ? "username-error" : undefined}
            required
          />
          {actionData?.fieldErrors?.username ? (
            <p className="text-red-600 text-sm mt-1" id="username-error">
              {actionData.fieldErrors.username}
            </p>
          ) : null}
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-errormessage={actionData?.fieldErrors?.email ? "email-error" : undefined}
            required
          />
          {actionData?.fieldErrors?.email ? (
            <p className="text-red-600 text-sm mt-1" id="email-error">
              {actionData.fieldErrors.email}
            </p>
          ) : null}
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-2 font-medium">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={actionData?.fields?.password}
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-errormessage={actionData?.fieldErrors?.password ? "password-error" : undefined}
            required
          />
          {actionData?.fieldErrors?.password ? (
            <p className="text-red-600 text-sm mt-1" id="password-error">
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-700 text-white font-medium py-2 px-4 rounded hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </Form>
      
      <div className="mt-6 text-center">
        <p>
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Connectez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
} 
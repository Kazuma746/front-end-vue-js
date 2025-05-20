import { json, redirect } from "@remix-run/node";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useActionData, Form, useNavigation, Link } from "@remix-run/react";
import { login } from "~/services/api";
import { useContext } from "react";
import { AuthContext } from "~/root";
import * as React from "react";
import { AuthResponse } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Connexion - Mon Blog" },
    { name: "description", content: "Connectez-vous à votre compte." },
  ];
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    identifier?: string;
    password?: string;
  };
  fields?: {
    identifier: string;
    password: string;
  };
  userData?: AuthResponse;
};

// Validation des données du formulaire
const validateIdentifier = (identifier: string) => {
  if (identifier.length < 3) {
    return "Veuillez entrer un identifiant valide (email ou nom d'utilisateur)";
  }
};

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Le mot de passe doit comporter au moins 6 caractères";
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  const fields = { identifier, password };
  const fieldErrors = {
    identifier: validateIdentifier(identifier),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  try {
    const userData = await login(identifier, password);
    return json({ userData });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return json(
      {
        formError: "Identifiants incorrects. Veuillez vérifier vos informations et réessayer.",
        fields,
      },
      { status: 401 }
    );
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { login: authLogin } = useContext(AuthContext);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (actionData?.userData) {
      authLogin(actionData.userData);
      // Rediriger vers la page d'accueil après connexion
      window.location.href = "/";
    }
  }, [actionData, authLogin]);

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Connexion</h1>
      
      <Form ref={formRef} method="post" className="space-y-6">
        {actionData?.formError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{actionData.formError}</p>
          </div>
        ) : null}
        
        <div>
          <label htmlFor="identifier" className="block mb-2 font-medium">
            Email ou nom d'utilisateur
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={actionData?.fields?.identifier}
            aria-invalid={Boolean(actionData?.fieldErrors?.identifier)}
            aria-errormessage={actionData?.fieldErrors?.identifier ? "identifier-error" : undefined}
            required
          />
          {actionData?.fieldErrors?.identifier ? (
            <p className="text-red-600 text-sm mt-1" id="identifier-error">
              {actionData.fieldErrors.identifier}
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
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </button>
      </Form>
      
      <div className="mt-6 text-center">
        <p>
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
} 
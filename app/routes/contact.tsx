import { json, redirect } from "@remix-run/node";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import { submitContactForm } from "~/services/api";
import * as React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Contact - Mon Blog" },
    { name: "description", content: "Contactez-nous pour toute question ou suggestion." },
  ];
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
  fields?: {
    name: string;
    email: string;
    message: string;
  };
  success?: boolean;
};

// Validation des données du formulaire
const validateName = (name: string) => {
  if (!name || name.length < 2) {
    return "Le nom doit comporter au moins 2 caractères";
  }
  return undefined;
};

const validateEmail = (email: string) => {
  if (!email) return "L'email est requis";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Veuillez entrer une adresse email valide";
  }
  return undefined;
};

const validateMessage = (message: string) => {
  if (!message || message.length < 10) {
    return "Le message doit comporter au moins 10 caractères";
  }
  return undefined;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  console.log("Données reçues:", { name, email, message });

  const fields = { name, email, message };
  const fieldErrors = {
    name: validateName(name),
    email: validateEmail(email),
    message: validateMessage(message),
  };

  // Vérifier s'il y a des erreurs de validation
  if (Object.values(fieldErrors).some(Boolean)) {
    console.log("Erreurs de validation:", fieldErrors);
    return json({ fieldErrors, fields }, { status: 400 });
  }

  try {
    console.log("Tentative d'envoi du message...");
    const result = await submitContactForm({ name, email, message });
    console.log("Message envoyé avec succès:", result);
    return json({ success: true, fields });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du formulaire:", error);
    return json(
      {
        formError: error.response?.data?.error?.message || 
                  "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer plus tard.",
        fields
      },
      { status: error.response?.status || 500 }
    );
  }
};

export default function Contact() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      
      {actionData?.success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>Votre message a été envoyé avec succès! Nous vous répondrons dès que possible.</p>
        </div>
      ) : null}
      
      <Form method="post" className="space-y-6">
        {actionData?.formError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{actionData.formError}</p>
          </div>
        ) : null}
        
        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={actionData?.fields?.name}
            aria-invalid={Boolean(actionData?.fieldErrors?.name)}
            aria-errormessage={actionData?.fieldErrors?.name ? "name-error" : undefined}
            required
          />
          {actionData?.fieldErrors?.name ? (
            <p className="text-red-600 text-sm mt-1" id="name-error">
              {actionData.fieldErrors.name}
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
          <label htmlFor="message" className="block mb-2 font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={actionData?.fields?.message}
            aria-invalid={Boolean(actionData?.fieldErrors?.message)}
            aria-errormessage={actionData?.fieldErrors?.message ? "message-error" : undefined}
            required
          />
          {actionData?.fieldErrors?.message ? (
            <p className="text-red-600 text-sm mt-1" id="message-error">
              {actionData.fieldErrors.message}
            </p>
          ) : null}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-700 text-white font-medium py-2 px-4 rounded hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
        </button>
      </Form>
    </div>
  );
} 
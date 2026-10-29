import { supabase } from "./supabase.jsx";

export const signInWithEmail = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUpWithEmail = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  dateOfBirth,
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        first_name: firstName.trim(),
        middle_name: middleName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};
import { supabase } from "./supabase.jsx";

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

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

export const hasMedicalProfile = async (userId) => {
  const { data, error } = await supabase
    .from("medical_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
};

export const getMedicalProfile = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("medical_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const saveMedicineList = async (medicines) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  if (!userData.user) {
    throw new Error("Please sign in before updating your medicines.");
  }

  const { data, error } = await supabase
    .from("medical_profiles")
    .update({
      medicines: medicines.map(({ id, name, time }) => ({
        id,
        name: name.trim(),
        time,
      })),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userData.user.id)
    .select("medicines")
    .single();

  if (error) {
    throw error;
  }

  return data.medicines;
};

export const saveMedicalProfile = async ({
  firstName,
  middleName,
  lastName,
  disease,
  doctorName,
  age,
  medicines,
}) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  if (!userData.user) {
    throw new Error("Please sign in before saving medical information.");
  }

  const { data, error } = await supabase
    .from("medical_profiles")
    .upsert(
      {
        user_id: userData.user.id,
        first_name: firstName.trim(),
        middle_name: middleName.trim() || null,
        last_name: lastName.trim(),
        disease: disease.trim(),
        doctor_name: doctorName.trim(),
        age: Number(age),
        medicines: medicines.map(({ id, name, time }) => ({
          id,
          name: name.trim(),
          time,
        })),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

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
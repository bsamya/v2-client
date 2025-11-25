export function validationErrors(v$: any) {
  const result: Record<string, string[]> = {};

  // Walk through all Vuelidate child states
  Object.keys(v$).forEach(key => {
    const field = v$[key];

    // Only check fields that have $errors (rules)
    if (field?.$errors) {
      result[key] = field.$errors.map((e: any) => e.$message);
    }
  });

  return result;
}
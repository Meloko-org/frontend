/*  Retourne un state errors, utilisé par les inputText pour gérer les erreurs
    et un booléen isValid.
    On doit fournir un state errors, du style:
    const [errors, setErrors] = useState({name: false, etc... })
    et un state fields qui contient tous les inputs, du style :
    const [ fields, setFields ] = useState({ name, firstname, etc... })
*/
type ErrorState = Record<string, boolean>;
type FieldState = Record<string, string | undefined | null>;

export function validateRequiredFields(
  fields: FieldState,
  currentErrors: ErrorState,
) {
  const newErrors: ErrorState = {};

  for (const key of Object.keys(currentErrors)) {
    const value = fields[key];
    newErrors[key] = !value || value.trim() === "";
  }

  const hasErrors = Object.values(newErrors).includes(true);

  return {
    newErrors,
    isValid: !hasErrors,
  };
}

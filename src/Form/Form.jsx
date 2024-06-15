import { useMemo, useState } from "react";
import * as Yup from "yup";

const formSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  age: Yup.number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer")
    .min(18, "Age must be at least 18"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

function FormError({ children }) {
  return <span style={{ color: "red" }}>{children}</span>;
}

export function Form() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const formErrors = useMemo(() => {
    try {
      formSchema.validateSync(formState, { abortEarly: false });
      return {};
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return error.inner.reduce((acc, current) => {
          acc[current.path] = current.message;
          return acc;
        }, {});
      }

      throw error;
    }
  }, [formState]);

  console.log({ formState, formErrors });

  return (
    <form
      onChange={(event) => {
        const target = event.target;

        const name = target.name;

        setFormState({
          ...formState,
          [name]: target.value,
        });
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "200px",
        rowGap: "10px",
      }}
    >
      <label>Name</label>
      <input type="text" name="name" value={formState.name} />
      {formErrors.name && <FormError>{formErrors.name}</FormError>}

      <label>E-mail</label>
      <input type="email" name="email" value={formState.email} />
      {formErrors.email && <FormError>{formErrors.email}</FormError>}

      <label>Password</label>
      <input type="password" name="password" value={formState.password} />
      {formErrors.password && <FormError>{formErrors.password}</FormError>}

      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={formState.confirmPassword}
      />
      {formErrors.confirmPassword && (
        <FormError>{formErrors.confirmPassword}</FormError>
      )}

      <button type="submit" style={{ marginTop: "20px" }}>
        Submit
      </button>
    </form>
  );
}

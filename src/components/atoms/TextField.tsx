import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseProps = { label: string; error?: string; hint?: string };

export function TextField({ label, error, hint, id, className, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id}>{label}{props.required ? <span aria-hidden="true"> *</span> : null}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={errorId ?? hintId} {...props} />
      {hint ? <small id={hintId}>{hint}</small> : null}
      {error ? <p className="field__error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}

export function TextAreaField({ label, error, hint, id, className, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id}>{label}{props.required ? <span aria-hidden="true"> *</span> : null}</label>
      <textarea id={id} aria-invalid={Boolean(error)} aria-describedby={errorId ?? hintId} {...props} />
      {hint ? <small id={hintId}>{hint}</small> : null}
      {error ? <p className="field__error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}

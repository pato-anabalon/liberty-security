export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

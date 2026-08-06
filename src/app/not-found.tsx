import { TrackedCta } from "@/components/molecules/TrackedCta";

export default function NotFound() {
  return <main className="not-found"><p>404</p><h1>This page isn’t part of the Liberty story.</h1><TrackedCta href="/" eventName="not_found_home">Return home</TrackedCta></main>;
}

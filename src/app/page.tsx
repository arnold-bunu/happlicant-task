/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GithubIcon, MailIcon, User2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-600 to-pink-950 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-center text-5xl font-semibold tracking-tight text-white lg:text-[4rem]">
          Happlicant Task
        </h1>
        <p className="max-w-2xl text-center text-lg text-balance text-white/80">
          Thanks for taking the time to complete this technical challenge.
          Please follow the instructions in the README.md file to complete the
          task.
        </p>
        <Link href="https://github.com/esctofreedom/happlicant-task">
          <Button variant="outline" size="lg">
            <GithubIcon className="h-4 w-4" />
            View Repository
          </Button>
        </Link>

        <Link href="/companies">
          <Button variant="outline" size="lg">
            <User2 className="h-4 w-4" />
            Arnold Bunu
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <img
            src="https://avatars.githubusercontent.com/u/61351961?v=4"
            alt="Ricard Avatar"
            className="h-10 w-10 rounded-sm border-2 border-white/30"
          />

          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-white">
                Ricard Torres
              </span>
              {/* Email button */}
              <Link href="mailto:ricard@happlicant.com">
                <Button
                  variant="ghost"
                  className="h-6 w-6 cursor-pointer bg-white/20 p-0 hover:bg-white/30"
                >
                  <MailIcon className="size-2.5 text-white" />
                </Button>
              </Link>
            </div>
            <span className="font-mono text-xs text-white/70">
              Co-founder & CTO @ Happlicant
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

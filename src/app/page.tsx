import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/header.component";
import { Chat } from "@/components/Chat";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header />
      <section
        className="min-h-screen pt-20"
        style={{
          backgroundColor: "#343541",
        }}
      >
        {session ? (
          <div className="p-8">
            <Chat />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
            <p className="text-3xl font-semibold">
              Welcome to AI Email Composer
            </p>
          </div>
        )}
      </section>
    </>
  );
}

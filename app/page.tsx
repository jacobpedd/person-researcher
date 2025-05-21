import CompanyResearcher from "../components/CompanyResearchHome";

export default function Home() {
  return (
    <main className="flex relative min-h-screen flex-col items-center justify-center">

      {/* background grid design texture code */}
      <div className="absolute inset-0 -z-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_0px),linear-gradient(to_bottom,#80808012_1px,transparent_0px)] bg-[size:60px_60px]"></div>

      <CompanyResearcher />
    </main>
  );
}
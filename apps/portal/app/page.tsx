import { APP_NAME, ProductCategory } from "@hiwhale/shared/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="mt-4 text-slate-600">Portal App</p>
      <p className="mt-2 text-sm text-slate-500">{ProductCategory.AGV_FORKLIFT}</p>
    </main>
  );
}

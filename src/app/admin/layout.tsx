export const metadata = {
  title: "NASMO - Administration",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="fr";document.documentElement.classList.add("dark");`,
        }}
      />
      <div className="dark">{children}</div>
    </>
  );
}

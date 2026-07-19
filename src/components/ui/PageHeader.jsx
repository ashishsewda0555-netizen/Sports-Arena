export function PageHeader({ title, breadcrumbText, bgImage, children }) {
  return (
    <div className="page-banner relative" style={{ backgroundImage: 'none' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
          transform: 'scale(1.02)',
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(120deg, rgba(5,20,10,0.85) 0%, rgba(5,20,60,0.75) 55%, rgba(5,20,10,0.85) 100%)',
        }}
      />
      <div className="container mx-auto px-4 relative z-10 text-center">
        {children}
      </div>
    </div>
  );
}

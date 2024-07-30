const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex justify-center items-center  gridient-bg">
      {children}
    </div>
  );
};

export default AuthLayout;

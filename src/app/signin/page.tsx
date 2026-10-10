import AuthForm from "@/components/AuthForm";
import ProtectedRedirectNotice from "@/components/ProtectedRedirectNotice";

export default function SignInPage() {
  return (
    <>
      <ProtectedRedirectNotice />
      <AuthForm mode="signin" />
    </>
  );
}